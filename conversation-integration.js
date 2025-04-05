// CourseFlixAI Recommendation Integration Module
// This module integrates the recommendation engine with the conversation system

const { RecommendationService } = require('./recommendation-service');
const { CONVERSATION_STATES } = require('../nlp/conversation-manager');

/**
 * Class for integrating recommendations with conversations
 */
class ConversationRecommendationIntegrator {
  /**
   * Create a new conversation recommendation integrator
   * @param {Object} options - Configuration options
   */
  constructor(options = {}) {
    this.recommendationService = new RecommendationService(options);
    this.confidenceThreshold = options.confidenceThreshold || 0.7;
    this.maxRecommendations = options.maxRecommendations || 5;
  }

  /**
   * Generate recommendations based on conversation context
   * @param {Object} conversationContext - Conversation context from the conversation system
   * @returns {Promise<Object>} Recommendation results
   */
  async getRecommendationsFromConversation(conversationContext) {
    try {
      // Only generate recommendations if we're in the right conversation state
      if (conversationContext.conversation.state !== CONVERSATION_STATES.RECOMMENDATION &&
          conversationContext.conversation.state !== CONVERSATION_STATES.REFINEMENT) {
        return {
          recommendations: [],
          message: 'Not in recommendation state'
        };
      }

      // Extract user ID and conversation ID
      const userId = conversationContext.userId;
      const conversationId = conversationContext.conversationId;

      // Extract entities from conversation
      const subjects = this._extractEntitiesOfType(conversationContext, 'subject');
      const skills = this._extractEntitiesOfType(conversationContext, 'skill');
      const level = this._extractFirstEntityOfType(conversationContext, 'level');
      const format = this._extractFirstEntityOfType(conversationContext, 'format');
      const goal = this._extractFirstEntityOfType(conversationContext, 'goal');
      const timeCommitment = this._extractFirstEntityOfType(conversationContext, 'time');

      // Get personalized recommendations
      const recommendations = await this.recommendationService.getPersonalizedRecommendations({
        userId,
        conversationId,
        subjects,
        skills,
        level,
        format,
        goal,
        timeCommitment,
        limit: this.maxRecommendations
      });

      // Format response for conversation
      return this._formatRecommendationsForConversation(recommendations);
    } catch (error) {
      console.error('Error generating recommendations from conversation:', error);
      return {
        recommendations: [],
        message: 'Error generating recommendations',
        error: error.message
      };
    }
  }

  /**
   * Extract entities of a specific type from conversation context
   * @param {Object} conversationContext - Conversation context
   * @param {string} entityType - Entity type to extract
   * @returns {Array} Extracted entities
   * @private
   */
  _extractEntitiesOfType(conversationContext, entityType) {
    if (!conversationContext.preferences) {
      return [];
    }

    // Different entity types are stored in different preference maps
    switch (entityType) {
      case 'subject':
        return Object.keys(conversationContext.preferences.subjects || {});
      case 'skill':
        return Object.keys(conversationContext.preferences.skills || {});
      case 'level':
        return Object.keys(conversationContext.preferences.levels || {});
      case 'format':
        return Object.keys(conversationContext.preferences.formats || {});
      case 'goal':
        return Object.keys(conversationContext.preferences.goals || {});
      case 'time':
        return Object.keys(conversationContext.preferences.timeCommitments || {});
      default:
        return [];
    }
  }

  /**
   * Extract the first entity of a specific type from conversation context
   * @param {Object} conversationContext - Conversation context
   * @param {string} entityType - Entity type to extract
   * @returns {string|null} First entity of the specified type
   * @private
   */
  _extractFirstEntityOfType(conversationContext, entityType) {
    const entities = this._extractEntitiesOfType(conversationContext, entityType);
    return entities.length > 0 ? entities[0] : null;
  }

  /**
   * Format recommendations for conversation response
   * @param {Object} recommendationResult - Recommendation result from service
   * @returns {Object} Formatted recommendations for conversation
   * @private
   */
  _formatRecommendationsForConversation(recommendationResult) {
    if (!recommendationResult || !recommendationResult.recommendations || 
        recommendationResult.recommendations.length === 0) {
      return {
        recommendations: [],
        message: "I couldn't find any courses matching your preferences. Could you tell me more about what you're looking for?"
      };
    }

    // Format recommendations for conversation
    const formattedRecommendations = recommendationResult.recommendations.map(rec => ({
      id: rec.id,
      title: rec.title,
      description: rec.description,
      provider: rec.provider,
      level: rec.level,
      reason: rec.reason
    }));

    // Generate response message
    let message = `Based on our conversation, I've found ${formattedRecommendations.length} courses that might interest you:\n\n`;
    
    formattedRecommendations.forEach((rec, index) => {
      message += `${index + 1}. **${rec.title}** (${rec.provider}) - ${rec.level} level\n`;
      message += `   ${rec.reason}\n\n`;
    });
    
    message += "Would you like more information about any of these courses, or would you prefer different recommendations?";

    return {
      recommendations: formattedRecommendations,
      message
    };
  }

  /**
   * Process user feedback on recommendations
   * @param {Object} conversationContext - Conversation context
   * @param {string} message - User message
   * @param {Array} lastRecommendations - Last recommendations provided
   * @returns {Promise<Object>} Feedback processing result
   */
  async processRecommendationFeedback(conversationContext, message, lastRecommendations) {
    try {
      if (!lastRecommendations || lastRecommendations.length === 0) {
        return {
          processed: false,
          message: "I don't have any recent recommendations to get feedback on."
        };
      }

      const userId = conversationContext.userId;
      const lowerMessage = message.toLowerCase();

      // Check for positive feedback
      const positivePatterns = [
        'like', 'good', 'great', 'excellent', 'perfect', 'yes', 'interested',
        'sounds good', 'looks good', 'thank you', 'thanks'
      ];
      
      const hasPositiveFeedback = positivePatterns.some(pattern => 
        lowerMessage.includes(pattern)
      );

      // Check for negative feedback
      const negativePatterns = [
        'don\'t like', 'not interested', 'no', 'different', 'something else',
        'not what i\'m looking for', 'not helpful', 'not good'
      ];
      
      const hasNegativeFeedback = negativePatterns.some(pattern => 
        lowerMessage.includes(pattern)
      );

      // Check for specific course mention by number
      const courseNumberMatch = lowerMessage.match(/\b(first|second|third|fourth|fifth|\d+(?:st|nd|rd|th)?)\b/);
      let specificCourseIndex = -1;
      
      if (courseNumberMatch) {
        const courseNumber = courseNumberMatch[1];
        
        // Convert word to number
        if (courseNumber === 'first') specificCourseIndex = 0;
        else if (courseNumber === 'second') specificCourseIndex = 1;
        else if (courseNumber === 'third') specificCourseIndex = 2;
        else if (courseNumber === 'fourth') specificCourseIndex = 3;
        else if (courseNumber === 'fifth') specificCourseIndex = 4;
        else {
          // Extract numeric part
          const numericMatch = courseNumber.match(/\d+/);
          if (numericMatch) {
            specificCourseIndex = parseInt(numericMatch[0]) - 1; // Convert to zero-based index
          }
        }
      }

      // Process feedback
      if (specificCourseIndex >= 0 && specificCourseIndex < lastRecommendations.length) {
        // User is interested in a specific course
        const selectedCourse = lastRecommendations[specificCourseIndex];
        
        // Track interaction
        if (userId) {
          await this.recommendationService.trackRecommendationInteraction({
            userId,
            courseId: selectedCourse.id,
            recommendationType: 'conversation',
            interactionType: 'selected',
            referenceId: conversationContext.conversationId
          });
        }
        
        return {
          processed: true,
          feedbackType: 'specific_course',
          courseIndex: specificCourseIndex,
          course: selectedCourse,
          message: `Great choice! "${selectedCourse.title}" is an excellent course. Would you like to enroll in this course or see more details about it?`
        };
      } else if (hasPositiveFeedback) {
        // User likes the recommendations in general
        if (userId) {
          await this.recommendationService.provideRecommendationFeedback({
            userId,
            recommendationType: 'conversation',
            feedbackType: 'positive',
            comments: message
          });
        }
        
        return {
          processed: true,
          feedbackType: 'positive',
          message: "I'm glad you like these recommendations! Would you like to explore any of these courses in more detail?"
        };
      } else if (hasNegativeFeedback) {
        // User doesn't like the recommendations
        if (userId) {
          await this.recommendationService.provideRecommendationFeedback({
            userId,
            recommendationType: 'conversation',
            feedbackType: 'negative',
            comments: message
          });
        }
        
        return {
          processed: true,
          feedbackType: 'negative',
          message: "I'm sorry these recommendations weren't helpful. Could you tell me more about what you're looking for so I can find better courses for you?"
        };
      }

      // Couldn't determine feedback type
      return {
        processed: false,
        message: null
      };
    } catch (error) {
      console.error('Error processing recommendation feedback:', error);
      return {
        processed: false,
        error: error.message
      };
    }
  }
}

module.exports = {
  ConversationRecommendationIntegrator
};
