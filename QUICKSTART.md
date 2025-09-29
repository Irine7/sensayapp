# 🚀 SensayApp Quick Start

## Automatic Setup (Recommended)

```bash
# Run setup script
./setup.sh
```

## Manual Setup

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Environment Variables Setup

```bash
# Copy example file
cp env.example .env

# Edit .env with your settings
nano .env  # or any other editor
```

### 3. Database Setup

```bash
# Generate Prisma client
pnpm prisma generate

# Apply database schema
pnpm prisma db push
```

### 4. Run Application

```bash
pnpm dev
```

## 🔑 Getting Sensay API Keys

1. Register at [sensay.io](https://sensay.io)
2. Create an organization
3. Create a user
4. Create a replica
5. Copy keys to `.env` file

## ✅ Setup Verification

After running `pnpm dev`:

- Open http://localhost:3000
- Select a replica in header dropdown
- Start chatting with AI

## 🆘 Having Issues?

- **Database error**: Check `DATABASE_URL` in `.env`
- **Sensay API error**: Check API keys
- **Port busy**: Use `pnpm dev -p 3001`

Detailed documentation: [README.md](README.md)
