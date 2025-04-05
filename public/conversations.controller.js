const express = require('express');
const router = express.Router();
const Conversation = require('../../../database/models/Conversation');
const User = require('../../../database/models/User');
const Analytics = require('../../../database/models/Analytics');
const { analyzeIntent, extractEntities, getRecommendations } = require('../../../ai-recommendation/src/recommendation/service');

// @desc    Start a new conversation
// @route   POST /api/conversations
// @access  Private
exports.startConversation = async (req, res, next) => {
  try {
    // Create new conversation
    const conversation = await Conversation.create({
      userId: req.user.id,
      messages: [{
        sender: 'ai',
        content: 'Hi there! I\'m your personal course advisor. What are you interested in learning today?',
        timestamp: Date.now()
      }],
      state: 'onboarding',
      context: {
        currentIntent: 'greeting',
        activeEntities: []
      }
    });
    
    res.status(201).json({
      success: true,
      data: conversation
    });
    
    // Log analytics
    await Analytics.create({
      userId: req.user.id,
      eventType: 'conversation_start',
      metadata: {
        conversationId: conversation._id
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get user's conversations
// @route   GET /api/conversations
// @access  Private
exports.getConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({
      userId: req.user.id
    })
    .sort('-lastActivityAt')
    .select('_id messages.content messages.sender messages.timestamp state startedAt lastActivityAt');
    
    res.status(200).json({
      success: true,
      count: conversations.length,
      data: conversations
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get single conversation
// @route   GET /api/conversations/:id
// @access  Private
exports.getConversation = async (req, res, next) => {
  try {
    const conversation = await Conversation.findOne({
      _id: req.params.id,
      userId: req.user.id
    });
    
    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }
    
    res.status(200).json({
      success: true,
      data: conversation
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Send message to conversation
// @route   POST /api/conversations/:id/messages
// @access  Private
exports.sendMessage = async (req, res, next) => {
  try {
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({ success: false, message: 'Please provide message content' });
    }
    
    // Find conversation
    let conversation = await Conversation.findOne({
      _id: req.params.id,
      userId: req.user.id
    });
    
    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }
    
    // Process user message
    const userMessage = {
      sender: 'user',
      content,
      timestamp: Date.now()
    };
    
    // Analyze intent and extract entities
    try {
      const intentResult = await analyzeIntent(content);
      userMessage.intent = intentResult.label;
      
      const entities = extractEntities(content);
      userMessage.entities = [];
      
      // Convert entities to array format
      Object.keys(entities).forEach(type => {
        entities[type].forEach(value => {
          userMessage.entities.push({ type, value });
        });
      });
    } catch (error) {
      console.error('Error analyzing message:', error);
    }
    
    // Add user message to conversation
    conversation.messages.push(userMessage);
    
    // Update conversation context
    if (userMessage.entities && userMessage.entities.length > 0) {
      conversation.context.activeEntities = [
        ...conversation.context.activeEntities,
        ...userMessage.entities
      ];
    }
    
    conversation.context.currentIntent = userMessage.intent || conversation.context.currentIntent;
    
    // Generate AI response
    let aiResponse;
    
    // Simple conversation flow based on state
    if (conversation.state === 'onboarding') {
      if (conversation.messages.length <= 3) {
        aiResponse = {
          sender: 'ai',
          content: 'That\'s interesting! Could you tell me about your experience level with this subject?',
          timestamp: Date.now()
        };
      } else {
        // Move to recommendation state after basic onboarding
        conversation.state = 'recommendation';
        
        // Get recommendations based on conversation
        const recommendations = getRecommendations(conversation.context.activeEntities);
        
        // Store recommendation IDs in context
        conversation.context.lastRecommendations = recommendations.recommendations.map(rec => rec.id);
        
        aiResponse = {
          sender: 'ai',
          content: `Based on our conversation, I think you might enjoy these courses: 
          
1. ${recommendations.recommendations[0].title}
2. ${recommendations.recommendations[1].title}
3. ${recommendations.recommendations[2].title}

${recommendations.explanation}. Would you like more information about any of these?`,
          timestamp: Date.now()
        };
        
        // Log recommendation event
        await Analytics.create({
          userId: req.user.id,
          eventType: 'conversation_recommendation',
          metadata: {
            conversationId: conversation._id,
            recommendations: recommendations.recommendations.map(r => r.id)
          }
        });
      }
    } else if (conversation.state === 'recommendation') {
      // In recommendation state, provide more details or refine recommendations
      aiResponse = {
        sender: 'ai',
        content: 'Would you like me to suggest courses that are more specific to your interests? Or would you prefer something different?',
        timestamp: Date.now()
      };
    } else {
      // Default response
      aiResponse = {
        sender: 'ai',
        content: 'I\'m here to help you find the perfect course. What specific topics are you interested in?',
        timestamp: Date.now()
      };
    }
    
    // Add AI response to conversation
    conversation.messages.push(aiResponse);
    
    // Save updated conversation
    await conversation.save();
    
    res.status(200).json({
      success: true,
      data: {
        userMessage,
        aiResponse
      }
    });
    
    // Log analytics
    await Analytics.create({
      userId: req.user.id,
      eventType: 'conversation_message',
      metadata: {
        conversationId: conversation._id,
        messageCount: conversation.messages.length
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    End conversation
// @route   PUT /api/conversations/:id/end
// @access  Private
exports.endConversation = async (req, res, next) => {
  try {
    const conversation = await Conversation.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.id
      },
      {
        isActive: false,
        state: 'completed'
      },
      { new: true }
    );
    
    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }
    
    res.status(200).json({
      success: true,
      data: conversation
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
