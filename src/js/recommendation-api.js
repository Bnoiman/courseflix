// CourseFlixAI Recommendation API
// This module provides the API endpoints for the recommendation service

const express = require('express');
const { RecommendationService } = require('./recommendation-service');

/**
 * Create recommendation API router
 * @param {Object} options - Configuration options
 * @returns {express.Router} Express router
 */
function createRecommendationRouter(options = {}) {
  const router = express.Router();
  const recommendationService = new RecommendationService(options);

  /**
   * @api {get} /recommendations/personalized Get personalized recommendations
   * @apiName GetPersonalizedRecommendations
   * @apiGroup Recommendations
   * @apiDescription Get personalized course recommendations based on user preferences
   */
  router.get('/personalized', async (req, res) => {
    try {
      const userId = req.user?.id;
      const { conversationId, subjects, skills, level, format, limit } = req.query;

      // Parse array parameters
      const parsedSubjects = subjects ? subjects.split(',') : [];
      const parsedSkills = skills ? skills.split(',') : [];

      const recommendations = await recommendationService.getPersonalizedRecommendations({
        userId,
        conversationId,
        subjects: parsedSubjects,
        skills: parsedSkills,
        level,
        format,
        limit: parseInt(limit) || undefined
      });

      res.json(recommendations);
    } catch (error) {
      console.error('Error in personalized recommendations endpoint:', error);
      res.status(500).json({
        error: 'Failed to generate personalized recommendations',
        message: error.message
      });
    }
  });

  /**
   * @api {get} /recommendations/trending Get trending recommendations
   * @apiName GetTrendingRecommendations
   * @apiGroup Recommendations
   * @apiDescription Get trending course recommendations
   */
  router.get('/trending', async (req, res) => {
    try {
      const userId = req.user?.id;
      const { timeframe, category, limit } = req.query;

      const recommendations = await recommendationService.getTrendingRecommendations({
        userId,
        timeframe,
        category,
        limit: parseInt(limit) || undefined
      });

      res.json(recommendations);
    } catch (error) {
      console.error('Error in trending recommendations endpoint:', error);
      res.status(500).json({
        error: 'Failed to generate trending recommendations',
        message: error.message
      });
    }
  });

  /**
   * @api {get} /recommendations/because-you-watched/:courseId Get "Because You Watched" recommendations
   * @apiName GetBecauseYouWatchedRecommendations
   * @apiGroup Recommendations
   * @apiDescription Get course recommendations based on a previously watched course
   */
  router.get('/because-you-watched/:courseId', async (req, res) => {
    try {
      const userId = req.user?.id;
      const { courseId } = req.params;
      const { limit } = req.query;

      const recommendations = await recommendationService.getBecauseYouWatchedRecommendations({
        userId,
        courseId,
        limit: parseInt(limit) || undefined
      });

      res.json(recommendations);
    } catch (error) {
      console.error('Error in "Because You Watched" recommendations endpoint:', error);
      res.status(500).json({
        error: 'Failed to generate "Because You Watched" recommendations',
        message: error.message
      });
    }
  });

  /**
   * @api {get} /recommendations/continue-learning Get "Continue Learning" recommendations
   * @apiName GetContinueLearningRecommendations
   * @apiGroup Recommendations
   * @apiDescription Get recommendations for courses the user has started but not completed
   */
  router.get('/continue-learning', async (req, res) => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          error: 'Authentication required',
          message: 'User must be logged in to get "Continue Learning" recommendations'
        });
      }

      const { limit } = req.query;

      const recommendations = await recommendationService.getContinueLearningRecommendations({
        userId,
        limit: parseInt(limit) || undefined
      });

      res.json(recommendations);
    } catch (error) {
      console.error('Error in "Continue Learning" recommendations endpoint:', error);
      res.status(500).json({
        error: 'Failed to generate "Continue Learning" recommendations',
        message: error.message
      });
    }
  });

  /**
   * @api {get} /recommendations/all Get all recommendation types
   * @apiName GetAllRecommendations
   * @apiGroup Recommendations
   * @apiDescription Get all types of recommendations for a user
   */
  router.get('/all', async (req, res) => {
    try {
      const userId = req.user?.id;
      const { conversationId, subjects, skills, level, format, limit } = req.query;

      // Parse array parameters
      const parsedSubjects = subjects ? subjects.split(',') : [];
      const parsedSkills = skills ? skills.split(',') : [];

      const recommendations = await recommendationService.getAllRecommendations({
        userId,
        conversationId,
        subjects: parsedSubjects,
        skills: parsedSkills,
        level,
        format,
        limit: parseInt(limit) || undefined
      });

      res.json(recommendations);
    } catch (error) {
      console.error('Error in all recommendations endpoint:', error);
      res.status(500).json({
        error: 'Failed to generate recommendations',
        message: error.message
      });
    }
  });

  /**
   * @api {post} /recommendations/from-conversation Get recommendations from conversation
   * @apiName GetRecommendationsFromConversation
   * @apiGroup Recommendations
   * @apiDescription Get recommendations based on conversation context
   */
  router.post('/from-conversation', async (req, res) => {
    try {
      const { conversationContext } = req.body;

      if (!conversationContext) {
        return res.status(400).json({
          error: 'Missing required parameter',
          message: 'Conversation context is required'
        });
      }

      const recommendations = await recommendationService.getRecommendationsFromConversation(
        conversationContext
      );

      res.json(recommendations);
    } catch (error) {
      console.error('Error in recommendations from conversation endpoint:', error);
      res.status(500).json({
        error: 'Failed to generate recommendations from conversation',
        message: error.message
      });
    }
  });

  /**
   * @api {post} /recommendations/track Track recommendation interaction
   * @apiName TrackRecommendationInteraction
   * @apiGroup Recommendations
   * @apiDescription Track user interaction with a recommendation
   */
  router.post('/track', async (req, res) => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          error: 'Authentication required',
          message: 'User must be logged in to track recommendation interactions'
        });
      }

      const { courseId, recommendationType, interactionType, referenceId } = req.body;

      if (!courseId || !recommendationType || !interactionType) {
        return res.status(400).json({
          error: 'Missing required parameters',
          message: 'courseId, recommendationType, and interactionType are required'
        });
      }

      const success = await recommendationService.trackRecommendationInteraction({
        userId,
        courseId,
        recommendationType,
        interactionType,
        referenceId
      });

      res.json({ success });
    } catch (error) {
      console.error('Error in track recommendation interaction endpoint:', error);
      res.status(500).json({
        error: 'Failed to track recommendation interaction',
        message: error.message
      });
    }
  });

  /**
   * @api {post} /recommendations/feedback Provide recommendation feedback
   * @apiName ProvideRecommendationFeedback
   * @apiGroup Recommendations
   * @apiDescription Provide feedback on a recommendation
   */
  router.post('/feedback', async (req, res) => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          error: 'Authentication required',
          message: 'User must be logged in to provide recommendation feedback'
        });
      }

      const { courseId, recommendationType, feedbackType, rating, comments } = req.body;

      if (!courseId || !recommendationType || !feedbackType) {
        return res.status(400).json({
          error: 'Missing required parameters',
          message: 'courseId, recommendationType, and feedbackType are required'
        });
      }

      const success = await recommendationService.provideRecommendationFeedback({
        userId,
        courseId,
        recommendationType,
        feedbackType,
        rating,
        comments
      });

      res.json({ success });
    } catch (error) {
      console.error('Error in recommendation feedback endpoint:', error);
      res.status(500).json({
        error: 'Failed to process recommendation feedback',
        message: error.message
      });
    }
  });

  return router;
}

module.exports = {
  createRecommendationRouter
};
