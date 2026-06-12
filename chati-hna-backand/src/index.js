const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const admin = require('firebase-admin');
const User = require('./models/User');

// Firebase Admin SDK — no credential file needed for verifyIdToken() (uses Google public keys)
const firebaseProjectId = process.env.FIREBASE_PROJECT_ID;
if (firebaseProjectId) {
  admin.initializeApp({ projectId: firebaseProjectId });
  console.log('✅ Firebase Admin initialized (projectId:', firebaseProjectId, ')');
} else {
  console.warn('⚠️  FIREBASE_PROJECT_ID not set — Firebase auth will fail');
  admin.initializeApp();
}

const app = express();
const server = http.createServer(app);

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

// Socket.io setup with restricted CORS
const io = new Server(server, {
  cors: {
    origin: CLIENT_URL,
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Socket auth middleware — verify Firebase token on handshake
io.use(async (socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) {
    return next(new Error('Authentication required'));
  }
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    const { uid, email, name: firebaseName, picture } = decoded;

    let user = await User.findOne({ firebaseUid: uid });
    if (!user) {
      user = await User.create({
        firebaseUid: uid,
        name: firebaseName || email.split('@')[0],
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

// ======================
// DATABASE CONNECTION
// ======================
const dbUrl = process.env.MONGO_URI || process.env.DATABASE_URL;

console.log('Attempting MongoDB connection...');
console.log('DB:', dbUrl ? 'Loaded ✔' : 'Missing ❌');

mongoose.connect(dbUrl, {
  serverSelectionTimeoutMS: 5000,
})
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch((err) => {
    console.error('❌ MongoDB error:', err.message);
  });

mongoose.connection.on('error', err => {
  console.error('Mongoose error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});


// ======================
// MIDDLEWARES
// ======================
app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use((req, res, next) => {
  req.io = io;
  next();
});


// ======================
// ROUTES
// ======================
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));

app.get('/', (req, res) => {
  res.send('PrivateChat API is running 🚀');
});


// ======================
// SOCKET.IO LOGIC
// ======================
io.on('connection', (socket) => {
  const user = socket.data.user;

  // Auto-join authenticated user to their room
  socket.join(`user_${user._id}`);
  User.findByIdAndUpdate(user._id, { status: 'online' }).catch(err =>
    console.error('Socket online update error:', err)
  );
  io.emit('user_status', { userId: user._id, status: 'online' });

  socket.on('disconnect', async () => {
    const lastSeen = new Date();
    try {
      await User.findByIdAndUpdate(user._id, { status: 'offline', lastSeen });
      io.emit('user_status', { userId: user._id, status: 'offline', lastSeen });
    } catch (err) {
      console.error('Socket disconnect error:', err);
    }
  });

  // Calling system
  socket.on('call-user', ({ to, offer, fromName, type }) => {
    io.to(`user_${to}`).emit('incoming-call', {
      from: user._id,
      fromName,
      offer,
      type
    });
  });

  socket.on('answer-call', ({ to, answer }) => {
    io.to(`user_${to}`).emit('call-answered', { answer });
  });

  socket.on('ice-candidate', ({ to, candidate }) => {
    io.to(`user_${to}`).emit('ice-candidate', { candidate });
  });

  socket.on('end-call', ({ to }) => {
    io.to(`user_${to}`).emit('call-ended');
  });
});


// ======================
// START SERVER (FIXED)
// ======================
const PORT = process.env.PORT || 5000;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app;