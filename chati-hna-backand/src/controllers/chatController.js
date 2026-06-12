/**
 * chatController.js
 *
 * Audit #4 — Authorization: every chatId and messageId is verified
 *            against the authenticated user before any DB write.
 * Audit #7 — All async handlers use try/catch and pass to next(err).
 * Audit #8 — MIME validation on audio upload; base64 stripped from body.
 * Audit #1 — N+1 removed: getChats reads lastMessage from Chat snapshot.
 * Audit #2 — Race condition: Chat.create wrapped with 11000 catch.
 */

const Chat      = require('../models/Chat');
const Message   = require('../models/Message');
const User      = require('../models/User');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

// ─── Cloudinary streaming upload (Audit #8) ───────────────────────────────
const uploadStream = (buffer, folder) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: 'video', folder },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });

// ─── getChats ──────────────────────────────────────────────────────────────
const getChats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Audit #1 — Single query; lastMessage comes from snapshot field
    const chats = await Chat.find({
      $or: [{ userOneId: userId }, { userTwoId: userId }],
    })
      .populate('userOneId', 'name image status lastSeen')
      .populate('userTwoId', 'name image status lastSeen')
      .sort({ lastMessageAt: -1, updatedAt: -1 })
      .lean();

    const formatted = chats.map((chat) => {
      const otherUser =
        chat.userOneId._id.toString() === userId.toString()
          ? chat.userTwoId
          : chat.userOneId;

      return {
        id: chat._id,
        otherUser: {
          id:       otherUser._id,
          name:     otherUser.name,
          image:    otherUser.image,
          status:   otherUser.status,
          lastSeen: otherUser.lastSeen,
        },
        lastMessage: chat.lastMessage
          ? {
              content:   chat.lastMessage,
              type:      chat.lastMessageType,
              isSeen:    chat.seenBy?.length > 0,
              senderId:  chat.lastMessageBy,
              createdAt: chat.lastMessageAt,
            }
          : null,
        updatedAt: chat.updatedAt,
      };
    });

    res.json(formatted);
  } catch (err) {
    next(err);
  }
};

// ─── getMessages ───────────────────────────────────────────────────────────
const getMessages = async (req, res, next) => {
  try {
    const { chatId } = req.params;
    const userId = req.user._id;

    // Audit #4 — verify participation before returning any data
    const chat = await Chat.findOne({
      _id: chatId,
      $or: [{ userOneId: userId }, { userTwoId: userId }],
    });
    if (!chat) return res.status(403).json({ message: 'Access denied' });

    // Audit #1 — index { chatId, createdAt } covers this query
    const messages = await Message.find({ chatId })
      .populate('senderId', 'name')
      .sort({ createdAt: 1 })
      .lean();

    res.json(messages.map(fmt));
  } catch (err) {
    next(err);
  }
};

// ─── sendMessage ───────────────────────────────────────────────────────────
const sendMessage = async (req, res, next) => {
  try {
    const { receiverId, content } = req.body;
    const senderId = req.user._id;

    if (!receiverId) return res.status(400).json({ message: 'Receiver required' });

    // Audit #4 — receiver must exist
    const receiver = await User.findById(receiverId).lean();
    if (!receiver) return res.status(404).json({ message: 'Receiver not found' });

    if (!content && !req.file)
      return res.status(400).json({ message: 'Content or audio required' });

    if (content && content.length > 5000)
      return res.status(400).json({ message: 'Message too long (max 5000 chars)' });

    // Audit #8 — MIME verified by multer fileFilter in route
    let audioUrl = null;
    let type     = 'text';

    if (req.file) {
      const result = await uploadStream(req.file.buffer, 'chat_audio');
      audioUrl = result.secure_url;
      type     = 'audio';
    }

    // Audit #2 — race-safe chat creation
    let chat;
    const [id1, id2] = [senderId.toString(), receiverId.toString()].sort();

    try {
      chat = await Chat.findOneAndUpdate(
        { userOneId: id1, userTwoId: id2 },
        { $setOnInsert: { userOneId: id1, userTwoId: id2 } },
        { upsert: true, new: true }
      );
    } catch (err) {
      if (err.code === 11000) {
        // Concurrent insert already created it
        chat = await Chat.findOne({
          $or: [
            { userOneId: id1, userTwoId: id2 },
            { userOneId: id2, userTwoId: id1 },
          ],
        });
      } else throw err;
    }

    const message = await Message.create({
      chatId:   chat._id,
      senderId,
      content:  content || '',
      type,
      audioUrl,
    });

    const populated = await Message.findById(message._id)
      .populate('senderId', 'name')
      .lean();

    // Update Chat snapshot (eliminates N+1 for future getChats calls)
    await Chat.findByIdAndUpdate(chat._id, {
      lastMessage:     content || (type === 'audio' ? '🎤 Voice message' : ''),
      lastMessageType: type,
      lastMessageAt:   message.createdAt,
      lastMessageBy:   senderId,
      seenBy:          [],   // reset seen on new message
    });

    const result = fmt(populated);

    // Real-time delivery
    req.io.to(`user_${receiverId}`).emit('receive_message', result);

    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

// ─── getContacts ───────────────────────────────────────────────────────────
const getContacts = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } })
      .select('name email image status lastSeen')
      .sort({ name: 1 })
      .lean();
    res.json(users);
  } catch (err) {
    next(err);
  }
};

// ─── searchUsers ───────────────────────────────────────────────────────────
const searchUsers = async (req, res, next) => {
  try {
    const { query } = req.query;
    const userId    = req.user._id;

    if (!query || query.length > 200)
      return res.json({ users: [], messages: [] });

    const users = await User.find({
      $and: [
        { _id: { $ne: userId } },
        {
          $or: [
            { name:  { $regex: query, $options: 'i' } },
            { email: { $regex: query, $options: 'i' } },
          ],
        },
      ],
    })
      .select('name email image status lastSeen')
      .lean();

    // Audit #4 — only search messages in chats the user belongs to
    const chats   = await Chat.find({ $or: [{ userOneId: userId }, { userTwoId: userId }] }).lean();
    const chatIds = chats.map((c) => c._id);

    const rawMessages = await Message.find({
      chatId:  { $in: chatIds },
      content: { $regex: query, $options: 'i' },
    })
      .populate('chatId')
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    const messages = await Promise.all(
      rawMessages.map(async (msg) => {
        const chat = msg.chatId;
        const otherId =
          chat.userOneId.toString() === userId.toString()
            ? chat.userTwoId
            : chat.userOneId;
        const otherUser = await User.findById(otherId)
          .select('name image status')
          .lean();
        return {
          id:        msg._id,
          content:   msg.content,
          createdAt: msg.createdAt,
          chatId:    chat._id,
          otherUser,
        };
      })
    );

    res.json({ users, messages });
  } catch (err) {
    next(err);
  }
};

// ─── markAsSeen ────────────────────────────────────────────────────────────
const markAsSeen = async (req, res, next) => {
  try {
    const { chatId } = req.params;
    const userId     = req.user._id;

    // Audit #4 — verify user is in this chat before any write
    const chat = await Chat.findOne({
      _id: chatId,
      $or: [{ userOneId: userId }, { userTwoId: userId }],
    });
    if (!chat) return res.status(403).json({ message: 'Access denied' });

    // Mark individual messages (Audit #1 — index covers this)
    await Message.updateMany(
      { chatId, senderId: { $ne: userId }, isSeen: false },
      { $set: { isSeen: true, seenAt: new Date() } }
    );

    // Update Chat snapshot seenBy
    await Chat.findByIdAndUpdate(chatId, {
      $addToSet: { seenBy: userId },
    });

    const otherUserId = chat.getOtherUserId(userId);
    req.io
      .to(`user_${otherUserId}`)
      .emit('messages_seen', { chatId, seenBy: userId });

    res.json({ message: 'Messages marked as seen' });
  } catch (err) {
    next(err);
  }
};

// ─── updateMessage ─────────────────────────────────────────────────────────
const updateMessage = async (req, res, next) => {
  try {
    const { messageId } = req.params;
    const { content }   = req.body;
    const userId        = req.user._id;

    if (!content || content.length > 5000)
      return res.status(400).json({ message: 'Content required (max 5000 chars)' });

    // Audit #4 — senderId check prevents editing other users' messages
    const message = await Message.findOne({ _id: messageId, senderId: userId });
    if (!message) return res.status(404).json({ message: 'Message not found or unauthorized' });

    message.content = content;
    await message.save();

    const chat        = await Chat.findById(message.chatId);
    const otherUserId = chat.getOtherUserId(userId);

    req.io.to(`user_${otherUserId}`).emit('message_updated', {
      messageId,
      content,
      chatId: message.chatId,
    });

    res.json({ id: message._id, content: message.content, chatId: message.chatId });
  } catch (err) {
    next(err);
  }
};

// ─── deleteMessage ─────────────────────────────────────────────────────────
const deleteMessage = async (req, res, next) => {
  try {
    const { messageId } = req.params;
    const userId        = req.user._id;

    // Audit #4 — ownership check before delete
    const message = await Message.findOne({ _id: messageId, senderId: userId });
    if (!message) return res.status(404).json({ message: 'Message not found or unauthorized' });

    const { chatId } = message;
    await Message.deleteOne({ _id: messageId });

    const chat = await Chat.findById(chatId);
    if (chat) {
      const otherUserId = chat.getOtherUserId(userId);

      // Re-sync snapshot if deleted message was the last one
      if (
        chat.lastMessageAt &&
        message.createdAt.getTime() === chat.lastMessageAt.getTime()
      ) {
        const newLast = await Message.findOne({ chatId })
          .sort({ createdAt: -1 })
          .lean();

        await Chat.findByIdAndUpdate(chatId, {
          lastMessage:     newLast?.content ?? null,
          lastMessageType: newLast?.type    ?? 'text',
          lastMessageAt:   newLast?.createdAt ?? null,
          lastMessageBy:   newLast?.senderId  ?? null,
          seenBy:          [],
        });
      }

      req.io.to(`user_${otherUserId}`).emit('message_deleted', { messageId, chatId });
    }

    res.json({ message: 'Message deleted' });
  } catch (err) {
    next(err);
  }
};

// ─── deleteChat ────────────────────────────────────────────────────────────
const deleteChat = async (req, res, next) => {
  try {
    const { chatId } = req.params;
    const userId     = req.user._id;

    // Audit #4 — user must be a participant
    const chat = await Chat.findOne({
      _id: chatId,
      $or: [{ userOneId: userId }, { userTwoId: userId }],
    });
    if (!chat) return res.status(404).json({ message: 'Chat not found' });

    const otherUserId = chat.getOtherUserId(userId);

    await Message.deleteMany({ chatId });
    await Chat.deleteOne({ _id: chatId });

    req.io.to(`user_${otherUserId}`).emit('chat_deleted', { chatId });

    res.json({ message: 'Chat deleted' });
  } catch (err) {
    next(err);
  }
};

// ─── Format helper ─────────────────────────────────────────────────────────
const fmt = (msg) => ({
  id:        msg._id,
  chatId:    msg.chatId,
  senderId:  msg.senderId?._id || msg.senderId,
  sender:    msg.senderId,
  content:   msg.content,
  type:      msg.type || 'text',
  audioUrl:  msg.audioUrl,
  isSeen:    msg.isSeen,
  createdAt: msg.createdAt,
});

module.exports = {
  getChats,
  getMessages,
  sendMessage,
  getContacts,
  searchUsers,
  markAsSeen,
  updateMessage,
  deleteMessage,
  deleteChat,
};
