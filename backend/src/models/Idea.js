const mongoose = require('mongoose');

const ideaSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters'],
  },
  problemStatement: {
    type: String,
    required: [true, 'Please provide a problem statement'],
    maxlength: [500, 'Problem statement cannot be more than 500 characters'],
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
  },
  difficultyScore: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  marketPotential: {
    type: Number,
    required: true,
    min: 1,
    max: 4, // Mapping Low=1, Medium=2, High=3, Massive=4
  },
  visibilityStatus: {
    type: String,
    enum: ['active', 'hidden'],
    default: 'active',
  },
  upvotes: {
    type: Number,
    default: 0,
  },
  views: {
    type: Number,
    default: 0,
  },
  expiryTime: {
    type: Date,
  },
  isArchived: {
    type: Boolean,
    default: false,
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  // We'll also store who upvoted to prevent multiple upvotes as an enhancement
  upvotedBy: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for IdeaScore
ideaSchema.virtual('ideaScore').get(function() {
  return (this.marketPotential * 2) + this.difficultyScore + this.upvotes;
});

module.exports = mongoose.model('Idea', ideaSchema);
