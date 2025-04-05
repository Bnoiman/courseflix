#!/bin/bash

# CourseFlixAI Deployment Verification Script
# This script verifies the deployment of CourseFlixAI application

echo "===== CourseFlixAI Deployment Verification Script ====="
echo "Starting verification process at $(date)"

# Set environment variables
export VERIFICATION_TIMEOUT=30 # seconds

# 1. Verify Frontend Deployment
echo "===== Verifying Frontend Deployment ====="
echo "Checking frontend availability at https://courseflix.ai..."
curl -s --head --request GET https://courseflix.ai | grep "200 OK" > /dev/null
if [ $? -eq 0 ]; then
    echo "✅ Frontend is accessible"
else
    echo "❌ Frontend verification failed"
fi

# 2. Verify Backend API Deployment
echo "===== Verifying Backend API Deployment ====="
echo "Checking API availability at https://api.courseflix.ai/health..."
curl -s --request GET https://api.courseflix.ai/health | grep "status.*ok" > /dev/null
if [ $? -eq 0 ]; then
    echo "✅ Backend API is accessible"
else
    echo "❌ Backend API verification failed"
fi

# 3. Verify AI Recommendation Service
echo "===== Verifying AI Recommendation Service ====="
echo "Checking AI service availability at https://ai.courseflix.ai/health..."
curl -s --request GET https://ai.courseflix.ai/health | grep "status.*ok" > /dev/null
if [ $? -eq 0 ]; then
    echo "✅ AI Recommendation Service is accessible"
else
    echo "❌ AI Recommendation Service verification failed"
fi

# 4. Verify Database Connection
echo "===== Verifying Database Connection ====="
echo "Checking database connection through API..."
curl -s --request GET https://api.courseflix.ai/health/database | grep "database.*connected" > /dev/null
if [ $? -eq 0 ]; then
    echo "✅ Database connection is working"
else
    echo "❌ Database connection verification failed"
fi

# 5. Verify Critical User Flows
echo "===== Verifying Critical User Flows ====="

# Check homepage loading
echo "Checking homepage loading..."
curl -s --request GET https://courseflix.ai | grep "CourseFlixAI" > /dev/null
if [ $? -eq 0 ]; then
    echo "✅ Homepage loads correctly"
else
    echo "❌ Homepage verification failed"
fi

# Check search functionality
echo "Checking search functionality..."
curl -s --request GET "https://api.courseflix.ai/courses/search?q=python" | grep "results" > /dev/null
if [ $? -eq 0 ]; then
    echo "✅ Search functionality is working"
else
    echo "❌ Search functionality verification failed"
fi

# Check recommendation API
echo "Checking recommendation API..."
curl -s --request GET "https://ai.courseflix.ai/recommendations/trending" | grep "courses" > /dev/null
if [ $? -eq 0 ]; then
    echo "✅ Recommendation API is working"
else
    echo "❌ Recommendation API verification failed"
fi

# 6. Verify Mobile Responsiveness
echo "===== Verifying Mobile Responsiveness ====="
echo "Running Lighthouse mobile audit..."
npx lighthouse https://courseflix.ai --quiet --chrome-flags="--headless" --output=json --output-path=./lighthouse-mobile.json --form-factor=mobile --only-categories=performance,accessibility
MOBILE_PERFORMANCE=$(cat ./lighthouse-mobile.json | grep -o '"performance":[0-9.]*' | cut -d':' -f2)
MOBILE_ACCESSIBILITY=$(cat ./lighthouse-mobile.json | grep -o '"accessibility":[0-9.]*' | cut -d':' -f2)

echo "Mobile Performance Score: $MOBILE_PERFORMANCE"
echo "Mobile Accessibility Score: $MOBILE_ACCESSIBILITY"

if (( $(echo "$MOBILE_PERFORMANCE > 0.7" | bc -l) )) && (( $(echo "$MOBILE_ACCESSIBILITY > 0.9" | bc -l) )); then
    echo "✅ Mobile responsiveness verification passed"
else
    echo "❌ Mobile responsiveness verification failed"
fi

# 7. Verify PWA Capabilities
echo "===== Verifying PWA Capabilities ====="
echo "Checking manifest.json..."
curl -s --head --request GET https://courseflix.ai/manifest.json | grep "200 OK" > /dev/null
if [ $? -eq 0 ]; then
    echo "✅ PWA manifest is accessible"
else
    echo "❌ PWA manifest verification failed"
fi

echo "Checking service worker..."
curl -s --head --request GET https://courseflix.ai/service-worker.js | grep "200 OK" > /dev/null
if [ $? -eq 0 ]; then
    echo "✅ Service worker is accessible"
else
    echo "❌ Service worker verification failed"
fi

# 8. Summary
echo "===== Deployment Verification Summary ====="
echo "Verification completed at $(date)"
echo "CourseFlixAI is deployed and accessible at: https://courseflix.ai"
echo "API is accessible at: https://api.courseflix.ai"
echo "AI Recommendation Service is accessible at: https://ai.courseflix.ai"

# Clean up
rm -f ./lighthouse-mobile.json

echo "===== Verification Process Completed ====="
