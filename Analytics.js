const mongoose = require('mongoose');

const AnalyticsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  },
  eventType: {
    type: String,
    enum: [
      'page_view', 
      'course_view', 
      'search', 
      'recommendation_impression', 
      'recommendation_click',
      'enrollment', 
      'completion', 
      'rating', 
      'conversation_start',
      'conversation_message',
      'conversation_recommendation'
    ],
    required: true
  },
  metadata: {
    query: String,
    results: Number,
    filters: Object,
    recommendationType: String,
    recommendationPosition: Number,
    recommendationScore: Number,
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation'
    },
    messageCount: Number,
    duration: Number,
    referrer: String,
    device: String,
    browser: String
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  sessionId: {
    type: String
  },
  ipAddress: {
    type: String
  }
});

// Index for faster analytics queries
AnalyticsSchema.index({ userId: 1, eventType: 1, timestamp: -1 });
AnalyticsSchema.index({ courseId: 1, eventType: 1, timestamp: -1 });
AnalyticsSchema.index({ eventType: 1, timestamp: -1 });

module.exports = mongoose.model('Analytics', AnalyticsSchema);
