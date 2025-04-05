const mongoose = require('mongoose');

const RecommendationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation'
  },
  courses: [{
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 1
    },
    reason: {
      type: String,
      required: true
    },
    category: {
      type: String,
      enum: ['content_based', 'collaborative', 'trending', 'continue_learning', 'because_you_watched'],
      required: true
    },
    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    },
    position: {
      type: Number,
      default: 0
    },
    userFeedback: {
      type: String,
      enum: ['positive', 'negative', 'neutral', 'none'],
      default: 'none'
    },
    clicked: {
      type: Boolean,
      default: false
    },
    enrolled: {
      type: Boolean,
      default: false
    }
  }],
  context: {
    interests: [String],
    goals: [String],
    recentlyViewed: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    }],
    filters: {
      difficulty: [String],
      format: [String],
      duration: {
        min: Number,
        max: Number
      }
    }
  },
  type: {
    type: String,
    enum: ['personalized', 'trending', 'continue_learning', 'because_you_watched', 'similar_users'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    default: function() {
      const now = new Date();
      return new Date(now.setDate(now.getDate() + 7)); // Default 7 days expiration
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

// Index for faster queries
RecommendationSchema.index({ userId: 1, isActive: 1, createdAt: -1 });

module.exports = mongoose.model('Recommendation', RecommendationSchema);
