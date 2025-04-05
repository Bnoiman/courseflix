const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a category name'],
    unique: true,
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  slug: {
    type: String,
    unique: true
  },
  description: {
    type: String
  },
  color: {
    type: String,
    default: '#0071EB' // Default Netflix blue
  },
  icon: {
    type: String
  },
  featured: {
    type: Boolean,
    default: false
  },
  parentCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  order: {
    type: Number,
    default: 0
  },
  courses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create category slug from the name
CategorySchema.pre('save', function(next) {
  if (!this.isModified('name')) {
    next();
  }
  this.slug = this.name
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
  next();
});

module.exports = mongoose.model('Category', CategorySchema);
