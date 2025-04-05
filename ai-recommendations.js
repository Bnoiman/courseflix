/**
 * CourseFlixAI - AI Recommendation System
 * Mock implementation for demonstration purposes
 */

const mockConversations = {
  "greetings": [
    "Welcome to CourseFlixAI! What would you like to learn today?",
    "Hello! I'm your AI learning assistant. What topics are you interested in?",
    "Hi there! Looking for course recommendations? What subjects interest you?"
  ],
  
  "python_interest": [
    {
      "response": "Great choice! Python is one of the most versatile programming languages. Based on your interest, I recommend these courses:",
      "recommendations": ["python-crash", "python-data-science", "django-web-dev"]
    }
  ],
  
  "web_development_interest": [
    {
      "response": "Web development is an excellent skill! Here are some top-rated courses I recommend:",
      "recommendations": ["full-stack-web", "react-complete-guide", "web-dev-bootcamp"]
    }
  ],
  
  "data_science_interest": [
    {
      "response": "Data Science is a rapidly growing field! Here are some courses to get you started:",
      "recommendations": ["data-science-masters", "ml-az", "python-data-science"]
    }
  ],
  
  "beginner_level": [
    {
      "response": "For beginners, I recommend starting with these foundational courses:",
      "recommendations": ["python-crash", "web-dev-bootcamp", "cs-fundamentals"]
    }
  ],
  
  "advanced_level": [
    {
      "response": "For advanced learners, these courses offer deeper expertise:",
      "recommendations": ["ml-az", "advanced-react-patterns", "system-design"]
    }
  ],
  
  "fallback": [
    {
      "response": "Based on your interests, here are some popular courses you might enjoy:",
      "recommendations": ["ml-az", "web-dev-bootcamp", "python-crash"]
    }
  ]
};

function getRandomResponse(category) {
  const responses = mockConversations[category] || mockConversations.fallback;
  return responses[Math.floor(Math.random() * responses.length)];
}

function getGreeting() {
  return mockConversations.greetings[Math.floor(Math.random() * mockConversations.greetings.length)];
}

function processUserInput(input) {
  const lowerInput = input.toLowerCase();
  
  if (lowerInput.includes('python')) {
    return getRandomResponse('python_interest');
  } else if (lowerInput.includes('web') || lowerInput.includes('javascript') || lowerInput.includes('html')) {
    return getRandomResponse('web_development_interest');
  } else if (lowerInput.includes('data') || lowerInput.includes('machine learning') || lowerInput.includes('ai')) {
    return getRandomResponse('data_science_interest');
  } else if (lowerInput.includes('beginner') || lowerInput.includes('start')) {
    return getRandomResponse('beginner_level');
  } else if (lowerInput.includes('advanced') || lowerInput.includes('expert')) {
    return getRandomResponse('advanced_level');
  } else {
    return getRandomResponse('fallback');
  }
}
