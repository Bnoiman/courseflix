const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  avatar: {
    type: String,
    default: 'default-avatar.png'
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  learningPreferences: {
    goals: [{
      type: String,
      enum: ['career_advancement', 'skill_acquisition', 'personal_interest', 'academic', 'certification']
    }],
    experienceLevels: {
      programming: {
        type: String,
        enum: ['none', 'beginner', 'intermediate', 'advanced'],
        default: 'none'
      },
      dataScience: {
        type: String,
        enum: ['none', 'beginner', 'intermediate', 'advanced'],
        default: 'none'
      },
      design: {
        type: String,
        enum: ['none', 'beginner', 'intermediate', 'advanced'],
        default: 'none'
      },
      business: {
        type: String,
        enum: ['none', 'beginner', 'intermediate', 'advanced'],
        default: 'none'
      },
      other: {
        type: String,
        enum: ['none', 'beginner', 'intermediate', 'advanced'],
        default: 'none'
      }
    },
    timeCommitment: {
      hoursPerWeek: {
        type: Number,
        default: 5
      },
      preferredSessionLength: {
        type: String,
        enum: ['short', 'medium', 'long'],
        default: 'medium'
      }
    },
    learningStyles: [{
      type: String,
      enum: ['video', 'interactive', 'reading', 'project_based', 'discussion']
    }],
    interests: [String]
  },
  courseInteractions: {
    viewed: [{
      courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
      },
      lastViewed: {
        type: Date,
        default: Date.now
      },
      viewCount: {
        type: Number,
        default: 1
      }
    }],
    bookmarked: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    }],
    enrolled: [{
      courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
      },
      enrolledDate: {
        type: Date,
        default: Date.now
      },
      progress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
      },
      lastAccessed: {
        type: Date,
        default: Date.now
      },
      completed: {
        type: Boolean,
        default: false
      },
      completedDate: Date
    }],
    rated: [{
      courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
      },
      rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
      },
      review: String,
      date: {
        type: Date,
        default: Date.now
      }
    }]
  },
  recommendationFeedback: [{
    recommendationId: String,
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    },
    rating: {
      type: String,
      enum: ['positive', 'negative', 'neutral'],
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    context: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
