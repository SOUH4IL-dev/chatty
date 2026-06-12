/**
 * authController.js
 *
 * Audit #7 — next(err) on all async handlers.
 * Audit #8 — Avatar upload: MIME prefix check, 5MB size limit,
 *            strip non-image data: URIs before Cloudinary upload.
 */
const User      = require('../models/User');
const cloudinary = require('../config/cloudinary');

// Allowed image MIME prefixes in base64 data URIs
const ALLOWED_IMAGE_TYPES = ['data:image/jpeg', 'data:image/png', 'data:image/webp', 'data:image/gif'];

// Rough size check: base64 string length * 0.75 ≈ bytes
const MAX_AVATAR_BYTES = 5 * 1024 * 1024; // 5 MB

const getMe = async (req, res, next) => {
  try {
    res.json({
      user: {
        id:    req.user._id,
        name:  req.user.name,
        email: req.user.email,
        image: req.user.image,
      },
    });
  } catch (err) {
    next(err);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { name, image, email } = req.body;

    // Audit #8 — name sanitization
    if (typeof name === 'string') {
      const trimmed = name.trim();
      if (trimmed.length < 1 || trimmed.length > 50)
        return res.status(400).json({ message: 'Name must be 1–50 characters' });
    }

    let imageUrl = image;

    if (image && typeof image === 'string' && image.startsWith('data:')) {
      // Audit #8 — MIME type validation on avatar upload
      const isAllowed = ALLOWED_IMAGE_TYPES.some((t) => image.startsWith(t));
      if (!isAllowed)
        return res.status(415).json({ message: 'Avatar must be JPEG, PNG, WebP or GIF' });

      // Audit #8 — size check (approximate)
      const base64Data = image.split(',')[1] || '';
      const approxBytes = Math.ceil((base64Data.length * 3) / 4);
      if (approxBytes > MAX_AVATAR_BYTES)
        return res.status(413).json({ message: 'Avatar too large (max 5 MB)' });

      const uploadResponse = await cloudinary.uploader.upload(image, {
        folder: 'chat_avatars',
        transformation: [{ width: 400, height: 400, crop: 'fill' }],
        allowed_formats: ['jpg', 'png', 'webp', 'gif'],
      });
      imageUrl = uploadResponse.secure_url;
    }

    const updateFields = {};
    if (name)     updateFields.name  = name.trim();
    if (imageUrl) updateFields.image = imageUrl;
    if (email)    updateFields.email = email;

    const user = await User.findByIdAndUpdate(req.user._id, updateFields, { new: true });

    res.json({
      user: { id: user._id, name: user.name, email: user.email, image: user.image },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getMe, updateProfile };
