/**
 * index.js — Production server
 *
 * Audit #3  — generalLimiter on all HTTP routes; socket rate limiter per event.
 * Audit #4  — Multi-device tracking: Map<userId, Set<socketId>>
 *             → offline only when ALL sockets of that user disconnect.
 * Audit #6  — Memory leak prevention: activeConnections cleaned on disconnect;
 *             no dangling listeners; socketRateLimiter cleaned on disconnect.
 * Audit #7  — process-level handlers for uncaughtException / unhandledRejection.
 * Audit #8  — Helmet security headers; CORS locked to CLIENT_URL;
 *             JSON body limit reduced to 1mb (no more base64 audio).
 */

const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

require('dotenv').config();

const express    = require('express');
const http       = require('http');
const { Server } = require('socket.io');
const cors       = require('cors');
const helmet     = require('helmet');
const mongoose   = require('mongoose');
const admin      = require('firebase-admin');

const User         = require('./models/User');
const errorHandler = require('./middlewares/errorHandler');
const { generalLimiter } = require('./middlewares/rateLimiter');
const {
  validateCallUser,
  validateAnswerCall,
  validateIceCandidate,
  validateEndCall,
  createSocketRateLimiter,
} = require('./middlewares/socketValidator');

// ─── Firebase Admin ────────────────────────────────────────────────────────
const firebaseProjectId = process.env.FIREBASE_PROJECT_ID;
if (firebaseProjectId) {
  admin.initializeApp({ projectId: firebaseProjectId });
  console.log('✅ Firebase Admin initialized (projectId:', firebaseProjectId, ')');
} else {
  console.warn('⚠️  FIREBASE_PROJECT_ID not set — auth will fail');
  admin.initializeApp();
}

// ─── Audit #4 — Multi-device connection tracker ────────────────────────────
// Map<userId:string, Set<socketId:string>>
const activeConnections = new Map();

const addConnection = (userId, socketId) => {
  if (!activeConnections.has(userId)) activeConnections.set(userId, new Set());
  activeConnections.get(userId).add(socketId);
};

// Returns remaining connection count after removal
const removeConnection = (userId, socketId) => {
  const sockets = activeConnections.get(userId);
  if (!sockets) return 0;
  sockets.delete(socketId);
  if (sockets.size === 0) { activeConnections.delete(userId); return 0; }
  return sockets.size;
};

// ─── App setup ─────────────────────────────────────────────────────────────
const app    = express();
const server = http.createServer(app);

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

// ─── Audit #8 — Security headers ──────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }, // allow CDN images
}));

// ─── Audit #8 — CORS locked to known frontend origin ──────────────────────
const corsOptions = { origin: CLIENT_URL, credentials: true };
app.use(cors(corsOptions));

// ─── Audit #8 — Small body limit (audio now via multipart) ────────────────
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// ─── Audit #3 — Global HTTP rate limiter ──────────────────────────────────
app.use(generalLimiter);

// ─── Inject io into every request ─────────────────────────────────────────
const io = new Server(server, {
  cors:          corsOptions,
  pingTimeout:   60_000,
  pingInterval:  25_000,
});

app.use((req, _res, next) => { req.io = io; next(); });

// ─── Routes ────────────────────────────────────────────────────────────────
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));
app.get('/', (_req, res) => res.send('PrivateChat API is running 🚀'));

// ─── Audit #7 — Centralized error handler (must be last) ──────────────────
app.use(errorHandler);

// ─── Socket.IO auth middleware (Audit #8) ─────────────────────────────────
io.use(async (socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error('Authentication required'));

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    const { uid, email, name: firebaseName, picture } = decoded;

    let user = await User.findOne({ firebaseUid: uid });
    if (!user) {
      user = await User.create({
        firebaseUid: uid,
        name:  firebaseName || email.split('@')[0],
        email,
        image: picture || null,
      });
    }

    socket.data.user = user;
    next();
  } catch (err) {
    console.error('❌ Socket auth error:', err.code || err.message);
    next(new Error('Authentication failed'));
  }
});

// ─── Socket.IO events ──────────────────────────────────────────────────────
// Audit #3 — One rate limiter instance shared across all sockets
const socketRL = createSocketRateLimiter();

io.on('connection', (socket) => {
  const user   = socket.data.user;
  const userId = user._id.toString();

  // Join personal room
  socket.join(`user_${userId}`);

  // Audit #4 — track connection; go online only on first device
  addConnection(userId, socket.id);
  if (activeConnections.get(userId)?.size === 1) {
    User.findByIdAndUpdate(userId, { status: 'online' })
      .catch((e) => console.error('Status online error:', e));
    io.emit('user_status', { userId, status: 'online' });
  }

  // ── Disconnect ────────────────────────────────────────────────────────────
  socket.on('disconnect', async () => {
    // Audit #6 — cleanup rate limiter state for this socket
    socketRL.cleanup(socket.id);

    // Audit #4 — only go offline when ALL devices disconnect
    const remaining = removeConnection(userId, socket.id);
    if (remaining === 0) {
      const lastSeen = new Date();
      try {
        await User.findByIdAndUpdate(userId, { status: 'offline', lastSeen });
        io.emit('user_status', { userId, status: 'offline', lastSeen });
      } catch (err) {
        console.error('Socket disconnect error:', err);
      }
    }
  });

  // ─── WebRTC signaling — validated + rate-limited ─────────────────────────

  // Audit #2 — payload validated; Audit #3 — rate limited
  socket.on('call-user', (payload) => {
    if (!socketRL.isAllowed(socket.id, 'call-user')) return;
    const { valid, error } = validateCallUser(payload);
    if (!valid) { socket.emit('error', { event: 'call-user', message: error }); return; }

    const { to, offer, type } = payload;
    io.to(`user_${to}`).emit('incoming-call', {
      from:     userId,     // Audit #8 — always server-side verified ID
      fromName: user.name,  // cannot be spoofed by client
      offer,
      type,
    });
  });

  socket.on('answer-call', (payload) => {
    if (!socketRL.isAllowed(socket.id, 'answer-call')) return;
    const { valid, error } = validateAnswerCall(payload);
    if (!valid) { socket.emit('error', { event: 'answer-call', message: error }); return; }

    io.to(`user_${payload.to}`).emit('call-answered', { answer: payload.answer });
  });

  socket.on('ice-candidate', (payload) => {
    if (!socketRL.isAllowed(socket.id, 'ice-candidate')) return;
    const { valid, error } = validateIceCandidate(payload);
    if (!valid) { socket.emit('error', { event: 'ice-candidate', message: error }); return; }

    io.to(`user_${payload.to}`).emit('ice-candidate', { candidate: payload.candidate });
  });

  socket.on('end-call', (payload) => {
    if (!socketRL.isAllowed(socket.id, 'end-call')) return;
    const { valid, error } = validateEndCall(payload);
    if (!valid) { socket.emit('error', { event: 'end-call', message: error }); return; }

    io.to(`user_${payload.to}`).emit('call-ended');
  });

  // Audit #6 — error handler prevents crash on malformed events
  socket.on('error', (err) => {
    console.error(`[socket ${socket.id}] error:`, err.message);
  });
});

// ─── MongoDB ───────────────────────────────────────────────────────────────
const dbUrl = process.env.MONGO_URI || process.env.DATABASE_URL;
console.log('DB:', dbUrl ? 'Loaded ✔' : 'Missing ❌');

mongoose
  .connect(dbUrl, { serverSelectionTimeoutMS: 5000 })
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB error:', err.message));

mongoose.connection.on('error',        (err) => console.error('Mongoose error:', err));
mongoose.connection.on('disconnected', ()    => console.log('MongoDB disconnected'));

// ─── Audit #7 — Process-level safety nets ─────────────────────────────────
process.on('unhandledRejection', (reason) => {
  console.error('🔴 Unhandled rejection:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('🔴 Uncaught exception:', err.message);
  // Let Railway restart the process — do not swallow
  process.exit(1);
});

// ─── Start ─────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app;
