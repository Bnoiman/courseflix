const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const errorHandler = require('./middleware/error');

// Load env vars
dotenv.config();

// Route files
const auth = require('./routes/auth.routes');
const courses = require('./routes/courses.routes');
const recommendations = require('./routes/recommendations.routes');
const conversations = require('./routes/conversations.routes');

// Initialize app
const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Mount routers
app.use('/api/auth', auth);
app.use('/api/courses', courses);
app.use('/api/recommendations', recommendations);
app.use('/api/conversations', conversations);

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Class Central Netflix API',
    version: '1.0.0'
  });
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  // server.close(() => process.exit(1));
});

module.exports = app;
