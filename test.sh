#!/bin/bash

# CourseFlixAI Test Script
# This script runs tests for the CourseFlixAI application

echo "===== CourseFlixAI Test Script ====="
echo "Starting test process at $(date)"

# Navigate to project root
cd /home/ubuntu/class-central-netflix

# 1. Frontend Tests
echo "===== Running Frontend Tests ====="
cd frontend

# Lint tests
echo "Running ESLint..."
npx eslint src/ || echo "ESLint found issues"

# Component tests
echo "Running component tests..."
npx jest --testPathPattern=src/components || echo "Component tests failed"

# Page tests
echo "Running page tests..."
npx jest --testPathPattern=src/pages || echo "Page tests failed"

# Responsive design tests
echo "Running responsive design tests..."
npx jest --testPathPattern=src/tests/responsive || echo "Responsive tests failed"

# 2. Backend Tests
echo "===== Running Backend Tests ====="
cd ../backend

# API route tests
echo "Running API route tests..."
npx jest --testPathPattern=src/routes || echo "API route tests failed"

# Controller tests
echo "Running controller tests..."
npx jest --testPathPattern=src/controllers || echo "Controller tests failed"

# Database model tests
echo "Running database model tests..."
npx jest --testPathPattern=src/models || echo "Model tests failed"

# 3. AI Recommendation Tests
echo "===== Running AI Recommendation Tests ====="
cd ../ai-recommendation

# NLP tests
echo "Running NLP tests..."
npx jest --testPathPattern=src/nlp || echo "NLP tests failed"

# Recommendation engine tests
echo "Running recommendation engine tests..."
npx jest --testPathPattern=src/recommendation || echo "Recommendation engine tests failed"

# 4. Integration Tests
echo "===== Running Integration Tests ====="
cd ..

# API integration tests
echo "Running API integration tests..."
npx jest --testPathPattern=tests/integration/api || echo "API integration tests failed"

# Frontend-backend integration tests
echo "Running frontend-backend integration tests..."
npx jest --testPathPattern=tests/integration/frontend-backend || echo "Frontend-backend integration tests failed"

# 5. End-to-End Tests
echo "===== Running End-to-End Tests ====="

# User flow tests
echo "Running user flow tests..."
npx cypress run --spec "tests/e2e/user-flows/**/*.spec.js" || echo "User flow tests failed"

# Mobile responsiveness tests
echo "Running mobile responsiveness tests..."
npx cypress run --spec "tests/e2e/responsive/**/*.spec.js" || echo "Mobile responsiveness tests failed"

echo "===== Test Process Completed ====="
echo "Test process finished at $(date)"
