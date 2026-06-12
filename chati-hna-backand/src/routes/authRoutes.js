const express = require('express');
const router = express.Router();
const { getMe, updateProfile } = require('../controllers/authController');
const auth = require('../middlewares/authMiddleware');

router.get('/me', auth, getMe);
router.put('/me', auth, updateProfile);

module.exports = router;
