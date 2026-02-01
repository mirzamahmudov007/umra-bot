# Umra Bot - NestJS + Prisma + Telegraf

Complete referral bot with admin panel for managing leads.

## Features

- **BotUser model** with referral system
- **Lead flow** (NEW → QUALIFIED) 
- **Admin API** with search/pagination and qualify functionality
- **JWT admin authentication**
- **Telegram bot** with referral link generation

## Setup

### 1. Environment Variables

Update `.env` file with your actual values:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/umra_bot?schema=public"
BOT_TOKEN="YOUR_ACTUAL_TELEGRAM_BOT_TOKEN"
JWT_SECRET="your_super_secret_key"
ADMIN_EMAIL="admin"
ADMIN_PASSWORD="admin123"
```

### 2. Database Setup

```bash
# Generate Prisma client
npm run prisma:generate

# Run database migration
npm run prisma:migrate --name init
```

### 3. Start the Application

```bash
# Development (with real BOT_TOKEN in .env)
npm run start:dev

# Production
npm run build
npm run start:prod
```

**Note**: The app will start successfully but the Telegram bot will show a 404 error until you set a real `BOT_TOKEN` in your `.env` file.

## API Endpoints

### Admin Authentication

```bash
# Login
curl -X POST http://localhost:3000/auth/login \
  -H "content-type: application/json" \
  -d '{"email":"admin","password":"admin123"}'
```

### Lead Management

```bash
# Get leads (requires JWT token)
curl "http://localhost:3000/admin/leads?search=&page=1&limit=20" \
  -H "authorization: Bearer YOUR_JWT_TOKEN"

# Qualify a lead
curl -X POST http://localhost:3000/admin/leads/LEAD_ID/qualify \
  -H "authorization: Bearer YOUR_JWT_TOKEN"
```

## Bot Commands

- `/start` - Start bot and get referral link
- `/start REF_CODE` - Join using referral code

## Project Structure

```
src/
├── app.module.ts          # Main app module
├── main.ts                # Application entry point
├── prisma/                # Prisma database service
│   ├── prisma.module.ts
│   └── prisma.service.ts
├── auth/                  # Authentication
│   ├── auth.module.ts
│   ├── auth.service.ts
│   ├── auth.controller.ts
│   └── jwt.guard.ts
├── users/                 # User management
│   ├── users.module.ts
│   └── users.service.ts
├── leads/                 # Lead management
│   ├── leads.module.ts
│   ├── leads.service.ts
│   ├── admin-leads.controller.ts
│   └── dto.ts
├── bot/                   # Telegram bot
│   ├── bot.module.ts
│   ├── bot.service.ts
│   └── bot.update.ts
└── utils/                 # Utilities
    └── refcode.ts
```

## Database Schema

- **BotUser**: User information with referral codes and statistics
- **Lead**: Referral relationships with qualification status

## Development Notes

- Bot runs in polling mode by default
- For production, consider switching to webhook mode
- Admin credentials are configurable via environment variables
- All database operations use transactions for data consistency
