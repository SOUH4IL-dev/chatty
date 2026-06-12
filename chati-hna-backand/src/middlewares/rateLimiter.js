/**
 * rateLimiter.js — Audit #3
 *
 * Severity: CRITICAL
 * Risk: Without rate limiting, a single client can flood the API with
 * thousands of requests/second — exhausting DB connections, Cloudinary
 * quota, and crashing the Railway dyno.
 *
 * Three separate limiters with appropriate windows for each use-case:
 *   messageLimiter  — 60 messages/min  (generous for normal use)
 *   searchLimiter   — 30 searches/min  (debounced on frontend anyway)
 *   uploadLimiter   — 10 uploads/min   (Cloudinary quota protection)
 *   authLimiter     — 20 requests/15m  (brute force protection)
 */
const rateLimit = require('express-rate-limit');

const json429 = (req, res) =>
  res.status(429).json({ message: 'Too many requests. Please slow down.' });

// Chat message sending
const messageLimiter = rateLimit({
  windowMs: 60 * 1000,   // 1 minute
  max: 60,
  handler: json429,
  standardHeaders: true,
  legacyHeaders: false,
});

// Search endpoint (debounced on client but still protect server)
const searchLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  handler: json429,
  standardHeaders: true,
  legacyHeaders: false,
});

// Audio upload (Cloudinary quota protection)
const uploadLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  handler: json429,
  standardHeaders: true,
  legacyHeaders: false,
});

// Auth endpoints (profile update, etc.)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  handler: json429,
  standardHeaders: true,
  legacyHeaders: false,
});

// General API limiter (fallback for all routes)
const generalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 200,
  handler: json429,
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  messageLimiter,
  searchLimiter,
  uploadLimiter,
  authLimiter,
  generalLimiter,
};
