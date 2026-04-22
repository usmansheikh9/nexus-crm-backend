const Client = require('../models/client.model');

async function getOverviewStats(user) {
  const filter = user.role === 'agent' ? { assignedTo: user._id } : {};

  const [totalClients, byStatus, totalValue, recentClients, topAgents] = await Promise.all([
    Client.countDocuments(filter),

    Client.aggregate([
      { $match: filter },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),

    Client.aggregate([
      { $match: { ...filter, status: 'active' } },
      { $group: { _id: null, total: { $sum: '$value' } } },
    ]),

    Client.find(filter)
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('assignedTo', 'name avatar'),

    Client.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: '$assignedTo', clientCount: { $sum: 1 }, totalValue: { $sum: '$value' } } },
      { $sort: { clientCount: -1 } },
      { $limit: 5 },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'agent' } },
      { $unwind: '$agent' },
      { $project: { 'agent.name': 1, 'agent.email': 1, clientCount: 1, totalValue: 1 } },
    ]),
  ]);

  const statusMap = byStatus.reduce((acc, s) => ({ ...acc, [s._id]: s.count }), {});

  return {
    totalClients,
    leads:      statusMap.lead     || 0,
    active:     statusMap.active   || 0,
    inactive:   statusMap.inactive || 0,
    closed:     statusMap.closed   || 0,
    totalValue: totalValue[0]?.total || 0,
    recentClients,
    topAgents,
  };
}

module.exports = { getOverviewStats };
