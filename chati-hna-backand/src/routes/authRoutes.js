/**
 * authRoutes.js — Audit #3 + Audit #8
 *
 * authLimiter prevents profile-update spam.
 * Avatar upload validated at controller level (base64 → Cloudinary).
 */
const express = require('express');
const router  = express.Router();
const { getMe, updateProfile } = require('../controllers/authController');
const auth        = require('../middlewares/authMiddleware');
const { authLimiter } = require('../middlewares/rateLimiter');

router.get('/me',  auth, getMe);
router.put('/me',  auth, authLimiter, updateProfile);

module.exports = router;
