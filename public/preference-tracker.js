// CourseFlixAI Entity Extraction and Preference Tracking
// This module handles extraction of user preferences from conversations

const { ENTITY_TYPES } = require('./conversation');

/**
 * Preference strength levels
 */
const PREFERENCE_STRENGTH = {
  WEAK: 0.3,
  MEDIUM: 0.6,
  STRONG: 0.9
};

/**
 * User preference tracker class
 */
class PreferenceTracker {
  /**
   * Create a new preference tracker
   * @param {Object} options - Configuration options
   */
  constructor(options = {}) {
    this.decayFactor = options.decayFactor || 0.9; // How quickly older preferences decay
    this.recencyBoost = options.recencyBoost || 1.2; // Boost for most recent preferences
    this.negationWords = options.negationWords || ['not', 'don\'t', 'doesn\'t', 'didn\'t', 'no', 'never'];
    this.strengthWords = {
      strong: ['really', 'very', 'extremely', 'definitely', 'absolutely', 'love', 'passionate'],
      weak: ['somewhat', 'kind of', 'a bit', 'slightly', 'maybe', 'perhaps']
    };
  }

  /**
   * Initialize a new user preference profile
   * @returns {Object} New preference profile
   */
  initializePreferences() {
    return {
      subjects: {}, // Subject -> strength mapping
      skills: {},   // Skill -> strength mapping
      levels: {},   // Level -> strength mapping
      formats: {},  // Format -> strength mapping
      goals: {},    // Goal -> strength mapping
      timeCommitments: {}, // Time commitment -> strength mapping
      providers: {}, // Provider -> strength mapping
      negations: [], // List of things user explicitly doesn't want
      history: []    // Chronological history of preference updates
    };
  }

  /**
   * Update user preferences based on extracted entities and message context
   * @param {Object} preferences - Current user preferences
   * @param {Object} entities - Extracted entities from message
   * @param {string} message - Original user message
   * @returns {Object} Updated user preferences
   */
  updatePreferences(preferences, entities, message) {
    // Create a new preferences object to avoid mutation
    const newPreferences = JSON.parse(JSON.stringify(preferences));
    
    // Check for negations in the message
    const hasNegation = this._checkForNegation(message);
    
    // Determine preference strength based on message content
    const strength = this._determinePreferenceStrength(message);
    
    // Process each entity type
    this._processEntityType(newPreferences.subjects, entities[ENTITY_TYPES.SUBJECT], strength, hasNegation, message);
    this._processEntityType(newPreferences.skills, entities[ENTITY_TYPES.SKILL], strength, hasNegation, message);
    this._processEntityType(newPreferences.levels, entities[ENTITY_TYPES.LEVEL], strength, hasNegation, message);
    this._processEntityType(newPreferences.formats, entities[ENTITY_TYPES.FORMAT], strength, hasNegation, message);
    this._processEntityType(newPreferences.goals, entities[ENTITY_TYPES.GOAL], strength, hasNegation, message);
    this._processEntityType(newPreferences.timeCommitments, entities[ENTITY_TYPES.TIME], strength, hasNegation, message);
    
    // Apply decay to existing preferences
    this._applyPreferenceDecay(newPreferences);
    
    // Record preference update in history
    newPreferences.history.push({
      timestamp: new Date().toISOString(),
      entities: JSON.parse(JSON.stringify(entities)),
      message: message
    });
    
    return newPreferences;
  }

  /**
   * Process entities of a specific type and update corresponding preferences
   * @param {Object} preferenceMap - Map of preferences for this entity type
   * @param {Array} entities - Entities of this type
   * @param {number} baseStrength - Base preference strength
   * @param {boolean} hasNegation - Whether message contains negation
   * @param {string} message - Original message for context
   * @private
   */
  _processEntityType(preferenceMap, entities, baseStrength, hasNegation, message) {
    if (!entities || entities.length === 0) {
      return;
    }
    
    entities.forEach(entity => {
      // If negation is present, add to negations list instead of preferences
      if (hasNegation && this._isNegationApplicable(entity, message)) {
        if (!this.negations.includes(entity)) {
          this.negations.push(entity);
        }
        
        // Remove from preferences if it exists
        if (preferenceMap[entity]) {
          delete preferenceMap[entity];
        }
      } else {
        // Update preference strength
        const currentStrength = preferenceMap[entity] || 0;
        const newStrength = Math.min(1, currentStrength + baseStrength);
        preferenceMap[entity] = newStrength;
      }
    });
  }

  /**
   * Check if a message contains negation words
   * @param {string} message - User message
   * @returns {boolean} Whether message contains negation
   * @private
   */
  _checkForNegation(message) {
    const lowerMessage = message.toLowerCase();
    return this.negationWords.some(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'i');
      return regex.test(lowerMessage);
    });
  }

  /**
   * Determine if negation applies to a specific entity
   * @param {string} entity - Entity value
   * @param {string} message - Original message
   * @returns {boolean} Whether negation applies to this entity
   * @private
   */
  _isNegationApplicable(entity, message) {
    const lowerMessage = message.toLowerCase();
    const lowerEntity = entity.toLowerCase();
    
    // Check if entity is mentioned in proximity to negation words
    for (const negationWord of this.negationWords) {
      const negationIndex = lowerMessage.indexOf(negationWord);
      if (negationIndex !== -1) {
        const entityIndex = lowerMessage.indexOf(lowerEntity);
        if (entityIndex !== -1) {
          // Check if negation is within 5 words of entity
          const textBetween = lowerMessage.substring(
            Math.min(negationIndex, entityIndex),
            Math.max(negationIndex, entityIndex)
          );
          const wordCount = textBetween.split(/\s+/).length;
          if (wordCount <= 5) {
            return true;
          }
        }
      }
    }
    
    return false;
  }

  /**
   * Determine preference strength based on message content
   * @param {string} message - User message
   * @returns {number} Preference strength value
   * @private
   */
  _determinePreferenceStrength(message) {
    const lowerMessage = message.toLowerCase();
    
    // Check for strong preference indicators
    for (const word of this.strengthWords.strong) {
      if (lowerMessage.includes(word)) {
        return PREFERENCE_STRENGTH.STRONG;
      }
    }
    
    // Check for weak preference indicators
    for (const word of this.strengthWords.weak) {
      if (lowerMessage.includes(word)) {
        return PREFERENCE_STRENGTH.WEAK;
      }
    }
    
    // Default to medium strength
    return PREFERENCE_STRENGTH.MEDIUM;
  }

  /**
   * Apply decay to existing preferences to prioritize recent preferences
   * @param {Object} preferences - User preferences
   * @private
   */
  _applyPreferenceDecay(preferences) {
    const applyDecay = (prefMap) => {
      for (const key in prefMap) {
        prefMap[key] *= this.decayFactor;
        
        // Remove very weak preferences
        if (prefMap[key] < 0.1) {
          delete prefMap[key];
        }
      }
    };
    
    applyDecay(preferences.subjects);
    applyDecay(preferences.skills);
    applyDecay(preferences.levels);
    applyDecay(preferences.formats);
    applyDecay(preferences.goals);
    applyDecay(preferences.timeCommitments);
    applyDecay(preferences.providers);
  }

  /**
   * Get top preferences for each category
   * @param {Object} preferences - User preferences
   * @param {number} limit - Maximum number of top preferences to return
   * @returns {Object} Top preferences by category
   */
  getTopPreferences(preferences, limit = 3) {
    const getTopForCategory = (prefMap) => {
      return Object.entries(prefMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([key, value]) => ({ value: key, strength: value }));
    };
    
    return {
      subjects: getTopForCategory(preferences.subjects),
      skills: getTopForCategory(preferences.skills),
      levels: getTopForCategory(preferences.levels),
      formats: getTopForCategory(preferences.formats),
      goals: getTopForCategory(preferences.goals),
      timeCommitments: getTopForCategory(preferences.timeCommitments),
      providers: getTopForCategory(preferences.providers),
      negations: preferences.negations
    };
  }

  /**
   * Convert preferences to recommendation query parameters
   * @param {Object} preferences - User preferences
   * @returns {Object} Query parameters for recommendation engine
   */
  preferencesToQueryParams(preferences) {
    const topPrefs = this.getTopPreferences(preferences);
    
    // Build query parameters
    const queryParams = {
      subjects: topPrefs.subjects.map(p => p.value),
      skills: topPrefs.skills.map(p => p.value),
      level: topPrefs.levels.length > 0 ? topPrefs.levels[0].value : null,
      format: topPrefs.formats.length > 0 ? topPrefs.formats[0].value : null,
      goal: topPrefs.goals.length > 0 ? topPrefs.goals[0].value : null,
      timeCommitment: topPrefs.timeCommitments.length > 0 ? topPrefs.timeCommitments[0].value : null,
      excludeSubjects: preferences.negations.filter(n => preferences.subjects[n] === undefined),
      excludeProviders: preferences.negations.filter(n => preferences.providers[n] === undefined)
    };
    
    // Remove null/empty values
    Object.keys(queryParams).forEach(key => {
      if (queryParams[key] === null || 
          (Array.isArray(queryParams[key]) && queryParams[key].length === 0)) {
        delete queryParams[key];
      }
    });
    
    return queryParams;
  }
}

module.exports = {
  PREFERENCE_STRENGTH,
  PreferenceTracker
};
