// CourseFlixAI Recommendation Engine - Core Module
// This module provides the main recommendation engine functionality

/**
 * Recommendation types
 */
const RECOMMENDATION_TYPES = {
  PERSONALIZED: 'personalized',
  TRENDING: 'trending',
  CONTINUE_LEARNING: 'continue_learning',
  BECAUSE_YOU_WATCHED: 'because_you_watched',
  SIMILAR_USERS: 'similar_users'
};

/**
 * Recommendation strategies
 */
const RECOMMENDATION_STRATEGIES = {
  CONTENT_BASED: 'content_based',
  COLLABORATIVE: 'collaborative',
  POPULARITY: 'popularity',
  HYBRID: 'hybrid'
};

/**
 * Class for generating course recommendations
 */
class RecommendationEngine {
  /**
   * Create a new recommendation engine
   * @param {Object} options - Configuration options
   */
  constructor(options = {}) {
    this.courseRepository = options.courseRepository;
    this.userRepository = options.userRepository;
    this.analyticsRepository = options.analyticsRepository;
    this.defaultLimit = options.defaultLimit || 10;
    this.minConfidenceScore = options.minConfidenceScore || 0.5;
    this.diversityFactor = options.diversityFactor || 0.3;
    this.recencyBoost = options.recencyBoost || 1.2;
    this.popularityWeight = options.popularityWeight || 0.3;
    this.ratingWeight = options.ratingWeight || 0.4;
    this.relevanceWeight = options.relevanceWeight || 0.7;
  }

  /**
   * Get personalized recommendations based on user preferences
   * @param {Object} params - Recommendation parameters
   * @returns {Promise<Object>} Recommendation results
   */
  async getPersonalizedRecommendations(params) {
    try {
      const {
        userId,
        subjects = [],
        skills = [],
        level = null,
        format = null,
        goal = null,
        timeCommitment = null,
        excludeSubjects = [],
        excludeProviders = [],
        limit = this.defaultLimit
      } = params;

      // Get user data if userId is provided
      let userData = null;
      if (userId) {
        userData = await this.userRepository.getUserById(userId);
      }

      // Build query for content-based filtering
      const contentQuery = this._buildContentBasedQuery({
        subjects,
        skills,
        level,
        format,
        goal,
        timeCommitment,
        excludeSubjects,
        excludeProviders
      });

      // Get courses matching content criteria
      const contentBasedCourses = await this.courseRepository.findCourses(contentQuery);

      // If we have user data, apply collaborative filtering
      let recommendedCourses = contentBasedCourses;
      if (userData) {
        // Get similar users
        const similarUsers = await this._findSimilarUsers(userId, subjects, skills);
        
        // Get courses popular with similar users
        const collaborativeCourses = await this._getCollaborativeFilteringRecommendations(
          userId, 
          similarUsers
        );
        
        // Merge content-based and collaborative filtering results
        recommendedCourses = this._mergeRecommendations(
          contentBasedCourses, 
          collaborativeCourses
        );
      }

      // Apply diversity to avoid too similar recommendations
      const diverseRecommendations = this._applyDiversity(recommendedCourses);

      // Sort by final score and limit results
      const finalRecommendations = diverseRecommendations
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);

      // Format recommendations with reasons
      const formattedRecommendations = this._formatRecommendations(
        finalRecommendations,
        {
          subjects,
          skills,
          level,
          format
        }
      );

      // Log recommendations if analytics repository is available
      if (this.analyticsRepository && userId) {
        await this.analyticsRepository.logRecommendations(
          userId,
          'personalized',
          formattedRecommendations.map(rec => rec.id)
        );
      }

      return {
        type: RECOMMENDATION_TYPES.PERSONALIZED,
        title: 'Recommended for You',
        recommendations: formattedRecommendations
      };
    } catch (error) {
      console.error('Error generating personalized recommendations:', error);
      return {
        type: RECOMMENDATION_TYPES.PERSONALIZED,
        title: 'Recommended for You',
        recommendations: [],
        error: 'Failed to generate recommendations'
      };
    }
  }

  /**
   * Get trending course recommendations
   * @param {Object} params - Recommendation parameters
   * @returns {Promise<Object>} Recommendation results
   */
  async getTrendingRecommendations(params) {
    try {
      const {
        limit = this.defaultLimit,
        timeframe = 'week',
        category = null
      } = params;

      // Build query for trending courses
      const query = {
        sort: {
          'popularity.views': -1,
          'popularity.enrollments': -1,
          'ratings.average': -1
        },
        limit
      };

      // Add category filter if provided
      if (category) {
        query.filter = {
          topics: category
        };
      }

      // Add timeframe filter
      const now = new Date();
      let startDate;
      switch (timeframe) {
        case 'day':
          startDate = new Date(now.setDate(now.getDate() - 1));
          break;
        case 'week':
          startDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case 'month':
          startDate = new Date(now.setMonth(now.getMonth() - 1));
          break;
        default:
          startDate = new Date(now.setDate(now.getDate() - 7));
      }
      query.filter = {
        ...query.filter,
        updatedAt: { $gte: startDate }
      };

      // Get trending courses
      const trendingCourses = await this.courseRepository.findCourses(query);

      // Format recommendations
      const formattedRecommendations = trendingCourses.map((course, index) => ({
        id: course._id,
        title: course.title,
        description: course.description,
        thumbnail: course.thumbnail,
        provider: course.provider,
        level: course.difficulty,
        ratings: course.ratings,
        popularity: course.popularity,
        reason: 'Popular this ' + timeframe,
        score: 1 - (index * 0.05) // Simple scoring based on position
      }));

      return {
        type: RECOMMENDATION_TYPES.TRENDING,
        title: `Trending This ${timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}`,
        recommendations: formattedRecommendations
      };
    } catch (error) {
      console.error('Error generating trending recommendations:', error);
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
   * @param {Object} params - Recommendation parameters
   * @returns {Promise<Object>} Recommendation results
   */
  async getBecauseYouWatchedRecommendations(params) {
    try {
      const {
        userId,
        courseId,
        limit = this.defaultLimit
      } = params;

      if (!courseId) {
        throw new Error('Course ID is required for "Because You Watched" recommendations');
      }

      // Get the reference course
      const referenceCourse = await this.courseRepository.getCourseById(courseId);
      if (!referenceCourse) {
        throw new Error('Reference course not found');
      }

      // Find similar courses based on topics and content
      const similarCourses = await this.courseRepository.findSimilarCourses(
        courseId,
        referenceCourse.topics,
        limit
      );

      // Format recommendations
      const formattedRecommendations = similarCourses.map((course, index) => ({
        id: course._id,
        title: course.title,
        description: course.description,
        thumbnail: course.thumbnail,
        provider: course.provider,
        level: course.difficulty,
        ratings: course.ratings,
        reason: `Similar to "${referenceCourse.title}"`,
        score: 1 - (index * 0.1), // Simple scoring based on position
        referenceId: courseId
      }));

      // Log recommendations if analytics repository is available
      if (this.analyticsRepository && userId) {
        await this.analyticsRepository.logRecommendations(
          userId,
          'because_you_watched',
          formattedRecommendations.map(rec => rec.id),
          { referenceId: courseId }
        );
      }

      return {
        type: RECOMMENDATION_TYPES.BECAUSE_YOU_WATCHED,
        title: `Because You Watched: ${referenceCourse.title}`,
        recommendations: formattedRecommendations,
        referenceId: courseId
      };
    } catch (error) {
      console.error('Error generating "Because You Watched" recommendations:', error);
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
   * @param {Object} params - Recommendation parameters
   * @returns {Promise<Object>} Recommendation results
   */
  async getContinueLearningRecommendations(params) {
    try {
      const {
        userId,
        limit = this.defaultLimit
      } = params;

      if (!userId) {
        throw new Error('User ID is required for "Continue Learning" recommendations');
      }

      // Get user's enrolled courses
      const userData = await this.userRepository.getUserById(userId);
      if (!userData || !userData.courseInteractions || !userData.courseInteractions.enrolled) {
        return {
          type: RECOMMENDATION_TYPES.CONTINUE_LEARNING,
          title: 'Continue Learning',
          recommendations: []
        };
      }

      // Filter incomplete courses and sort by last accessed
      const enrolledCourses = userData.courseInteractions.enrolled
        .filter(course => !course.completed)
        .sort((a, b) => new Date(b.lastAccessed) - new Date(a.lastAccessed));

      // Get course details for enrolled courses
      const courseIds = enrolledCourses.slice(0, limit).map(course => course.courseId);
      const courseDetails = await this.courseRepository.getCoursesByIds(courseIds);

      // Match course details with progress information
      const formattedRecommendations = courseDetails.map(course => {
        const enrollmentInfo = enrolledCourses.find(
          enrolled => enrolled.courseId.toString() === course._id.toString()
        );

        return {
          id: course._id,
          title: course.title,
          description: course.description,
          thumbnail: course.thumbnail,
          provider: course.provider,
          level: course.difficulty,
          ratings: course.ratings,
          progress: enrollmentInfo ? enrollmentInfo.progress : 0,
          lastAccessed: enrollmentInfo ? enrollmentInfo.lastAccessed : null,
          reason: 'Continue where you left off',
          score: 1 // High priority for continue learning
        };
      });

      return {
        type: RECOMMENDATION_TYPES.CONTINUE_LEARNING,
        title: 'Continue Learning',
        recommendations: formattedRecommendations
      };
    } catch (error) {
      console.error('Error generating "Continue Learning" recommendations:', error);
      return {
        type: RECOMMENDATION_TYPES.CONTINUE_LEARNING,
        title: 'Continue Learning',
        recommendations: [],
        error: 'Failed to generate recommendations'
      };
    }
  }

  /**
   * Get recommendations from similar users
   * @param {Object} params - Recommendation parameters
   * @returns {Promise<Object>} Recommendation results
   */
  async getSimilarUserRecommendations(params) {
    try {
      const {
        userId,
        limit = this.defaultLimit
      } = params;

      if (!userId) {
        throw new Error('User ID is required for similar user recommendations');
      }

      // Get user data
      const userData = await this.userRepository.getUserById(userId);
      if (!userData) {
        throw new Error('User not found');
      }

      // Extract user interests
      const userInterests = [];
      if (userData.learningPreferences && userData.learningPreferences.interests) {
        userInterests.push(...userData.learningPreferences.interests);
      }

      // Find similar users
      const similarUsers = await this._findSimilarUsers(userId, userInterests, []);
      if (similarUsers.length === 0) {
        return {
          type: RECOMMENDATION_TYPES.SIMILAR_USERS,
          title: 'Popular with Similar Learners',
          recommendations: []
        };
      }

      // Get courses popular with similar users
      const similarUserCourses = await this._getCollaborativeFilteringRecommendations(
        userId,
        similarUsers,
        limit
      );

      // Format recommendations
      const formattedRecommendations = similarUserCourses.map((course, index) => ({
        id: course._id,
        title: course.title,
        description: course.description,
        thumbnail: course.thumbnail,
        provider: course.provider,
        level: course.difficulty,
        ratings: course.ratings,
        reason: 'Popular with learners similar to you',
        score: 1 - (index * 0.05) // Simple scoring based on position
      }));

      return {
        type: RECOMMENDATION_TYPES.SIMILAR_USERS,
        title: 'Popular with Similar Learners',
        recommendations: formattedRecommendations
      };
    } catch (error) {
      console.error('Error generating similar user recommendations:', error);
      return {
        type: RECOMMENDATION_TYPES.SIMILAR_USERS,
        title: 'Popular with Similar Learners',
        recommendations: [],
        error: 'Failed to generate recommendations'
      };
    }
  }

  /**
   * Get all recommendation types for a user
   * @param {Object} params - Recommendation parameters
   * @returns {Promise<Object>} All recommendation results
   */
  async getAllRecommendations(params) {
    try {
      const {
        userId,
        subjects = [],
        skills = [],
        level = null,
        format = null,
        limit = this.defaultLimit
      } = params;

      // Get personalized recommendations
      const personalizedRecommendations = await this.getPersonalizedRecommendations({
        userId,
        subjects,
        skills,
        level,
        format,
        limit
      });

      // Get trending recommendations
      const trendingRecommendations = await this.getTrendingRecommendations({
        limit
      });

      // Get continue learning recommendations if userId is provided
      let continueRecommendations = {
        type: RECOMMENDATION_TYPES.CONTINUE_LEARNING,
        title: 'Continue Learning',
        recommendations: []
      };

      if (userId) {
        continueRecommendations = await this.getContinueLearningRecommendations({
          userId,
          limit
        });
      }

      // Get similar user recommendations if userId is provided
      let similarUserRecommendations = {
        type: RECOMMENDATION_TYPES.SIMILAR_USERS,
        title: 'Popular with Similar Learners',
        recommendations: []
      };

      if (userId) {
        similarUserRecommendations = await this.getSimilarUserRecommendations({
          userId,
          limit
        });
      }

      // Combine all recommendations
      return {
        userId,
        recommendations: [
          continueRecommendations,
          personalizedRecommendations,
          trendingRecommendations,
          similarUserRecommendations
        ].filter(rec => rec.recommendations.length > 0)
      };
    } catch (error) {
      console.error('Error generating all recommendations:', error);
      return {
        userId,
        recommendations: 
(Content truncated due to size limit. Use line ranges to read in chunks)