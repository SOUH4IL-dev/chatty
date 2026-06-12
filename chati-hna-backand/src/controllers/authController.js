const User = require('../models/User');
const cloudinary = require('../config/cloudinary');

const getMe = async (req, res) => {
  res.json({
    user: { id: req.user._id, name: req.user.name, email: req.user.email, image: req.user.image }
  });
};

const updateProfile = async (req, res) => {
  try {
    const { name, image, email } = req.body;

    if (typeof name === 'string') {
      const trimmed = name.trim();
      if (trimmed.length < 1 || trimmed.length > 50) {
        return res.status(400).json({ message: "Name must be 1-50 characters" });
      }
    }

    let imageUrl = image;

    if (image && image.startsWith('data:image')) {
      const uploadResponse = await cloudinary.uploader.upload(image, {
        folder: 'chat_avatars',
        transformation: [
          { width: 400, height: 400, crop: 'fill' }
        ]
      });
      imageUrl = uploadResponse.secure_url;
    }

    const updateFields = { name, image: imageUrl };
    if (email) updateFields.email = email;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateFields,
      { new: true }
    );

    res.json({
      user: { id: user._id, name: user.name, email: user.email, image: user.image }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMe, updateProfile };
