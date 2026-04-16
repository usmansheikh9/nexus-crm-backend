const express = require('express');
const router = express.Router();
const { getClients, getClient, createClient, updateClient, deleteClient } = require('../controllers/client.controller');
const { protect, authorize } = require('../middleware/auth.middleware');
const { validate, rules } = require('../middleware/validate');

router.use(protect);

router.route('/')
  .get(getClients)
  .post(authorize('admin', 'agent'), validate(rules.createClient), createClient);

router.route('/:id')
  .get(getClient)
  .patch(authorize('admin', 'agent'), validate(rules.updateClient), updateClient)
  .delete(authorize('admin'), deleteClient);

module.exports = router;
