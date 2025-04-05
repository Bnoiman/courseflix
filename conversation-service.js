// CourseFlixAI AI Conversation Service
// This module provides the main service interface for the AI conversation system

const { ConversationContextManager } = require('./conversation-context');

/**
 * Class for providing AI conversation services
 */
class ConversationService {
  /**
   * Create a new conversation service
   * @param {Object} options - Configuration options
   */
  constructor(options = {}) {
    this.contextManager = new ConversationContextManager(options);
    this.storage = options.storage || null;
    this.recommendationEngine = options.recommendationEngine || null;
    this.analyticsService = options.analyticsService || null;
  }

  /**
   * Start a new conversation
   * @param {string} userId - User identifier
   * @param {Object} metadata - Additional metadata
   * @returns {Object} New conversation data
   */
  async startConversation(userId, metadata = {}) {
    // Generate conversation ID
    const conversationId = this._generateConversationId();
    
    // Initialize conversation context
    const context = this.contextManager.initializeContext(userId, conversationId);
    
    // Add metadata
    Object.assign(context.metadata, metadata);
    
    // Generate welcome message
    const welcomeResponse = "Hi there! I'm Flex, your personal learning assistant. What would you like to learn today?";
    
    // Add assistant message to history
    context.history = context.historyTracker.addMessage(
      context.history,
      'assistant',
      welcomeResponse,
      { conversationState: context.conversation.state }
    );
    
    // Save context if storage is available
    if (this.storage) {
      await this.contextManager.saveContext(context, this.storage);
    }
    
    // Log analytics if service is available
    if (this.analyticsService) {
      this.analyticsService.logConversationStart(userId, conversationId, metadata);
    }
    
    return {
      conversationId,
      message: welcomeResponse,
      context
    };
  }

  /**
   * Send a message in an existing conversation
   * @param {string} conversationId - Conversation identifier
   * @param {string} userId - User identifier
   * @param {string} message - User message
   * @param {Object} metadata - Additional metadata
   * @returns {Object} Response data
   */
  async sendMessage(conversationId, userId, message, metadata = {}) {
    // Load existing context or initialize new one if not found
    let context;
    
    if (this.storage) {
      context = await this.contextManager.loadContext(conversationId, this.storage);
    }
    
    if (!context) {
      context = this.contextManager.initializeContext(userId, conversationId);
    }
    
    // Process the message
    const result = await this.contextManager.processMessage(context, message, metadata);
    
    // Get recommendations if in recommendation state
    let recommendations = [];
    if (result.state === 'recommendation' && this.recommendationEngine) {
      const recommendationParams = this.contextManager.generateRecommendationParams(result.context);
      recommendations = await this.recommendationEngine.getRecommendations(recommendationParams);
    }
    
    // Save updated context if storage is available
    if (this.storage) {
      await this.contextManager.saveContext(result.context, this.storage);
    }
    
    // Log analytics if service is available
    if (this.analyticsService) {
      this.analyticsService.logConversationMessage(
        userId, 
        conversationId, 
        message, 
        result.response,
        result.state
      );
    }
    
    return {
      conversationId,
      message: result.response,
      recommendations,
      state: result.state,
      context: result.context
    };
  }

  /**
   * End a conversation
   * @param {string} conversationId - Conversation identifier
   * @param {string} userId - User identifier
   * @returns {Object} Result data
   */
  async endConversation(conversationId, userId) {
    // Load existing context
    let context;
    
    if (this.storage) {
      context = await this.contextManager.loadContext(conversationId, this.storage);
    }
    
    if (!context) {
      return { success: false, message: 'Conversation not found' };
    }
    
    // Update conversation state to completed
    context.conversation.state = 'completion';
    
    // Generate farewell message
    const farewellResponse = "I hope you found these recommendations helpful! Feel free to start a new conversation anytime you want to discover more courses. Happy learning!";
    
    // Add assistant message to history
    context.history = context.historyTracker.addMessage(
      context.history,
      'assistant',
      farewellResponse,
      { conversationState: context.conversation.state }
    );
    
    // Save updated context if storage is available
    if (this.storage) {
      await this.contextManager.saveContext(context, this.storage);
    }
    
    // Log analytics if service is available
    if (this.analyticsService) {
      this.analyticsService.logConversationEnd(userId, conversationId);
    }
    
    return {
      success: true,
      conversationId,
      message: farewellResponse,
      summary: this.contextManager.getConversationSummary(context)
    };
  }

  /**
   * Get conversation summary
   * @param {string} conversationId - Conversation identifier
   * @param {string} userId - User identifier
   * @returns {Object} Conversation summary
   */
  async getConversationSummary(conversationId, userId) {
    // Load existing context
    let context;
    
    if (this.storage) {
      context = await this.contextManager.loadContext(conversationId, this.storage);
    }
    
    if (!context) {
      return { success: false, message: 'Conversation not found' };
    }
    
    return {
      success: true,
      summary: this.contextManager.getConversationSummary(context)
    };
  }

  /**
   * Get user's conversation history
   * @param {string} userId - User identifier
   * @param {number} limit - Maximum number of conversations to return
   * @returns {Array} Conversation history
   */
  async getUserConversationHistory(userId, limit = 10) {
    if (!this.storage) {
      return { success: false, message: 'Storage not available' };
    }
    
    try {
      const conversations = await this.storage.getUserConversations(userId, limit);
      
      // Generate summaries for each conversation
      const conversationSummaries = conversations.map(conversation => 
        this.contextManager.getConversationSummary(conversation)
      );
      
      return {
        success: true,
        conversations: conversationSummaries
      };
    } catch (error) {
      console.error('Error getting user conversation history:', error);
      return { success: false, message: 'Error retrieving conversation history' };
    }
  }

  /**
   * Generate a unique conversation ID
   * @returns {string} Unique conversation ID
   * @private
   */
  _generateConversationId() {
    return 'conv_' + Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }
}

module.exports = {
  ConversationService
};
