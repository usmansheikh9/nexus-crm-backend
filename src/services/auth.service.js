const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const AppError = require('../utils/AppError');

function signToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

async function registerUser({ name, email, password, role }) {
  const existing = await User.findOne({ email });
  if (existing) throw new AppError('Email already in use.', 409);

  const user = await User.create({ name, email, password, role });
  const token = signToken(user._id);
  return { user, token };
}

async function loginUser({ email, password }) {
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid credentials.', 401);
  }

  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  const token = signToken(user._id);
  return { user, token };
}

module.exports = { registerUser, loginUser };
