const mongoose = require('mongoose');
const { CLIENT_STATUS, CLIENT_PRIORITY, CLIENT_SOURCE } = require('../utils/constants');

const activitySchema = new mongoose.Schema({
  action:      { type: String, required: true },
  performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  note:        { type: String, default: '' },
  createdAt:   { type: Date, default: Date.now },
});

const clientSchema = new mongoose.Schema(
  {
    name:       { type: String, required: true, trim: true },
    email:      { type: String, required: true, lowercase: true },
    company:    { type: String, trim: true },
    phone:      { type: String },
    status:     { type: String, enum: Object.values(CLIENT_STATUS),   default: CLIENT_STATUS.LEAD },
    priority:   { type: String, enum: Object.values(CLIENT_PRIORITY), default: CLIENT_PRIORITY.MEDIUM },
    value:      { type: Number, default: 0 },
    tags:       [{ type: String }],
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    createdBy:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    notes:      { type: String, default: '' },
    activity:   [activitySchema],
    source:     { type: String, enum: Object.values(CLIENT_SOURCE), default: CLIENT_SOURCE.OTHER },
    closedAt:   { type: Date, default: null },
  },
  { timestamps: true }
);

clientSchema.index({ status: 1, assignedTo: 1 });
clientSchema.index({ email: 1 });
clientSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Client', clientSchema);
