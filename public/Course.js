const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  slug: {
    type: String,
    unique: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  shortDescription: {
    type: String,
    maxlength: [200, 'Short description cannot be more than 200 characters']
  },
  thumbnail: {
    type: String,
    default: 'default-course.jpg'
  },
  previewVideo: {
    type: String
  },
  provider: {
    name: {
      type: String,
      required: [true, 'Please add a provider name']
    },
    logo: String,
    url: String
  },
  instructors: [{
    name: String,
    bio: String,
    photo: String
  }],
  duration: {
    hours: Number,
    weeks: Number
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: [true, 'Please specify difficulty level']
  },
  format: {
    type: String,
    enum: ['video', 'interactive', 'reading', 'mixed'],
    default: 'mixed'
  },
  topics: [{
    type: String,
    required: [true, 'Please add at least one topic']
  }],
  skills: [{
    type: String
  }],
  prerequisites: [{
    type: String
  }],
  syllabus: [{
    title: String,
    description: String,
    duration: String,
    modules: [{
      title: String,
      description: String,
      duration: String
    }]
  }],
  pricing: {
    isFree: {
      type: Boolean,
      default: false
    },
    price: {
      type: Number
    },
    currency: {
      type: String,
      default: 'USD'
    },
    hasCertificate: {
      type: Boolean,
      default: false
    },
    certificatePrice: {
      type: Number
    }
  },
  url: {
    type: String,
    required: [true, 'Please add course URL']
  },
  ratings: {
    average: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  },
  popularity: {
    views: {
      type: Number,
      default: 0
    },
    enrollments: {
      type: Number,
      default: 0
    },
    completions: {
      type: Number,
      default: 0
    },
    bookmarks: {
      type: Number,
      default: 0
    }
  },
  embeddings: {
    vector: [Number],
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  relatedCourses: [{
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    },
    similarityScore: Number
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create course slug from the title
CourseSchema.pre('save', function(next) {
  if (!this.isModified('title')) {
    next();
  }
  this.slug = this.title
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
  
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Course', CourseSchema);
