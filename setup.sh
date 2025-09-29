#!/bin/bash

# SensayApp Quick Setup Script

echo "🚀 Setting up SensayApp..."

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Install Node.js 18+ from https://nodejs.org"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js 18+ required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) found"

# Check for pnpm
if ! command -v pnpm &> /dev/null; then
    echo "📦 Installing pnpm..."
    npm install -g pnpm
fi

echo "✅ pnpm $(pnpm -v) found"

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp env.example .env
    echo "⚠️  Edit .env file with your Sensay API settings"
else
    echo "✅ .env file already exists"
fi

# Generate Prisma client
echo "🗄️ Generating Prisma client..."
pnpm prisma generate

# Check database connection
echo "🔍 Checking database connection..."
if pnpm prisma db push --accept-data-loss; then
    echo "✅ Database configured successfully"
else
    echo "❌ Database connection error. Check DATABASE_URL in .env"
    echo "💡 Make sure PostgreSQL is running and accessible"
fi

echo ""
echo "🎉 Setup completed!"
echo ""
echo "Next steps:"
echo "1. Edit .env file with your Sensay API settings"
echo "2. Run the application: pnpm dev"
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "📚 Documentation: README.md"
