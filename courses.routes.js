const express = require('express');
const router = express.Router();
const coursesController = require('../controllers/courses.controller');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', coursesController.getCourses);
router.get('/search', coursesController.searchCourses);
router.get('/category/:categoryId', coursesController.getCoursesByCategory);
router.get('/:id', coursesController.getCourse);

// Protected routes for admins
router.post('/', protect, authorize('admin'), coursesController.createCourse);
router.put('/:id', protect, authorize('admin'), coursesController.updateCourse);
router.delete('/:id', protect, authorize('admin'), coursesController.deleteCourse);

module.exports = router;
