// CourseFlixAI Conversation History Tracker
// This module manages the storage and retrieval of conversation history

/**
 * Conversation history entry structure
 * @typedef {Object} ConversationHistoryEntry
 * @property {string} role - 'user' or 'assistant'
 * @property {string} content - Message content
 * @property {string} timestamp - ISO timestamp
 * @property {Object} [metadata] - Optional metadata about the message
 */

/**
 * Class for managing conversation history
 */
class ConversationHistoryTracker {
  /**
   * Create a new conversation history tracker
   * @param {Object} options - Configuration options
   */
  constructor(options = {}) {
    this.maxHistoryLength = options.maxHistoryLength || 50;
    this.persistenceProvider = options.persistenceProvider || null;
  }

  /**
   * Initialize a new conversation history
   * @param {string} userId - User identifier
   * @param {string} conversationId - Conversation identifier
   * @returns {Object} New conversation history object
   */
  initializeHistory(userId, conversationId) {
    return {
      userId,
      conversationId,
      messages: [],
      startedAt: new Date().toISOString(),
      lastUpdatedAt: new Date().toISOString(),
      metadata: {
        totalTurns: 0,
        userMessageCount: 0,
        assistantMessageCount: 0,
        averageUserMessageLength: 0,
        topicsDiscussed: []
      }
    };
  }

  /**
   * Add a message to the conversation history
   * @param {Object} history - Conversation history object
   * @param {string} role - 'user' or 'assistant'
   * @param {string} content - Message content
   * @param {Object} [metadata] - Optional metadata about the message
   * @returns {Object} Updated conversation history
   */
  addMessage(history, role, content, metadata = {}) {
    // Create a new history object to avoid mutation
    const newHistory = JSON.parse(JSON.stringify(history));
    
    // Create the message entry
    const entry = {
      role,
      content,
      timestamp: new Date().toISOString(),
      metadata
    };
    
    // Add to messages array
    newHistory.messages.push(entry);
    
    // Trim history if it exceeds maximum length
    if (newHistory.messages.length > this.maxHistoryLength) {
      newHistory.messages = newHistory.messages.slice(-this.maxHistoryLength);
    }
    
    // Update metadata
    newHistory.lastUpdatedAt = entry.timestamp;
    newHistory.metadata.totalTurns += 1;
    
    if (role === 'user') {
      newHistory.metadata.userMessageCount += 1;
      
      // Update average message length
      const totalUserChars = newHistory.messages
        .filter(msg => msg.role === 'user')
        .reduce((sum, msg) => sum + msg.content.length, 0);
      
      newHistory.metadata.averageUserMessageLength = 
        totalUserChars / newHistory.metadata.userMessageCount;
    } else if (role === 'assistant') {
      newHistory.metadata.assistantMessageCount += 1;
    }
    
    // If metadata includes topics, update topics discussed
    if (metadata.topics && Array.isArray(metadata.topics)) {
      metadata.topics.forEach(topic => {
        if (!newHistory.metadata.topicsDiscussed.includes(topic)) {
          newHistory.metadata.topicsDiscussed.push(topic);
        }
      });
    }
    
    // Persist history if provider is available
    if (this.persistenceProvider) {
      this.persistenceProvider.saveHistory(newHistory);
    }
    
    return newHistory;
  }

  /**
   * Get the last N messages from the conversation history
   * @param {Object} history - Conversation history object
   * @param {number} count - Number of messages to retrieve
   * @returns {Array} Last N messages
   */
  getLastMessages(history, count = 10) {
    return history.messages.slice(-count);
  }

  /**
   * Get messages between two timestamps
   * @param {Object} history - Conversation history object
   * @param {string} startTime - ISO timestamp for start time
   * @param {string} endTime - ISO timestamp for end time
   * @returns {Array} Messages within the time range
   */
  getMessagesByTimeRange(history, startTime, endTime) {
    return history.messages.filter(msg => {
      const timestamp = new Date(msg.timestamp).getTime();
      return timestamp >= new Date(startTime).getTime() && 
             timestamp <= new Date(endTime).getTime();
    });
  }

  /**
   * Search for messages containing specific text
   * @param {Object} history - Conversation history object
   * @param {string} searchText - Text to search for
   * @returns {Array} Matching messages
   */
  searchMessages(history, searchText) {
    const lowerSearchText = searchText.toLowerCase();
    return history.messages.filter(msg => 
      msg.content.toLowerCase().includes(lowerSearchText)
    );
  }

  /**
   * Format conversation history for use with AI models
   * @param {Object} history - Conversation history object
   * @param {number} maxTokens - Maximum tokens to include
   * @returns {Array} Formatted conversation history
   */
  formatForAIModel(history, maxTokens = 2000) {
    // Simple token estimation (very rough approximation)
    const estimateTokens = (text) => Math.ceil(text.length / 4);
    
    const formattedMessages = [];
    let totalTokens = 0;
    
    // Start from the most recent messages and work backwards
    for (let i = history.messages.length - 1; i >= 0; i--) {
      const msg = history.messages[i];
      const messageTokens = estimateTokens(msg.content);
      
      // Check if adding this message would exceed the token limit
      if (totalTokens + messageTokens > maxTokens) {
        break;
      }
      
      // Add message to the formatted list (at the beginning to maintain order)
      formattedMessages.unshift({
        role: msg.role,
        content: msg.content
      });
      
      totalTokens += messageTokens;
    }
    
    return formattedMessages;
  }

  /**
   * Generate a summary of the conversation
   * @param {Object} history - Conversation history object
   * @returns {Object} Conversation summary
   */
  generateSummary(history) {
    // Extract key topics from the conversation
    const topTopics = history.metadata.topicsDiscussed.slice(0, 5);
    
    // Calculate conversation duration
    const startTime = new Date(history.startedAt).getTime();
    const endTime = new Date(history.lastUpdatedAt).getTime();
    const durationMinutes = Math.round((endTime - startTime) / (1000 * 60));
    
    // Find the longest user message
    const longestUserMessage = history.messages
      .filter(msg => msg.role === 'user')
      .reduce((longest, msg) => 
        msg.content.length > longest.length ? msg.content : longest
      , '');
    
    return {
      conversationId: history.conversationId,
      duration: durationMinutes,
      totalTurns: history.metadata.totalTurns,
      userMessageCount: history.metadata.userMessageCount,
      assistantMessageCount: history.metadata.assistantMessageCount,
      averageUserMessageLength: Math.round(history.metadata.averageUserMessageLength),
      topicsDiscussed: topTopics,
      longestUserMessageLength: longestUserMessage.length,
      startedAt: history.startedAt,
      lastUpdatedAt: history.lastUpdatedAt
    };
  }
}

module.exports = {
  ConversationHistoryTracker
};
