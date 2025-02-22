const mongoose = require('mongoose');

const waitlistSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  discord: {
    type: String,
    trim: true,
    default: ''
  },
  telegram: {
    type: String,
    trim: true,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Waitlist = mongoose.model('Waitlist', waitlistSchema);
module.exports = Waitlist;