/**
 * Chat.js
 *
 * Audit #1  — Index strategy: compound unique covers userOneId prefix;
 *             lastMessageAt index serves sort without filesort.
 * Audit #5  — seenBy:[ObjectId] replaces Boolean — answers "seen by whom"
 *             without ambiguity, naturally extensible to group chats.
 * Audit #2  — lastMessageType enum trimmed to implemented values only.
 */
const mongoose  = require('mongoose');
const ObjectId  = mongoose.Schema.Types.ObjectId;

const chatSchema = new mongoose.Schema(
  {
    userOneId: { type: ObjectId, ref: 'User', required: true },
    userTwoId: { type: ObjectId, ref: 'User', required: true },

    // Denormalized snapshot — eliminates N+1 on getChats()
    lastMessage:     { type: String, default: null },
    lastMessageType: { type: String, enum: ['text', 'audio'], default: 'text' },
    lastMessageAt:   { type: Date,   default: null },
    lastMessageBy:   { type: ObjectId, ref: 'User', default: null },

    // Audit #5 — seenBy array: empty = unseen, contains otherUserId = seen
    seenBy: { type: [{ type: ObjectId, ref: 'User' }], default: [] },
  },
  { timestamps: true, versionKey: false }
);

// Audit #1 — Primary: uniqueness + fast pair lookup (covers userOneId prefix)
chatSchema.index({ userOneId: 1, userTwoId: 1 }, { unique: true });

// Audit #1 — Sort: chat list ordered by latest message activity
chatSchema.index({ lastMessageAt: -1 });

// Convenience: resolve other participant without ternary clutter
chatSchema.methods.getOtherUserId = function (userId) {
  return this.userOneId.toString() === userId.toString()
    ? this.userTwoId
    : this.userOneId;
};

module.exports = mongoose.model('Chat', chatSchema);
