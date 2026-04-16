const asyncHandler = require('../utils/asyncHandler');
const { sendResponse } = require('../utils/response');
const clientService = require('../services/client.service');

exports.getClients = asyncHandler(async (req, res) => {
  const { clients, total, page, pages } = await clientService.listClients({
    user: req.user,
    query: req.query,
  });
  sendResponse(res, { data: clients, meta: { total, page, pages } });
});

exports.getClient = asyncHandler(async (req, res) => {
  const client = await clientService.getClientById(req.params.id, req.user);
  sendResponse(res, { data: client });
});

exports.createClient = asyncHandler(async (req, res) => {
  const client = await clientService.createClient(req.body, req.user._id);
  sendResponse(res, { statusCode: 201, data: client });
});

exports.updateClient = asyncHandler(async (req, res) => {
  const client = await clientService.updateClient(req.params.id, req.body, req.user._id);
  sendResponse(res, { data: client });
});

exports.deleteClient = asyncHandler(async (req, res) => {
  await clientService.deleteClient(req.params.id);
  sendResponse(res, { message: 'Client deleted.' });
});
