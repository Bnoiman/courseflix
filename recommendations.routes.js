const express = require('express');
const router = express.Router();
const recommendationsController = require('../controllers/recommendations.controller');
const { protect } = require('../middleware/auth');

// Public routes
router.get('/trending', recommendationsController.getTrending);

// Protected routes
router.get('/', protect, recommendationsController.getRecommendations);
router.get('/because-you-watched/:courseId', protect, recommendationsController.getBecauseYouWatched);
router.get('/continue-learning', protect, recommendationsController.getContinueLearning);
router.post('/:id/feedback', protect, recommendationsController.provideFeedback);

module.exports = router;
