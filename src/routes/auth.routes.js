const express = require('express');
const router = express.Router();
const { register, login, getMe, logout } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');
const { validate, rules } = require('../middleware/validate');

router.post('/register', validate(rules.register), register);
router.post('/login', validate(rules.login), login);
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);

module.exports = router;
