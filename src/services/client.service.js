const Client = require('../models/client.model');
const AppError = require('../utils/AppError');

async function listClients({ user, query }) {
  const { status, priority, assignedTo, search, page = 1, limit = 20 } = query;

  const filter = {};
  if (user.role === 'agent') filter.assignedTo = user._id;
  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (assignedTo) filter.assignedTo = assignedTo;
  if (search) {
    filter.$or = [
      { name:    { $regex: search, $options: 'i' } },
      { email:   { $regex: search, $options: 'i' } },
      { company: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);
  const [clients, total] = await Promise.all([
    Client.find(filter)
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Client.countDocuments(filter),
  ]);

  return {
    clients,
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
  };
}

async function getClientById(id, user) {
  const client = await Client.findById(id)
    .populate('assignedTo', 'name email avatar role')
    .populate('createdBy', 'name')
    .populate('activity.performedBy', 'name avatar');

  if (!client) throw new AppError('Client not found.', 404);

  if (user.role === 'agent' && String(client.assignedTo?._id) !== String(user._id)) {
    throw new AppError('Not authorized.', 403);
  }

  return client;
}

async function createClient(data, userId) {
  const client = await Client.create({ ...data, createdBy: userId });
  await client.updateOne({
    $push: { activity: { action: 'Client created', performedBy: userId } },
  });
  return client;
}

async function updateClient(id, data, userId) {
  const { note, ...updateData } = data;
  const client = await Client.findByIdAndUpdate(
    id,
    {
      ...updateData,
      $push: {
        activity: {
          action: `Updated: ${Object.keys(updateData).join(', ')}`,
          performedBy: userId,
          note: note || '',
        },
      },
    },
    { new: true, runValidators: true }
  ).populate('assignedTo', 'name email avatar');

  if (!client) throw new AppError('Client not found.', 404);
  return client;
}

async function deleteClient(id) {
  const client = await Client.findByIdAndDelete(id);
  if (!client) throw new AppError('Client not found.', 404);
  return client;
}

module.exports = { listClients, getClientById, createClient, updateClient, deleteClient };
