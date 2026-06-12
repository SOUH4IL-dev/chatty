const admin = require('firebase-admin');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

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

    req.user = user;
    next();
  } catch (error) {
    console.error('❌ Firebase auth error:', error.code || error.message);
    res.status(401).json({ message: "Token is not valid", error: error.code || error.message });
  }
};

module.exports = authMiddleware;
