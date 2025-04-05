// CourseFlixAI AI Conversation Flow Manager
// This module manages conversation flow and context for the AI recommendation system

const { INTENTS, ENTITY_TYPES, analyzeIntent, extractEntities, generateResponse } = require('./conversation');

/**
 * Conversation state machine states
 */
const CONVERSATION_STATES = {
  GREETING: 'greeting',
  ONBOARDING: 'onboarding',
  DISCOVERY: 'discovery',
  RECOMMENDATION: 'recommendation',
  FEEDBACK: 'feedback',
  REFINEMENT: 'refinement',
  COMPLETION: 'completion'
};

/**
 * Conversation flow manager class
 */
class ConversationManager {
  /**
   * Create a new conversation manager
   * @param {Object} options - Configuration options
   */
  constructor(options = {}) {
    this.maxTurns = options.maxTurns || 20;
    this.minEntitiesForRecommendation = options.minEntitiesForRecommendation || 2;
    this.recommendationThreshold = options.recommendationThreshold || 0.7;
    this.confidenceThreshold = options.confidenceThreshold || 0.6;
  }

  /**
   * Initialize a new conversation
   * @returns {Object} New conversation context
   */
  initializeConversation() {
    return {
      state: CONVERSATION_STATES.GREETING,
      turns: 0,
      entities: {
        [ENTITY_TYPES.SUBJECT]: [],
        [ENTITY_TYPES.SKILL]: [],
        [ENTITY_TYPES.LEVEL]: [],
        [ENTITY_TYPES.FORMAT]: [],
        [ENTITY_TYPES.GOAL]: [],
        [ENTITY_TYPES.TIME]: []
      },
      currentIntent: null,
      lastIntent: null,
      lastResponse: "Hi there! I'm Flex, your personal learning assistant. What would you like to learn today?",
      recommendations: [],
      missingInformation: [],
      confidenceScore: 1.0
    };
  }

  /**
   * Process a user message and update conversation context
   * @param {string} message - User message
   * @param {Object} context - Current conversation context
   * @returns {Object} Updated conversation context with AI response
   */
  async processMessage(message, context) {
    // Create a new context object to avoid mutation
    const newContext = { ...context };
    
    // Increment turn counter
    newContext.turns += 1;
    
    // Analyze intent
    const intentResult = await analyzeIntent(message);
    newContext.lastIntent = newContext.currentIntent;
    newContext.currentIntent = intentResult.label;
    
    // Extract entities
    const extractedEntities = extractEntities(message);
    
    // Merge new entities with existing ones
    for (const entityType in extractedEntities) {
      if (extractedEntities[entityType].length > 0) {
        // Add new entities without duplicates
        extractedEntities[entityType].forEach(entity => {
          if (!newContext.entities[entityType].includes(entity)) {
            newContext.entities[entityType].push(entity);
          }
        });
      }
    }
    
    // Update conversation state based on intent and entities
    this._updateConversationState(newContext);
    
    // Determine missing information
    this._identifyMissingInformation(newContext);
    
    // Generate response based on updated context
    const response = this._generateResponseForState(newContext);
    newContext.lastResponse = response;
    
    return newContext;
  }

  /**
   * Update the conversation state based on current context
   * @param {Object} context - Conversation context
   * @private
   */
  _updateConversationState(context) {
    const { state, currentIntent, entities, turns } = context;
    
    // Count total entities collected
    const totalEntities = Object.values(entities).reduce(
      (sum, entityList) => sum + entityList.length, 0
    );
    
    // Calculate entity coverage (how many entity types have values)
    const entityTypesCovered = Object.values(entities).filter(
      entityList => entityList.length > 0
    ).length;
    
    // State transition logic
    switch (state) {
      case CONVERSATION_STATES.GREETING:
        // Move to onboarding after greeting
        if (turns >= 1) {
          context.state = CONVERSATION_STATES.ONBOARDING;
        }
        break;
        
      case CONVERSATION_STATES.ONBOARDING:
        // Move to discovery when we have some basic information
        if (entities[ENTITY_TYPES.SUBJECT].length > 0 || 
            entities[ENTITY_TYPES.SKILL].length > 0) {
          context.state = CONVERSATION_STATES.DISCOVERY;
        }
        break;
        
      case CONVERSATION_STATES.DISCOVERY:
        // Move to recommendation when we have enough information
        if (entityTypesCovered >= this.minEntitiesForRecommendation && 
            (entities[ENTITY_TYPES.SUBJECT].length > 0 || entities[ENTITY_TYPES.SKILL].length > 0)) {
          context.state = CONVERSATION_STATES.RECOMMENDATION;
        }
        break;
        
      case CONVERSATION_STATES.RECOMMENDATION:
        // Move to feedback after providing recommendations
        if (currentIntent === INTENTS.FEEDBACK) {
          context.state = CONVERSATION_STATES.FEEDBACK;
        }
        // Move to refinement if user asks for different recommendations
        else if (currentIntent === INTENTS.CLARIFICATION || 
                 currentIntent === INTENTS.PREFERENCE_STATEMENT) {
          context.state = CONVERSATION_STATES.REFINEMENT;
        }
        break;
        
      case CONVERSATION_STATES.FEEDBACK:
        // Move to completion or back to refinement based on feedback
        if (currentIntent === INTENTS.FAREWELL) {
          context.state = CONVERSATION_STATES.COMPLETION;
        } else {
          context.state = CONVERSATION_STATES.REFINEMENT;
        }
        break;
        
      case CONVERSATION_STATES.REFINEMENT:
        // Move back to recommendation with updated preferences
        if (entityTypesCovered >= this.minEntitiesForRecommendation) {
          context.state = CONVERSATION_STATES.RECOMMENDATION;
        }
        break;
        
      case CONVERSATION_STATES.COMPLETION:
        // Stay in completion state
        break;
        
      default:
        // Default to discovery
        context.state = CONVERSATION_STATES.DISCOVERY;
    }
    
    // Force completion if we've reached max turns
    if (turns >= this.maxTurns) {
      context.state = CONVERSATION_STATES.COMPLETION;
    }
  }

  /**
   * Identify missing information needed for better recommendations
   * @param {Object} context - Conversation context
   * @private
   */
  _identifyMissingInformation(context) {
    const { entities, state } = context;
    const missingInformation = [];
    
    // Only check for missing information in discovery and refinement states
    if (state !== CONVERSATION_STATES.DISCOVERY && 
        state !== CONVERSATION_STATES.REFINEMENT) {
      context.missingInformation = missingInformation;
      return;
    }
    
    // Check for missing subject/skill (highest priority)
    if (entities[ENTITY_TYPES.SUBJECT].length === 0 && 
        entities[ENTITY_TYPES.SKILL].length === 0) {
      missingInformation.push({
        type: ENTITY_TYPES.SUBJECT,
        question: "What specific subject or topic are you interested in learning?"
      });
    }
    
    // Check for missing experience level
    if (entities[ENTITY_TYPES.LEVEL].length === 0) {
      missingInformation.push({
        type: ENTITY_TYPES.LEVEL,
        question: "What's your experience level with this subject? Are you a beginner, intermediate, or advanced learner?"
      });
    }
    
    // Check for missing format preference
    if (entities[ENTITY_TYPES.FORMAT].length === 0) {
      missingInformation.push({
        type: ENTITY_TYPES.FORMAT,
        question: "Do you prefer video lectures, interactive exercises, reading materials, or a mix of formats?"
      });
    }
    
    // Check for missing time commitment
    if (entities[ENTITY_TYPES.TIME].length === 0) {
      missingInformation.push({
        type: ENTITY_TYPES.TIME,
        question: "How much time can you commit to learning? Are you looking for a quick course or a more comprehensive program?"
      });
    }
    
    // Check for missing goal
    if (entities[ENTITY_TYPES.GOAL].length === 0) {
      missingInformation.push({
        type: ENTITY_TYPES.GOAL,
        question: "What's your main goal for taking this course? Is it for career advancement, a specific skill, or personal interest?"
      });
    }
    
    context.missingInformation = missingInformation;
  }

  /**
   * Generate appropriate response based on conversation state
   * @param {Object} context - Conversation context
   * @returns {string} AI response
   * @private
   */
  _generateResponseForState(context) {
    const { state, entities, missingInformation, turns } = context;
    
    switch (state) {
      case CONVERSATION_STATES.GREETING:
        return "Hi there! I'm Flex, your personal learning assistant. What would you like to learn today?";
        
      case CONVERSATION_STATES.ONBOARDING:
        if (turns === 1) {
          return "Great! To help you find the perfect courses, could you tell me what subjects or skills you're interested in learning?";
        } else {
          return "I'd love to help you find the right course. What specific topic are you interested in?";
        }
        
      case CONVERSATION_STATES.DISCOVERY:
        // Ask about the highest priority missing information
        if (missingInformation.length > 0) {
          return missingInformation[0].question;
        } else {
          return "Thanks for sharing your preferences. I think I have enough information to recommend some courses for you now.";
        }
        
      case CONVERSATION_STATES.RECOMMENDATION:
        // In a real implementation, this would call the recommendation engine
        const subjectList = entities[ENTITY_TYPES.SUBJECT].join(', ');
        const levelList = entities[ENTITY_TYPES.LEVEL].join(', ');
        const formatList = entities[ENTITY_TYPES.FORMAT].join(', ');
        
        let response = "Based on your interest in ";
        response += subjectList ? subjectList : "this topic";
        
        if (levelList) {
          response += ` at a ${levelList} level`;
        }
        
        if (formatList) {
          response += ` with a preference for ${formatList} content`;
        }
        
        response += ", I recommend these courses:\n\n";
        response += "1. Python for Data Science and Machine Learning Bootcamp\n";
        response += "2. Machine Learning A-Z™: Hands-On Python & R In Data Science\n";
        response += "3. Deep Learning Specialization\n\n";
        response += "Would you like more information about any of these courses, or would you prefer different recommendations?";
        
        return response;
        
      case CONVERSATION_STATES.FEEDBACK:
        return "Thank you for your feedback! Would you like to explore more courses or refine your preferences for better recommendations?";
        
      case CONVERSATION_STATES.REFINEMENT:
        return "I'll help you find more relevant courses. Could you tell me more about what you're looking for?";
        
      case CONVERSATION_STATES.COMPLETION:
        return "I hope you found these recommendations helpful! Feel free to start a new conversation anytime you want to discover more courses. Happy learning!";
        
      default:
        return "I'm here to help you find the perfect course. What specific topics are you interested in?";
    }
  }

  /**
   * Get conversation summary for analytics and debugging
   * @param {Object} context - Conversation context
   * @returns {Object} Conversation summary
   */
  getConversationSummary(context) {
    const { state, turns, entities, currentIntent, recommendations } = context;
    
    return {
      state,
      turns,
      entitiesCollected: Object.entries(entities).reduce((acc, [type, values]) => {
        if (values.length > 0) {
          acc[type] = values;
        }
        return acc;
      }, {}),
      currentIntent,
      recommendationsCount: recommendations.length
    };
  }
}

module.exports = {
  CONVERSATION_STATES,
  ConversationManager
};
