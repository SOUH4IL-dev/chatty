/**
 * chatRoutes.js
 *
 * Audit #3 — Per-route rate limiting applied.
 * Audit #8 — multer: memoryStorage, 5MB cap, audio MIME filter only.
 * Audit #7 — All routes protected; errors bubble to errorHandler.
 */
const express  = require('express');
const multer   = require('multer');
const router   = express.Router();
const auth     = require('../middlewares/authMiddleware');
const {
  messageLimiter,
  searchLimiter,
  uploadLimiter,
} = require('../middlewares/rateLimiter');
const {
  getChats, getContacts, getMessages, sendMessage,
  searchUsers, markAsSeen, updateMessage, deleteMessage, deleteChat,
} = require('../controllers/chatController');

// Audit #8 — Audio upload: memory buffer, MIME checked, 5MB max
const upload = multer({
  storage: multer.memoryStorage(),
  limits:  { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('audio/')) return cb(null, true);
    cb(Object.assign(new Error('Only audio files are allowed'), { status: 415 }));
  },
});

// All routes require a valid Firebase token
router.use(auth);

router.get('/list',                              getChats);
router.get('/contacts',                          getContacts);
router.get('/messages/:chatId',                  getMessages);
router.get('/search',        searchLimiter,      searchUsers);
router.post('/mark-seen/:chatId', messageLimiter, markAsSeen);
router.put('/message/:messageId', messageLimiter, updateMessage);
router.delete('/message/:messageId',             deleteMessage);
router.delete('/:chatId',                        deleteChat);

// Audit #3 — Upload gets its own stricter limiter (Cloudinary quota)
router.post('/send', uploadLimiter, upload.single('audio'), sendMessage);

module.exports = router;
