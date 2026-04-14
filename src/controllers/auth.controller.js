const asyncHandler = require('../utils/asyncHandler');
const { sendResponse } = require('../utils/response');
const { registerUser, loginUser } = require('../services/auth.service');

exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  const { user, token } = await registerUser({ name, email, password, role });
  sendResponse(res, { statusCode: 201, data: { user, token } });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { user, token } = await loginUser({ email, password });
  sendResponse(res, { data: { user, token } });
});

exports.getMe = (req, res) => {
  sendResponse(res, { data: req.user });
};

exports.logout = (req, res) => {
  sendResponse(res, { message: 'Logged out successfully.' });
};
