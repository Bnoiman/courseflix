const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  messages: [{
    sender: {
      type: String,
      enum: ['user', 'ai'],
      required: true
    },
    content: {
      type: String,
      required: true
    },
    intent: String,
    entities: [{
      type: {
        type: String,
        enum: ['subject', 'skill', 'level', 'format', 'goal', 'time'],
        required: true
      },
      value: {
        type: String,
        required: true
      }
    }],
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  state: {
    type: String,
    enum: ['onboarding', 'discovery', 'recommendation', 'feedback', 'completed'],
    default: 'onboarding'
  },
  context: {
    currentIntent: String,
    activeEntities: [{
      type: {
        type: String,
        enum: ['subject', 'skill', 'level', 'format', 'goal', 'time']
      },
      value: String
    }],
    lastRecommendations: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    }]
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  lastActivityAt: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

// Update lastActivityAt on new messages
ConversationSchema.pre('save', function(next) {
  if (this.isModified('messages')) {
    this.lastActivityAt = Date.now();
  }
  next();
});

module.exports = mongoose.model('Conversation', ConversationSchema);
