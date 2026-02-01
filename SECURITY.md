# Umra Bot - Security va Environment Setup

## Environment Variables Ro'yxati

### TALAB QILINADI - Production uchun

```env
# Database
DATABASE_URL="postgresql://user:pass@host:5432/db"

# Telegram Bot
BOT_TOKEN="your_real_bot_token"
BOT_USERNAME="your_bot_username"
CHANNEL_USERNAME="your_channel"
GROUP_CHAT_ID="-1001234567890"

# Security
JWT_SECRET="generate_random_secret_key"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="strong_password"

# Environment
NODE_ENV="production"
DEBUG_MODE="false"
```

## Security Best Practices

### 1. JWT_SECRET Yaratish

Kuchli va noyob JWT_SECRET yaratish uchun:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Natija:
```
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f
```

Shu string-ni .env faylga qo'ying:
```env
JWT_SECRET="a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f"
```

### 2. Admin Parolini O'rnatish

```env
ADMIN_EMAIL="your_email@example.com"
ADMIN_PASSWORD="SuperStrongPassword123!@#"
```

### 3. Telegram Bot Token Olanish

1. https://t.me/BotFather ga boring
2. `/newbot` buyrug'ini yuboring
3. Bot nomini kiriting (masalan: "Umra Bot")
4. Bot username-ni kiriting (masalan: "umra_bot_123")
5. Token-ni olgan bo'lsangiz, quyidagiga o'xshaydi:
   ```
   1234567890:ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefgh
   ```

.env faylga qo'ying:
```env
BOT_TOKEN="1234567890:ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefgh"
BOT_USERNAME="umra_bot_123"
```

### 4. Channel/Group ID Olanish

Channel yoki Group-ni Telegram-da yarating (masalan: @ochiqkanal11)

Bot-ni administrator qilib qo'ying:
1. Channel Settings → Administrators
2. Bot-ni add qiling

ID olish uchun:
1. @userinfobot-ga boring
2. Channel-ga /start yuboring
3. Group ID-ni ko'rish mumkin (negative bo'ladi)

Masalan: `-1001234567890`

.env faylga qo'ying:
```env
GROUP_CHAT_ID="-1001234567890"
CHANNEL_USERNAME="ochiqkanal11"
```

### 5. Database URL

#### Neon (Tavsiya qilinadi - FREE)
1. https://console.neon.tech ga boring
2. Account yarating
3. New project qilng
4. Connection string oling (URL formatda)
5. .env faylga qo'ying:
```env
DATABASE_URL="postgresql://user:password@host.neon.tech:5432/database?sslmode=require"
```

#### Vercel Postgres
1. Vercel dashboard-ga boring
2. Postgres qo'shish
3. Connection string oling
4. .env faylga qo'ying

#### Local PostgreSQL
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/umra_bot"
```

## Production Deployment

### 1. Environment Variables Tekshiring

```bash
# .env faylga kiritilganlari tekshiring
echo $DATABASE_URL
echo $BOT_TOKEN
echo $JWT_SECRET
```

### 2. Database Migration

```bash
npx prisma migrate deploy
```

### 3. Bot-ni Ishga Tushiring

```bash
NODE_ENV=production node dist/main.js
```

### 4. Process Manager (PM2)

```bash
npm install -g pm2

pm2 start dist/main.js --name "umra-bot"
pm2 save
pm2 startup
```

## Security Tekshirish Ro'yxati

- [ ] JWT_SECRET kuchli va 32+ character
- [ ] ADMIN_PASSWORD 8+ character, mix case, numbers, symbols
- [ ] DATABASE_URL to'g'ri va secure connection
- [ ] BOT_TOKEN hech kimga ko'rsatilmagan
- [ ] GROUP_CHAT_ID negative va to'g'ri
- [ ] NODE_ENV=production production-da
- [ ] DEBUG_MODE=false production-da
- [ ] SSL certificate configured (if using HTTPS)

## API Endpoints

### Admin Login
```
POST /auth/login
{
  "email": "admin@example.com",
  "password": "your_password"
}

Response:
{
  "access_token": "jwt_token_here"
}
```

### Admin Leads
```
GET /admin/leads?page=1&limit=20
GET /admin/leads?status=PENDING
GET /admin/leads?search=username

Header: Authorization: Bearer {token}
```

### Stats
```
GET /admin/leads/stats
GET /admin/leads/top-referrers?limit=10

Header: Authorization: Bearer {token}
```

### Qualify Lead
```
POST /admin/leads/{id}/qualify

Header: Authorization: Bearer {token}
```

## Muammolarni Yechish

### "Authentication failed" xatosi
- JWT_SECRET to'g'ri ekanligini tekshiring
- Token expiration time-ini tekshiring
- Admin email/password to'g'ri ekanligini tekshiring

### "Connection timeout" xatosi
- Database server ishlayotganligini tekshiring
- DATABASE_URL to'g'ri ekanligini tekshiring
- Firewall settings tekshiring

### Bot xabar yubormiayotgan
- BOT_TOKEN valid ekanligini tekshiring
- Bot telegram-da active bo'lishi kerak
- GROUP_CHAT_ID to'g'ri va bot administrator bo'lishi kerak

## Regular Maintenance

1. **Weekly**: Database backup
2. **Monthly**: Update dependencies (`npm update`)
3. **Monthly**: Rotate JWT_SECRET (optional)
4. **Quarterly**: Security audit

---

Qo'shimcha savol bo'lsa, admin-ga murojaat qiling.
