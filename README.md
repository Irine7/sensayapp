# SensayApp - AI Chat Application

A chat application with AI replicas built on the Sensay AI platform, constructed with Next.js 15 and React 19.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- PostgreSQL database
- Sensay AI account

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/Irine7/sensayapp
cd sensayapp

# Install dependencies
pnpm install
```

### 2. ENV Setup

```bash
# Create .env file
cp env.example .env

# Edit .env file with your settings
```

Add to `.env`:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/sensayapp"

# Sensay API settings
SENSAY_API_KEY="your-sensay-api-key"
SENSAY_ORG_ID="your-organization-id"
SENSAY_USER_ID="your-user-id"
SENSAY_REPLICA_UUID="your-default-replica-uuid"

# Public variables (available in browser)
NEXT_PUBLIC_SENSAY_API_KEY="your-sensay-api-key"
NEXT_PUBLIC_SENSAY_USER_ID="your-user-id"
NEXT_PUBLIC_SENSAY_ORG_ID="your-organization-id"
NEXT_PUBLIC_SENSAY_REPLICA_UUID="your-default-replica-uuid"
```

### 3. Run Application

```bash
# Development mode
pnpm dev

# Production build
pnpm build
pnpm start
```

Application will be available at: http://localhost:3000

## 📁 Project Structure

```
sensayapp/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   └── sensay/        # Sensay API integration
│   ├── lib/               # Utilities and API clients
│   └── page.tsx           # Main page
├── components/            # React components
│   ├── ui/               # UI components (shadcn/ui)
│   ├── chat-interface.tsx # Chat interface
│   └── replica-*.tsx     # Replica management components
├── prisma/               # Prisma schema and migrations
├── sensay-sdk/           # Sensay SDK
└── public/               # Static files
```

## 🔧 Main Commands

```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Build application
pnpm start            # Start production server
pnpm lint             # Code linting

# Database
pnpm prisma generate  # Generate Prisma client
pnpm prisma db push   # Apply schema changes
pnpm prisma studio    # Open Prisma Studio
```

## 🎯 Key Features

### Chat with AI Replicas

- Interactive chat interface with Markdown support
- Replica selection via global dropdown
- Chat history saved in localStorage
- Export chats to JSON

### Replica Management

- Create and configure AI replicas
- Upload training data
- Performance monitoring

### Chat History

- View all chats by replicas
- Search and filter messages
- Debug information for API calls

## 🔑 Sensay API Setup

1. **Create account** at [sensay.io](https://sensay.io)
2. **Create organization** or join existing one
3. **Create user** in your organization
4. **Get credentials**:
   - API key (Organization Secret)
   - Organization ID
   - User ID
5. **Create replica** and get its UUID

## 🗄️ Database

The application uses PostgreSQL with Prisma ORM. Main models:

- `ApiSettings` - API settings for different replicas
- `ChatSession` - chat sessions
- `ChatMessage` - chat messages
- `Replica` - AI replicas
- `Validation` - replica validation

## 🎨 UI Components

Uses shadcn/ui with Tailwind CSS:

- Modern design
- Dark/light theme
- Responsive layout
- Framer Motion animations

## 🚨 Troubleshooting

### Sensay API Issues

1. Check API keys correctness in `.env`
2. Ensure you're using the correct authentication method
3. Check API version (2025-03-25)
4. Use debug routes for testing

### Database Issues

1. Ensure PostgreSQL is running
2. Check connection string in `DATABASE_URL`
3. Run `pnpm prisma db push` to apply schema

### Dependencies Issues

1. Delete `node_modules` and `pnpm-lock.yaml`
2. Run `pnpm install`
3. Check Node.js version (requires 18+)

## 📝 Additional Information

- **TypeScript**: Full type safety
- **ESLint**: Configured for Next.js
- **Prettier**: Code formatting
- **Hot Reload**: Fast development

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Create a Pull Request

## 📄 License

MIT License - see LICENSE file for details.
