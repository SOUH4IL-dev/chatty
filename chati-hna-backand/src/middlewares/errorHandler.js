/**
 * errorHandler.js — Audit #7
 *
 * Severity: MEDIUM
 * Risk: Without a centralized handler, unhandled promise rejections
 * produce either silent 500s with stack traces exposed to the client,
 * or crash the process entirely.
 *
 * This middleware must be registered LAST in Express (after all routes).
 * It normalizes every error into a consistent JSON shape.
 */

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  // Never expose raw stack traces in production
  const isDev = process.env.NODE_ENV === 'development';

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ message: messages.join(', ') });
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    return res.status(409).json({ message: 'Duplicate entry' });
  }

  // Mongoose cast error (invalid ObjectId in URL param)
  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid ID format' });
  }

  // Multer errors (file size, wrong type)
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ message: 'File too large (max 5 MB)' });
  }
  if (err.message === 'Only audio files are allowed') {
    return res.status(415).json({ message: err.message });
  }

  // Application errors with explicit status
  const status  = err.status || err.statusCode || 500;
  const message = err.message || 'Internal server error';

  console.error(`[${req.method}] ${req.path} → ${status}: ${message}`);
  if (isDev) console.error(err.stack);

  return res.status(status).json({
    message,
    ...(isDev && { stack: err.stack }),
  });
};

module.exports = errorHandler;
