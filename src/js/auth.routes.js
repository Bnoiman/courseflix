const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth');

// Register and login routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

// Protected routes
router.get('/me', protect, authController.getMe);
router.put('/updatedetails', protect, authController.updateDetails);
router.put('/updatepassword', protect, authController.updatePassword);

module.exports = router;
