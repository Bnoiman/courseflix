const express = require('express');
const router = express.Router();
const Recommendation = require('../../../database/models/Recommendation');
const User = require('../../../database/models/User');
const Course = require('../../../database/models/Course');
const Analytics = require('../../../database/models/Analytics');

// @desc    Get personalized recommendations for user
// @route   GET /api/recommendations
// @access  Private
exports.getRecommendations = async (req, res, next) => {
  try {
    // Get active recommendations for user
    const recommendations = await Recommendation.find({
      userId: req.user.id,
      isActive: true
    })
    .sort('-createdAt')
    .populate({
      path: 'courses.courseId',
      select: 'title description thumbnail provider difficulty ratings'
    });
    
    // Group recommendations by type
    const groupedRecommendations = {};
    
    recommendations.forEach(rec => {
      if (!groupedRecommendations[rec.type]) {
        groupedRecommendations[rec.type] = [];
      }
      
      groupedRecommendations[rec.type].push({
        id: rec._id,
        title: rec.title,
        courses: rec.courses.map(course => ({
          id: course.courseId._id,
          title: course.courseId.title,
          description: course.courseId.description,
          thumbnail: course.courseId.thumbnail,
          provider: course.courseId.provider,
          difficulty: course.courseId.difficulty,
          ratings: course.courseId.ratings,
          reason: course.reason,
          score: course.score
        })),
        createdAt: rec.createdAt
      });
    });
    
    res.status(200).json({
      success: true,
      data: groupedRecommendations
    });
    
    // Log analytics
    await Analytics.create({
      userId: req.user.id,
      eventType: 'recommendation_impression',
      metadata: {
        recommendationCount: recommendations.length
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get "Because You Watched" recommendations
// @route   GET /api/recommendations/because-you-watched/:courseId
// @access  Private
exports.getBecauseYouWatched = async (req, res, next) => {
  try {
    const courseId = req.params.courseId;
    
    // Find or create recommendation
    let recommendation = await Recommendation.findOne({
      userId: req.user.id,
      type: 'because_you_watched',
      'context.recentlyViewed': courseId,
      isActive: true
    });
    
    if (!recommendation) {
      // Get the course
      const course = await Course.findById(courseId);
      
      if (!course) {
        return res.status(404).json({ success: false, message: 'Course not found' });
      }
      
      // Find similar courses based on topics and embeddings
      const similarCourses = await Course.find({
        _id: { $ne: courseId },
        topics: { $in: course.topics }
      })
      .limit(10);
      
      // Create new recommendation
      recommendation = await Recommendation.create({
        userId: req.user.id,
        type: 'because_you_watched',
        title: `Because you watched ${course.title}`,
        courses: similarCourses.map((course, index) => ({
          courseId: course._id,
          score: 1 - (index * 0.1), // Simple scoring based on position
          reason: `Similar to ${course.title}`,
          category: 'content_based',
          referenceId: courseId,
          position: index
        })),
        context: {
          recentlyViewed: [courseId]
        }
      });
    }
    
    // Populate course details
    await recommendation.populate({
      path: 'courses.courseId',
      select: 'title description thumbnail provider difficulty ratings'
    });
    
    res.status(200).json({
      success: true,
      data: {
        id: recommendation._id,
        title: recommendation.title,
        courses: recommendation.courses.map(course => ({
          id: course.courseId._id,
          title: course.courseId.title,
          description: course.courseId.description,
          thumbnail: course.courseId.thumbnail,
          provider: course.courseId.provider,
          difficulty: course.courseId.difficulty,
          ratings: course.courseId.ratings,
          reason: course.reason,
          score: course.score
        }))
      }
    });
    
    // Log analytics
    await Analytics.create({
      userId: req.user.id,
      eventType: 'recommendation_impression',
      metadata: {
        recommendationType: 'because_you_watched',
        referenceId: courseId
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get trending courses
// @route   GET /api/recommendations/trending
// @access  Public
exports.getTrending = async (req, res, next) => {
  try {
    // Get courses with highest popularity scores
    const trendingCourses = await Course.find()
      .sort('-popularity.views -popularity.enrollments -ratings.average')
      .limit(10);
    
    res.status(200).json({
      success: true,
      data: {
        title: 'Trending Now',
        courses: trendingCourses
      }
    });
    
    // Log analytics if user is logged in
    if (req.user) {
      await Analytics.create({
        userId: req.user.id,
        eventType: 'recommendation_impression',
        metadata: {
          recommendationType: 'trending'
        }
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get continue learning courses
// @route   GET /api/recommendations/continue-learning
// @access  Private
exports.getContinueLearning = async (req, res, next) => {
  try {
    // Get user with enrolled courses
    const user = await User.findById(req.user.id)
      .select('courseInteractions.enrolled')
      .populate({
        path: 'courseInteractions.enrolled.courseId',
        select: 'title description thumbnail provider difficulty ratings'
      });
    
    // Filter incomplete courses and sort by last accessed
    const continueLearning = user.courseInteractions.enrolled
      .filter(course => !course.completed)
      .sort((a, b) => b.lastAccessed - a.lastAccessed)
      .map(course => ({
        id: course.courseId._id,
        title: course.courseId.title,
        description: course.courseId.description,
        thumbnail: course.courseId.thumbnail,
        provider: course.courseId.provider,
        difficulty: course.courseId.difficulty,
        ratings: course.courseId.ratings,
        progress: course.progress,
        lastAccessed: course.lastAccessed
      }));
    
    res.status(200).json({
      success: true,
      data: {
        title: 'Continue Learning',
        courses: continueLearning
      }
    });
    
    // Log analytics
    await Analytics.create({
      userId: req.user.id,
      eventType: 'recommendation_impression',
      metadata: {
        recommendationType: 'continue_learning'
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Provide feedback on recommendation
// @route   POST /api/recommendations/:id/feedback
// @access  Private
exports.provideFeedback = async (req, res, next) => {
  try {
    const { courseId, rating } = req.body;
    
    if (!courseId || !rating) {
      return res.status(400).json({ success: false, message: 'Please provide courseId and rating' });
    }
    
    // Update recommendation feedback
    const recommendation = await Recommendation.findOneAndUpdate(
      { 
        _id: req.params.id,
        userId: req.user.id,
        'courses.courseId': courseId
      },
      {
        $set: { 'courses.$.userFeedback': rating }
      },
      { new: true }
    );
    
    if (!recommendation) {
      return res.status(404).json({ success: false, message: 'Recommendation not found' });
    }
    
    // Add to user's recommendation feedback
    await User.findByIdAndUpdate(req.user.id, {
      $push: {
        recommendationFeedback: {
          recommendationId: req.params.id,
          courseId,
          rating,
          context: recommendation.type
        }
      }
    });
    
    res.status(200).json({
      success: true,
      data: {}
    });
    
    // Log analytics
    await Analytics.create({
      userId: req.user.id,
      courseId,
      eventType: 'recommendation_feedback',
      metadata: {
        recommendationId: req.params.id,
        rating
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
