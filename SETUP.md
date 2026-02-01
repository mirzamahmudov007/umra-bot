# Umra Bot - Sozlash va Ishga Tushirish

## Talab Qilinuvchi Ma'lumot

Botni ishga tushirish uchun quyidagi ma'lumotlar kerak:

### 1. Telegram Bot Token
- https://t.me/BotFather ga boring
- `/start` dan so'ng `/newbot` buyrug'ini yuboring
- Bot nomini va username-ni kiriting
- Token-ni olgan bo'lsangiz, `.env` faylga qo'ying

### 2. Database (PostgreSQL)
- Neon, Vercel Postgres yoki o'z server-ingizni ishlatish mumkin
- `DATABASE_URL` ni olgan bo'lsangiz, `.env` faylga qo'ying

### 3. Telegram Channel/Group ID
- Channel-ni yarating (masalan: @ochiqkanal11)
- Bot-ni channel administratiri qilib qo'ying
- Channel-ning ID-ni olish uchun `@userinfobot`-da channel-ga `/start` yuboring
- ID-ni `.env` faylga qo'ying

## O'tkazma Qadamlar

### 1. Environment Variables Sozlash

`.env.example` faylni `.env` fayli sifatida nusxa olgan

```bash
cp .env.example .env
```

### 2. `.env` faylida quyidagi o'zgaruvchilarni to'ldiring:

```env
# Database - TALAB QILINADI
DATABASE_URL="postgresql://username:password@host:port/database_name"

# Telegram Bot - TALAB QILINADI
BOT_TOKEN="123456789:ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefgh"
BOT_USERNAME="your_bot_username"  # @symbol ishlitmasdan
CHANNEL_USERNAME="ochiqkanal11"
GROUP_CHAT_ID="-1001234567890"  # Negative bo'lishi kerak

# Admin Panel - TALAB QILINADI (production uchun o'zgartiring)
JWT_SECRET="change_this_in_production_very_secret_key"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="secure_password"

# Environment
NODE_ENV="development"  # production uchun "production"
DEBUG_MODE="false"
```

### 3. Dependencies O'rnatish

```bash
pnpm install
```

### 4. Database Migration

```bash
npx prisma migrate dev --name init
```

### 5. Bot-ni Ishga Tushirish

```bash
pnpm run dev
```

## Ball Tizimi Qoida

- **Taklif qilish**: Har bir yangi foydalanuvchi = **+1 ball**
  - Foydalanuvchi referral link orqali botga kirganda ball qo'shilib qoladi
  
- **Toza Lead**: Umra chiptasini sotib olganda = **+5 ball**
  - Admin panelida lead-ni QUALIFIED qilganda

- **Maqsad**: 100 ball to'laganida **BEPUL UMRA SAYOHATI**

## Admin Panel Logini

```
Email: admin@example.com (o'z email-ingiz)
Password: secure_password (.env da siz o'rnatgan parol)
```

Admin panelga kirgandan so'ng:
1. `Leads` bo'limida barcha foydalanuvchilarni ko'ring
2. Toza lead-larni "QUALIFIED" qilib belgilang
3. Foydalanuvchi 100 ballga yetgan bo'lsa uni tanlang

## Muammo Yechish

### "BOT_TOKEN is not set" xatosi
- `.env` fayli mavjudligini tekshiring
- BOT_TOKEN qiymati kiritilganligini tekshiring

### "DATABASE_URL is not set" xatosi
- `.env` faylda DATABASE_URL o'rnatilganligini tekshiring
- Database server ishlayotganligini tekshiring

### Bot xabar yubormiayotgan bo'lsa
- Bot tokenni qayta tekshiring (valid bo'lishi kerak)
- Group/Channel ID to'g'ri kiritilganligini tekshiring
- Bot administrtor bo'lishini tekshiring

## Production Uchun Tavsiyalar

1. JWT_SECRET-ni o'zgartiring (randome string)
2. Admin parolini o'z kuchli parol bilan o'zgartiring
3. NODE_ENV="production" qiling
4. Database backup olamiz
5. HTTPS-ni sozlang

---

Qo'shimcha savol bo'lsa, admin-ga murojaat qiling.
