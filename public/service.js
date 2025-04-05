// AI Recommendation service initialization
const { HfInference } = require('@huggingface/inference');
const natural = require('natural');

// Initialize Hugging Face client
const hf = new HfInference(process.env.HUGGING_FACE_TOKEN);

// Initialize NLP tools
const tokenizer = new natural.WordTokenizer();
const stemmer = natural.PorterStemmer;
const tfidf = new natural.TfIdf();

// Simple conversation analyzer
const analyzeIntent = async (text) => {
  try {
    // Basic intent classification using Hugging Face
    const result = await hf.textClassification({
      model: 'distilbert-base-uncased-finetuned-sst-2-english',
      inputs: text
    });
    
    return result;
  } catch (error) {
    console.error('Error analyzing intent:', error);
    return { error: 'Failed to analyze intent' };
  }
};

// Extract entities from text
const extractEntities = (text) => {
  const tokens = tokenizer.tokenize(text);
  const stems = tokens.map(token => stemmer.stem(token));
  
  // Simple entity extraction (would be enhanced with proper NER)
  const entities = {
    subjects: [],
    skills: [],
    levels: []
  };
  
  // Very basic keyword matching
  tokens.forEach(token => {
    if (['python', 'javascript', 'react', 'data', 'machine', 'learning'].includes(token.toLowerCase())) {
      entities.subjects.push(token.toLowerCase());
    }
    if (['coding', 'programming', 'design', 'analysis'].includes(token.toLowerCase())) {
      entities.skills.push(token.toLowerCase());
    }
    if (['beginner', 'intermediate', 'advanced'].includes(token.toLowerCase())) {
      entities.levels.push(token.toLowerCase());
    }
  });
  
  return entities;
};

// Simple recommendation based on extracted entities
const getRecommendations = (entities, count = 5) => {
  // This would connect to the database in the full implementation
  // For now, return mock recommendations
  return {
    recommendations: [
      { id: 1, title: 'Python for Beginners', match: 0.95 },
      { id: 2, title: 'Advanced JavaScript', match: 0.87 },
      { id: 3, title: 'Machine Learning Fundamentals', match: 0.82 },
      { id: 4, title: 'React Development', match: 0.78 },
      { id: 5, title: 'Data Analysis with Python', match: 0.75 }
    ],
    explanation: 'Based on your interest in programming and data science'
  };
};

module.exports = {
  analyzeIntent,
  extractEntities,
  getRecommendations
};
