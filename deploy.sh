#!/bin/bash

# CourseFlixAI Deployment Script
# This script tests and deploys the CourseFlixAI application

echo "===== CourseFlixAI Deployment Script ====="
echo "Starting deployment process at $(date)"

# Set environment variables
export NODE_ENV=production
export NEXT_PUBLIC_API_URL=https://api.courseflix.ai
export NEXT_PUBLIC_ENABLE_ANALYTICS=true
export NEXT_PUBLIC_PROTOTYPE_MODE=true

# Navigate to project root
cd /home/ubuntu/class-central-netflix

# 1. Run tests
echo "===== Running Tests ====="

# Frontend tests
echo "Running frontend tests..."
cd frontend
npm test || { echo "Frontend tests failed"; exit 1; }

# Backend tests
echo "Running backend tests..."
cd ../backend
npm test || { echo "Backend tests failed"; exit 1; }

# AI recommendation tests
echo "Running AI recommendation tests..."
cd ../ai-recommendation
npm test || { echo "AI recommendation tests failed"; exit 1; }

# 2. Build the application
echo "===== Building Application ====="

# Build frontend
echo "Building frontend..."
cd ../frontend
npm run build || { echo "Frontend build failed"; exit 1; }

# Build backend
echo "Building backend..."
cd ../backend
npm run build || { echo "Backend build failed"; exit 1; }

# Build AI recommendation service
echo "Building AI recommendation service..."
cd ../ai-recommendation
npm run build || { echo "AI recommendation build failed"; exit 1; }

# 3. Deploy to Vercel (Frontend)
echo "===== Deploying Frontend to Vercel ====="
cd ../frontend
npx vercel --prod || { echo "Frontend deployment failed"; exit 1; }

# 4. Deploy to Heroku (Backend and AI Service)
echo "===== Deploying Backend to Heroku ====="
cd ../backend
git push heroku main || { echo "Backend deployment failed"; exit 1; }

echo "===== Deploying AI Service to Heroku ====="
cd ../ai-recommendation
git push heroku main || { echo "AI service deployment failed"; exit 1; }

# 5. Run post-deployment tests
echo "===== Running Post-Deployment Tests ====="
cd ..
npm run test:e2e || { echo "Post-deployment tests failed"; exit 1; }

echo "===== Deployment Completed Successfully ====="
echo "CourseFlixAI is now available at: https://courseflix.ai"
echo "Deployment finished at $(date)"
