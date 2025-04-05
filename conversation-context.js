// CourseFlixAI Conversation Context Manager
// This module manages the context for AI conversations, combining all conversation components

const { analyzeIntent, extractEntities, analyzeSentiment } = require('./conversation');
const { ConversationManager, CONVERSATION_STATES } = require('./conversation-manager');
const { PreferenceTracker } = require('./preference-tracker');
const { ConversationHistoryTracker } = require('./conversation-history');

/**
 * Class for managing the complete conversation context
 */
class ConversationContextManager {
  /**
   * Create a new conversation context manager
   * @param {Object} options - Configuration options
   */
  constructor(options = {}) {
    this.conversationManager = new ConversationManager(options.conversationOptions);
    this.preferenceTracker = new PreferenceTracker(options.preferenceOptions);
    this.historyTracker = new ConversationHistoryTracker(options.historyOptions);
  }

  /**
   * Initialize a new conversation context
   * @param {string} userId - User identifier
   * @param {string} conversationId - Conversation identifier
   * @returns {Object} New conversation context
   */
  initializeContext(userId, conversationId) {
    return {
      conversation: this.conversationManager.initializeConversation(),
      preferences: this.preferenceTracker.initializePreferences(),
      history: this.historyTracker.initializeHistory(userId, conversationId),
      userId,
      conversationId,
      metadata: {
        startedAt: new Date().toISOString(),
        lastUpdatedAt: new Date().toISOString(),
        platform: 'web',
        userAgent: '',
        sessionId: '',
        referrer: ''
      }
    };
  }

  /**
   * Process a user message and update the conversation context
   * @param {Object} context - Current conversation context
   * @param {string} message - User message
   * @param {Object} metadata - Additional metadata about the message
   * @returns {Object} Updated conversation context with AI response
   */
  async processMessage(context, message, metadata = {}) {
    try {
      // Create a new context object to avoid mutation
      const newContext = JSON.parse(JSON.stringify(context));
      
      // Update metadata
      newContext.metadata.lastUpdatedAt = new Date().toISOString();
      Object.assign(newContext.metadata, metadata);
      
      // Add user message to history
      newContext.history = this.historyTracker.addMessage(
        newContext.history, 
        'user', 
        message, 
        { sentiment: analyzeSentiment(message) }
      );
      
      // Analyze intent
      const intentResult = await analyzeIntent(message);
      
      // Extract entities
      const entities = extractEntities(message);
      
      // Update user preferences
      newContext.preferences = this.preferenceTracker.updatePreferences(
        newContext.preferences,
        entities,
        message
      );
      
      // Process message with conversation manager
      newContext.conversation = await this.conversationManager.processMessage(
        message,
        newContext.conversation
      );
      
      // Get AI response
      const aiResponse = newContext.conversation.lastResponse;
      
      // Add AI response to history
      newContext.history = this.historyTracker.addMessage(
        newContext.history,
        'assistant',
        aiResponse,
        {
          conversationState: newContext.conversation.state,
          intent: intentResult.label,
          topics: this._extractTopicsFromEntities(entities)
        }
      );
      
      return {
        context: newContext,
        response: aiResponse,
        state: newContext.conversation.state
      };
    } catch (error) {
      console.error('Error processing message:', error);
      return {
        context,
        response: "I'm sorry, I encountered an error processing your message. Could you try rephrasing or asking something else?",
        state: context.conversation.state || CONVERSATION_STATES.DISCOVERY
      };
    }
  }

  /**
   * Extract topics from entities for history tracking
   * @param {Object} entities - Extracted entities
   * @returns {Array} List of topics
   * @private
   */
  _extractTopicsFromEntities(entities) {
    const topics = [];
    
    // Add subjects as topics
    if (entities.subject && entities.subject.length > 0) {
      topics.push(...entities.subject);
    }
    
    // Add skills as topics
    if (entities.skill && entities.skill.length > 0) {
      topics.push(...entities.skill);
    }
    
    return topics;
  }

  /**
   * Get conversation summary
   * @param {Object} context - Conversation context
   * @returns {Object} Conversation summary
   */
  getConversationSummary(context) {
    const conversationSummary = this.conversationManager.getConversationSummary(context.conversation);
    const historySummary = this.historyTracker.generateSummary(context.history);
    const topPreferences = this.preferenceTracker.getTopPreferences(context.preferences);
    
    return {
      conversationId: context.conversationId,
      userId: context.userId,
      state: conversationSummary.state,
      turns: conversationSummary.turns,
      duration: historySummary.duration,
      topPreferences,
      topicsDiscussed: historySummary.topicsDiscussed,
      startedAt: context.metadata.startedAt,
      lastUpdatedAt: context.metadata.lastUpdatedAt
    };
  }

  /**
   * Generate recommendation parameters from conversation context
   * @param {Object} context - Conversation context
   * @returns {Object} Recommendation parameters
   */
  generateRecommendationParams(context) {
    // Convert preferences to query parameters
    const preferenceParams = this.preferenceTracker.preferencesToQueryParams(context.preferences);
    
    // Add conversation state information
    const params = {
      ...preferenceParams,
      conversationId: context.conversationId,
      userId: context.userId,
      conversationState: context.conversation.state,
      conversationTurns: context.conversation.turns,
      timestamp: new Date().toISOString()
    };
    
    return params;
  }

  /**
   * Save the conversation context to persistent storage
   * @param {Object} context - Conversation context
   * @param {Object} storage - Storage provider
   * @returns {boolean} Success status
   */
  async saveContext(context, storage) {
    try {
      await storage.saveConversationContext(context.conversationId, context);
      return true;
    } catch (error) {
      console.error('Error saving conversation context:', error);
      return false;
    }
  }

  /**
   * Load conversation context from persistent storage
   * @param {string} conversationId - Conversation identifier
   * @param {Object} storage - Storage provider
   * @returns {Object} Loaded conversation context
   */
  async loadContext(conversationId, storage) {
    try {
      return await storage.loadConversationContext(conversationId);
    } catch (error) {
      console.error('Error loading conversation context:', error);
      return null;
    }
  }
}

module.exports = {
  ConversationContextManager
};
