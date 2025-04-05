#!/bin/bash

# CourseFlixAI Local Prototype Deployment Script
# This script deploys a local version of the CourseFlixAI prototype for sharing

echo "===== CourseFlixAI Local Prototype Deployment ====="
echo "Starting local deployment process at $(date)"

# Navigate to project root
cd /home/ubuntu/class-central-netflix

# 1. Install dependencies if needed
echo "===== Checking dependencies ====="
cd frontend
if [ ! -d "node_modules" ]; then
  echo "Installing frontend dependencies..."
  npm install
else
  echo "Frontend dependencies already installed."
fi

# 2. Build the frontend for production
echo "===== Building frontend for production ====="
npm run build || { echo "Frontend build failed"; exit 1; }

# 3. Set up mock data for the prototype
echo "===== Setting up mock data ====="
mkdir -p public/data/mock
cp -r ../database/mock-data/* public/data/mock/ || { echo "Mock data setup failed"; exit 1; }

# 4. Create .env.local file for the prototype
echo "===== Creating environment configuration ====="
cat > .env.local << EOL
NEXT_PUBLIC_PROTOTYPE_MODE=true
NEXT_PUBLIC_API_URL=/data/mock
NEXT_PUBLIC_ENABLE_ANALYTICS=false
EOL

# 5. Start the local server
echo "===== Starting local server ====="
npm run start &
SERVER_PID=$!

# Wait for server to start
echo "Waiting for server to start..."
sleep 5

# 6. Expose the local server for sharing
echo "===== Exposing local server for sharing ====="
echo "Setting up ngrok tunnel..."
npx ngrok http 3000 > ngrok_log.txt &
NGROK_PID=$!

# Wait for ngrok to start
echo "Waiting for ngrok to initialize..."
sleep 5

# Extract the public URL
PUBLIC_URL=$(grep -o "https://.*\.ngrok\.io" ngrok_log.txt | head -n 1)

if [ -z "$PUBLIC_URL" ]; then
  echo "Failed to get public URL from ngrok. Check ngrok_log.txt for details."
  echo "Killing server process..."
  kill $SERVER_PID
  kill $NGROK_PID
  exit 1
fi

# 7. Generate QR code for easy sharing
echo "===== Generating QR code for sharing ====="
echo "Creating QR code for $PUBLIC_URL"
qrencode -o prototype_qr.png "$PUBLIC_URL" || echo "QR code generation failed. Install qrencode if needed."

# 8. Display sharing information
echo "===== CourseFlixAI Prototype Sharing Information ====="
echo "Prototype is now available at: $PUBLIC_URL"
echo "QR Code saved as: prototype_qr.png"
echo "Share this URL with friends to get feedback on the prototype."
echo ""
echo "To stop the prototype server, run: kill $SERVER_PID $NGROK_PID"
echo "===== Local Deployment Completed ====="

# Save the process IDs for later cleanup
echo "$SERVER_PID $NGROK_PID" > prototype_processes.txt

echo "Prototype will remain accessible until you stop the server."
echo "To stop the server, run: bash stop_prototype.sh"
