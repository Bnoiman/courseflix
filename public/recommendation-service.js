// CourseFlixAI Recommendation Service
// This module provides the service interface for the recommendation engine

const { RecommendationEngine, RECOMMENDATION_TYPES } = require('./recommendation-engine');

/**
 * Class for providing recommendation services
 */
class RecommendationService {
  /**
   * Create a new recommendation service
   * @param {Object} options - Configuration options
   */
  constructor(options = {}) {
    this.recommendationEngine = new RecommendationEngine(options);
    this.userRepository = options.userRepository;
    this.courseRepository = options.courseRepository;
    this.analyticsService = options.analyticsService;
    this.cacheService = options.cacheService;
    this.cacheTTL = options.cacheTTL || 3600; // 1 hour default cache TTL
  }

  /**
   * Get personalized recommendations for a user
   * @param {Object} params - Request parameters
   * @returns {Promise<Object>} Recommendation results
   */
  async getPersonalizedRecommendations(params) {
    try {
      const { userId, conversationId, subjects, skills, level, format } = params;
      
      // Check cache if available
      if (this.cacheService && userId) {
        const cacheKey = `personalized_${userId}_${subjects?.join('_')}_${skills?.join('_')}_${level}_${format}`;
        const cachedRecommendations = await this.cacheService.get(cacheKey);
        
        if (cachedRecommendations) {
          // Log cache hit if analytics service is available
          if (this.analyticsService) {
            this.analyticsService.logEvent('recommendation_cache_hit', {
              userId,
              conversationId,
              recommendationType: RECOMMENDATION_TYPES.PERSONALIZED
            });
          }
          
          return cachedRecommendations;
        }
      }
      
      // Get recommendations from engine
      const recommendations = await this.recommendationEngine.getPersonalizedRecommendations(params);
      
      // Store in cache if available
      if (this.cacheService && userId) {
        const cacheKey = `personalized_${userId}_${subjects?.join('_')}_${skills?.join('_')}_${level}_${format}`;
        await this.cacheService.set(cacheKey, recommendations, this.cacheTTL);
      }
      
      // Log recommendation request if analytics service is available
      if (this.analyticsService) {
        this.analyticsService.logEvent('recommendation_request', {
          userId,
          conversationId,
          recommendationType: RECOMMENDATION_TYPES.PERSONALIZED,
          count: recommendations.recommendations.length
        });
      }
      
      return recommendations;
    } catch (error) {
      console.error('Error in recommendation service:', error);
      
      // Log error if analytics service is available
      if (this.analyticsService) {
        this.analyticsService.logError('recommendation_error', {
          userId: params.userId,
          conversationId: params.conversationId,
          recommendationType: RECOMMENDATION_TYPES.PERSONALIZED,
          error: error.message
        });
      }
      
      return {
        type: RECOMMENDATION_TYPES.PERSONALIZED,
        title: 'Recommended for You',
        recommendations: [],
        error: 'Failed to generate recommendations'
      };
    }
  }

  /**
   * Get trending recommendations
   * @param {Object} params - Request parameters
   * @returns {Promise<Object>} Recommendation results
   */
  async getTrendingRecommendations(params) {
    try {
      const { userId, timeframe, category } = params;
      
      // Check cache if available
      if (this.cacheService) {
        const cacheKey = `trending_${timeframe || 'week'}_${category || 'all'}`;
        const cachedRecommendations = await this.cacheService.get(cacheKey);
        
        if (cachedRecommendations) {
          return cachedRecommendations;
        }
      }
      
      // Get recommendations from engine
      const recommendations = await this.recommendationEngine.getTrendingRecommendations(params);
      
      // Store in cache if available
      if (this.cacheService) {
        const cacheKey = `trending_${timeframe || 'week'}_${category || 'all'}`;
        await this.cacheService.set(cacheKey, recommendations, this.cacheTTL);
      }
      
      // Log recommendation request if analytics service is available
      if (this.analyticsService && userId) {
        this.analyticsService.logEvent('recommendation_request', {
          userId,
          recommendationType: RECOMMENDATION_TYPES.TRENDING,
          timeframe: timeframe || 'week',
          category: category || 'all',
          count: recommendations.recommendations.length
        });
      }
      
      return recommendations;
    } catch (error) {
      console.error('Error in recommendation service:', error);
      
      return {
        type: RECOMMENDATION_TYPES.TRENDING,
        title: 'Trending Now',
        recommendations: [],
        error: 'Failed to generate trending recommendations'
      };
    }
  }

  /**
   * Get "Because You Watched" recommendations
   * @param {Object} params - Request parameters
   * @returns {Promise<Object>} Recommendation results
   */
  async getBecauseYouWatchedRecommendations(params) {
    try {
      const { userId, courseId } = params;
      
      if (!courseId) {
        throw new Error('Course ID is required for "Because You Watched" recommendations');
      }
      
      // Check cache if available
      if (this.cacheService) {
        const cacheKey = `because_you_watched_${courseId}`;
        const cachedRecommendations = await this.cacheService.get(cacheKey);
        
        if (cachedRecommendations) {
          return cachedRecommendations;
        }
      }
      
      // Get recommendations from engine
      const recommendations = await this.recommendationEngine.getBecauseYouWatchedRecommendations(params);
      
      // Store in cache if available
      if (this.cacheService) {
        const cacheKey = `because_you_watched_${courseId}`;
        await this.cacheService.set(cacheKey, recommendations, this.cacheTTL);
      }
      
      // Log recommendation request if analytics service is available
      if (this.analyticsService && userId) {
        this.analyticsService.logEvent('recommendation_request', {
          userId,
          recommendationType: RECOMMENDATION_TYPES.BECAUSE_YOU_WATCHED,
          referenceId: courseId,
          count: recommendations.recommendations.length
        });
      }
      
      return recommendations;
    } catch (error) {
      console.error('Error in recommendation service:', error);
      
      return {
        type: RECOMMENDATION_TYPES.BECAUSE_YOU_WATCHED,
        title: 'Because You Watched',
        recommendations: [],
        error: 'Failed to generate recommendations'
      };
    }
  }

  /**
   * Get "Continue Learning" recommendations
   * @param {Object} params - Request parameters
   * @returns {Promise<Object>} Recommendation results
   */
  async getContinueLearningRecommendations(params) {
    try {
      const { userId } = params;
      
      if (!userId) {
        throw new Error('User ID is required for "Continue Learning" recommendations');
      }
      
      // Continue Learning recommendations should not be cached as they change frequently
      
      // Get recommendations from engine
      const recommendations = await this.recommendationEngine.getContinueLearningRecommendations(params);
      
      // Log recommendation request if analytics service is available
      if (this.analyticsService) {
        this.analyticsService.logEvent('recommendation_request', {
          userId,
          recommendationType: RECOMMENDATION_TYPES.CONTINUE_LEARNING,
          count: recommendations.recommendations.length
        });
      }
      
      return recommendations;
    } catch (error) {
      console.error('Error in recommendation service:', error);
      
      return {
        type: RECOMMENDATION_TYPES.CONTINUE_LEARNING,
        title: 'Continue Learning',
        recommendations: [],
        error: 'Failed to generate recommendations'
      };
    }
  }

  /**
   * Get all recommendation types for a user
   * @param {Object} params - Request parameters
   * @returns {Promise<Object>} All recommendation results
   */
  async getAllRecommendations(params) {
    try {
      const { userId, conversationId } = params;
      
      // Check cache if available and user is not logged in
      if (this.cacheService && !userId) {
        const cacheKey = 'all_recommendations_anonymous';
        const cachedRecommendations = await this.cacheService.get(cacheKey);
        
        if (cachedRecommendations) {
          return cachedRecommendations;
        }
      }
      
      // Get recommendations from engine
      const recommendations = await this.recommendationEngine.getAllRecommendations(params);
      
      // Store in cache if available and user is not logged in
      if (this.cacheService && !userId) {
        const cacheKey = 'all_recommendations_anonymous';
        await this.cacheService.set(cacheKey, recommendations, this.cacheTTL);
      }
      
      // Log recommendation request if analytics service is available
      if (this.analyticsService && userId) {
        this.analyticsService.logEvent('recommendation_request', {
          userId,
          conversationId,
          recommendationType: 'all',
          count: recommendations.recommendations.reduce(
            (total, section) => total + section.recommendations.length, 0
          )
        });
      }
      
      return recommendations;
    } catch (error) {
      console.error('Error in recommendation service:', error);
      
      return {
        userId: params.userId,
        recommendations: [],
        error: 'Failed to generate recommendations'
      };
    }
  }

  /**
   * Get recommendations based on conversation context
   * @param {Object} conversationContext - Conversation context
   * @returns {Promise<Object>} Recommendation results
   */
  async getRecommendationsFromConversation(conversationContext) {
    try {
      if (!conversationContext) {
        throw new Error('Conversation context is required');
      }
      
      const { userId, conversationId } = conversationContext;
      
      // Extract subjects and skills from conversation entities
      const subjects = conversationContext.entities?.subject || [];
      const skills = conversationContext.entities?.skill || [];
      const level = conversationContext.entities?.level?.[0] || null;
      const format = conversationContext.entities?.format?.[0] || null;
      
      // Get personalized recommendations based on conversation
      return await this.getPersonalizedRecommendations({
        userId,
        conversationId,
        subjects,
        skills,
        level,
        format
      });
    } catch (error) {
      console.error('Error getting recommendations from conversation:', error);
      
      return {
        type: RECOMMENDATION_TYPES.PERSONALIZED,
        title: 'Recommended for You',
        recommendations: [],
        error: 'Failed to generate recommendations from conversation'
      };
    }
  }

  /**
   * Track user interaction with a recommendation
   * @param {Object} params - Interaction parameters
   * @returns {Promise<boolean>} Success status
   */
  async trackRecommendationInteraction(params) {
    try {
      const { 
        userId, 
        courseId, 
        recommendationType, 
        interactionType, 
        referenceId 
      } = params;
      
      if (!userId || !courseId || !recommendationType || !interactionType) {
        throw new Error('Missing required parameters for tracking recommendation interaction');
      }
      
      // Log interaction if analytics service is available
      if (this.analyticsService) {
        await this.analyticsService.logEvent('recommendation_interaction', {
          userId,
          courseId,
          recommendationType,
          interactionType,
          referenceId,
          timestamp: new Date().toISOString()
        });
      }
      
      // Update user interaction data if user repository is available
      if (this.userRepository) {
        await this.userRepository.addCourseInteraction(userId, courseId, interactionType);
      }
      
      return true;
    } catch (error) {
      console.error('Error tracking recommendation interaction:', error);
      return false;
    }
  }

  /**
   * Provide feedback on a recommendation
   * @param {Object} params - Feedback parameters
   * @returns {Promise<boolean>} Success status
   */
  async provideRecommendationFeedback(params) {
    try {
      const { 
        userId, 
        courseId, 
        recommendationType, 
        feedbackType, 
        rating, 
        comments 
      } = params;
      
      if (!userId || !courseId || !recommendationType || !feedbackType) {
        throw new Error('Missing required parameters for recommendation feedback');
      }
      
      // Log feedback if analytics service is available
      if (this.analyticsService) {
        await this.analyticsService.logEvent('recommendation_feedback', {
          userId,
          courseId,
          recommendationType,
          feedbackType,
          rating,
          comments,
          timestamp: new Date().toISOString()
        });
      }
      
      return true;
    } catch (error) {
      console.error('Error processing recommendation feedback:', error);
      return false;
    }
  }
}

module.exports = {
  RecommendationService
};
