const mongoose = require('mongoose');

const interactionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['view', 'like', 'message'],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  initiator: {
    type: String,
    enum: ['referee', 'referrer'],
    required: true
  },
  content: String
});

const referralSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  referee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  referrer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'shortlisted', 'referred', 'rejected', 'hired'],
    default: 'pending'
  },
  notes: String,
  interactions: [interactionSchema]
}, {
  timestamps: true
});

// Create indexes
referralSchema.index({ job: 1 });
referralSchema.index({ referee: 1 });
referralSchema.index({ referrer: 1 });
referralSchema.index({ status: 1 });
referralSchema.index({ createdAt: -1 });

const Referral = mongoose.model('Referral', referralSchema);

module.exports = Referral; 