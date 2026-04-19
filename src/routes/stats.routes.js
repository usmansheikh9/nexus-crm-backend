const express = require('express');
const router = express.Router();
const { getOverview } = require('../controllers/stats.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);
router.get('/overview', getOverview);

module.exports = router;
