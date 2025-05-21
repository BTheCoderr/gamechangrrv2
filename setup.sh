#!/bin/bash

echo "🚀 Setting up GameChanger 2.0..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required but not installed. Please install Node.js and try again."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is required but not installed. Please install npm and try again."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo "🔑 Creating .env.local file..."
    cat > .env.local << EOL
# OpenAI (for AI chat functionality)
NEXT_PUBLIC_OPENAI_API_KEY=

# ElevenLabs (for voice generation)
NEXT_PUBLIC_ELEVENLABS_API_KEY=

# Optional: Twilio (for real phone calls)
NEXT_PUBLIC_TWILIO_ACCOUNT_SID=
NEXT_PUBLIC_TWILIO_AUTH_TOKEN=
NEXT_PUBLIC_TWILIO_PHONE_NUMBER=
NEXT_PUBLIC_TWILIO_TWIML_BIN_URL=
EOL
    echo "✅ Created .env.local - please edit this file to add your API keys"
else
    echo "ℹ️ .env.local already exists, skipping creation"
fi

# Build the app
echo "🏗️ Building the application..."
npm run build

echo "✅ Setup complete! You can now run the application with:"
echo "   npm run dev"
echo ""
echo "⚠️ Remember to add your API keys to the .env.local file if you want to use real AI services."
echo "   For demo purposes, the app will work without API keys using mock data." 