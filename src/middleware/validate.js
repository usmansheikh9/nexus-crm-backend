const { body, validationResult } = require('express-validator');

const validate = (rules) => async (req, res, next) => {
  await Promise.all(rules.map((rule) => rule.run(req)));
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

const rules = {
  register: [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  login: [
    body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  createClient: [
    body('name').trim().notEmpty().withMessage('Client name is required'),
    body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
    body('value').optional().isNumeric().withMessage('Value must be a number'),
  ],
  updateClient: [
    body('email').optional().isEmail().withMessage('Valid email required'),
    body('value').optional().isNumeric().withMessage('Value must be a number'),
  ],
  updateRole: [
    body('role').isIn(['admin', 'agent', 'viewer']).withMessage('Invalid role'),
  ],
};

module.exports = { validate, rules };
