const asyncHandler = require('../utils/asyncHandler');
const { sendResponse } = require('../utils/response');
const { getOverviewStats } = require('../services/stats.service');

exports.getOverview = asyncHandler(async (req, res) => {
  const data = await getOverviewStats(req.user);
  sendResponse(res, { data });
});
