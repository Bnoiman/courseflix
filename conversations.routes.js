const express = require('express');
const router = express.Router();
const conversationsController = require('../controllers/conversations.controller');
const { protect } = require('../middleware/auth');

// All conversation routes are protected
router.post('/', protect, conversationsController.startConversation);
router.get('/', protect, conversationsController.getConversations);
router.get('/:id', protect, conversationsController.getConversation);
router.post('/:id/messages', protect, conversationsController.sendMessage);
router.put('/:id/end', protect, conversationsController.endConversation);

module.exports = router;
