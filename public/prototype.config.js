// CourseFlixAI - Prototype Configuration
module.exports = {
  // Deployment settings for the shareable prototype
  prototype: {
    name: 'CourseFlixAI Prototype',
    version: '0.1.0',
    description: 'A Netflix-style learning platform with AI recommendations',
    shareableUrl: 'https://courseflix-ai-prototype.vercel.app',
    qrCodeEnabled: true,
    feedbackFormUrl: 'https://forms.gle/courseflixAiFeedback',
    demoCredentials: {
      email: 'demo@courseflix.ai',
      password: 'demouser2025'
    }
  },
  
  // Mock data settings
  mockData: {
    useMockData: true,
    mockDataPath: '/data/mock',
    mockApiDelay: 300, // ms
    mockAuthEnabled: true
  },
  
  // Feature flags for the prototype
  features: {
    aiChat: true,
    recommendations: true,
    userProfiles: true,
    courseEnrollment: true,
    progressTracking: true,
    notifications: true,
    offlineAccess: false,
    payments: false
  },
  
  // Analytics for prototype usage
  analytics: {
    enabled: true,
    provider: 'simple-analytics',
    anonymousTracking: true,
    trackEvents: [
      'page_view',
      'course_click',
      'search',
      'ai_chat_message',
      'recommendation_click',
      'feedback_submitted'
    ]
  },
  
  // Sharing options
  sharing: {
    methods: [
      'link',
      'email',
      'qr_code',
      'social_media'
    ],
    defaultMessage: 'Check out CourseFlixAI - a Netflix-style learning platform with AI recommendations! I\'d love your feedback.',
    platforms: [
      'twitter',
      'facebook',
      'linkedin',
      'whatsapp'
    ]
  }
};
