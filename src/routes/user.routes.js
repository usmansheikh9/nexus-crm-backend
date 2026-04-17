const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const { protect, authorize } = require('../middleware/auth.middleware');
const { validate, rules } = require('../middleware/validate');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const { sendResponse } = require('../utils/response');

router.use(protect);

router.get('/', authorize('admin'), asyncHandler(async function (req, res) {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  sendResponse(res, { data: users });
}));

router.patch('/:id/role', authorize('admin'), validate(rules.updateRole), asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true });
  if (!user) throw new AppError('User not found.', 404);
  sendResponse(res, { data: user });
}));

module.exports = router;
