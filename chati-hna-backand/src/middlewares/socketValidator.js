/**
 * socketValidator.js — Audit #2 + Audit #3 (socket side)
 *
 * Audit #2 — Socket event payload validation
 * Severity: CRITICAL
 * Risk: Malformed payloads (null, undefined, missing fields) crash the
 * server silently. A client can send { to: null } and cause
 * io.to(`user_null`).emit(...) — broadcasting to a garbage room or
 * worse, emitting to ALL clients if "null" accidentally matches.
 *
 * Audit #3 — Per-socket rate limiting
 * Severity: MEDIUM
 * Risk: A single socket can flood call-user / ice-candidate events
 * at thousands per second, saturating the event loop.
 *
 * Design: all validators return { valid: boolean, error?: string }.
 * Callers decide whether to silently drop or emit an error back.
 */

const mongoose = require('mongoose');

// ─── ObjectId validation ───────────────────────────────────────────────────
const isValidObjectId = (id) =>
  typeof id === 'string' && mongoose.Types.ObjectId.isValid(id);

// ─── Payload validators ────────────────────────────────────────────────────

const validateCallUser = ({ to, offer, type } = {}) => {
  if (!isValidObjectId(to))
    return { valid: false, error: 'call-user: invalid "to" field' };
  if (!offer || typeof offer !== 'object')
    return { valid: false, error: 'call-user: invalid "offer" field' };
  if (!['audio', 'video'].includes(type))
    return { valid: false, error: 'call-user: type must be "audio" or "video"' };
  return { valid: true };
};

const validateAnswerCall = ({ to, answer } = {}) => {
  if (!isValidObjectId(to))
    return { valid: false, error: 'answer-call: invalid "to" field' };
  if (!answer || typeof answer !== 'object')
    return { valid: false, error: 'answer-call: invalid "answer" field' };
  return { valid: true };
};

const validateIceCandidate = ({ to, candidate } = {}) => {
  if (!isValidObjectId(to))
    return { valid: false, error: 'ice-candidate: invalid "to" field' };
  if (!candidate || typeof candidate !== 'object')
    return { valid: false, error: 'ice-candidate: invalid "candidate" field' };
  return { valid: true };
};

const validateEndCall = ({ to } = {}) => {
  if (!isValidObjectId(to))
    return { valid: false, error: 'end-call: invalid "to" field' };
  return { valid: true };
};

// ─── Per-socket rate limiter ───────────────────────────────────────────────
/**
 * Audit #3 — Socket rate limiter
 * Tracks event counts per socket in a rolling time window.
 * Limits per window (1 minute):
 *   call-user      → 10  (prevents call spam)
 *   ice-candidate  → 200 (normal WebRTC negotiation volume)
 *   answer-call    → 10
 *   end-call       → 20
 *
 * @returns {(socketId: string, event: string) => boolean}
 *   Returns true if the event is allowed, false if rate limited.
 */
const createSocketRateLimiter = () => {
  // Map<socketId, Map<event, { count, resetAt }>>
  const counters = new Map();

  const LIMITS = {
    'call-user':     { max: 10,  windowMs: 60_000 },
    'answer-call':   { max: 10,  windowMs: 60_000 },
    'ice-candidate': { max: 200, windowMs: 60_000 },
    'end-call':      { max: 20,  windowMs: 60_000 },
  };

  const isAllowed = (socketId, event) => {
    const limit = LIMITS[event];
    if (!limit) return true; // unlisted events not rate-limited here

    if (!counters.has(socketId)) counters.set(socketId, new Map());
    const socketCounters = counters.get(socketId);

    const now  = Date.now();
    const data = socketCounters.get(event) || { count: 0, resetAt: now + limit.windowMs };

    // Reset window
    if (now > data.resetAt) {
      data.count   = 0;
      data.resetAt = now + limit.windowMs;
    }

    data.count++;
    socketCounters.set(event, data);

    return data.count <= limit.max;
  };

  // Audit #6 — Cleanup: remove counters when socket disconnects
  const cleanup = (socketId) => {
    counters.delete(socketId);
  };

  return { isAllowed, cleanup };
};

module.exports = {
  validateCallUser,
  validateAnswerCall,
  validateIceCandidate,
  validateEndCall,
  createSocketRateLimiter,
};
