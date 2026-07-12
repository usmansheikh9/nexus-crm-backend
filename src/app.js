require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const mongoose = require('mongoose');
const { connectDB } = require('./config/db');
const AppError = require('./utils/AppError');
const logger = require('./utils/logger');

const app = express();

connectDB();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);

app.use(express.json({ limit: '10kb' }));
app.use(mongoSanitize());
app.use(hpp());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/api/auth',    require('./routes/auth.routes'));
app.use('/api/clients', require('./routes/client.routes'));
app.use('/api/users',   require('./routes/user.routes'));
app.use('/api/stats',   require('./routes/stats.routes'));

app.get('/api/health/db', async (req, res) => {
  try {
    await mongoose.connection.db.admin().command({ ping: 1 });
    res.status(200).json({ success: true, message: 'Database reachable' });
  } catch (err) {
    logger.error('Database health check failed', err);
    res.status(503).json({ success: false, message: 'Database unreachable' });
  }
});

app.use((req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
});

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV === 'development') {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      stack: err.stack,
    });
  }

  if (err.isOperational) {
    return res.status(err.statusCode).json({ success: false, message: err.message });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ success: false, message: 'Invalid resource ID.' });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({ success: false, message: `${field} already in use.` });
  }

  logger.error('Unhandled error', err);
  res.status(500).json({ success: false, message: 'Something went wrong.' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));

module.exports = app;
