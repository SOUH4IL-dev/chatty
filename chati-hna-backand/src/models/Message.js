/**
 * Message.js
 *
 * Audit #1 — Two compound indexes:
 *   { chatId, createdAt } — covered query for getMessages()
 *   { chatId, senderId, isSeen } — fast markAsSeen() updateMany
 * Audit #2 — enum trimmed to implemented values only.
 * Audit #5 — isSeen/seenAt kept for per-message read accuracy.
 */
const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const messageSchema = new mongoose.Schema(
  {
    chatId:   { type: ObjectId, ref: 'Chat', required: true },
    senderId: { type: ObjectId, ref: 'User', required: true },
    content:  { type: String,  default: '' },
    type:     { type: String,  enum: ['text', 'audio'], default: 'text' },
    audioUrl: { type: String,  default: null },
    isSeen:   { type: Boolean, default: false },
    seenAt:   { type: Date,    default: null  },
  },
  { timestamps: true, versionKey: false }
);

// Audit #1 — getMessages(): filter chatId + sort createdAt (covered query)
messageSchema.index({ chatId: 1, createdAt: -1 });

// Audit #1 — markAsSeen(): find unseen messages by other user fast
messageSchema.index({ chatId: 1, senderId: 1, isSeen: 1 });

module.exports = mongoose.model('Message', messageSchema);
