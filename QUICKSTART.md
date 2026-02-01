# UMRA BOT - TEZKOR BOSHLANG'ICH KO'RSATMASI

## 5 DAQIQA ICHIDA BOSHLANG'ICH

### 1. ENVIRONMENT VARIABLES OLISH (5 min)

**Telegram Bot Token:**
```
https://t.me/BotFather ga boring → /newbot → token copy
```

**Database (Neon):**
```
https://console.neon.tech → New project → CONNECTION STRING copy
```

**Channel ID:**
```
@userinfobot → channel-ga /start → ID copy (-1001234567890 ko'rinishida)
```

### 2. .ENV FAYLI YARATISH

`.env.example` ni `.env` qilng:
```bash
cp .env.example .env
```

`.env` faylga quyidagilarni to'ldiring:

```env
# TALAB QILINADI
DATABASE_URL="postgresql://user:pass@host:5432/db"
BOT_TOKEN="123456789:ABCDEFGHIJKLMNOPQRSTUVWXYZ"
BOT_USERNAME="your_bot_username"
CHANNEL_USERNAME="your_channel"
GROUP_CHAT_ID="-1001234567890"

# Security (o'zgartirib qo'ying)
JWT_SECRET="your_random_secret_key"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="strong_password"
```

### 3. DEPENDENCIES O'RNATISH

```bash
pnpm install
```

### 4. DATABASE SETUP

```bash
npx prisma migrate dev --name init
```

### 5. BOT ISHGA TUSHIRISH

```bash
pnpm run dev
```

---

## ADMIN PANELGA KIRISH

**URL:** `http://localhost:3000/auth/login`

**Login:**
```
Email: admin@example.com
Password: (siz .env-da kiritgan parol)
```

Kirgandan so'ng:
1. `/admin/leads` ga boring
2. Lead-larni ko'ring
3. QUALIFIED qiling → +5 ball beriladi

---

## TELEGRAM BOTNI TEKSHIRISH

**Botga yozish:**
```
/start → Menu ko'rinadi
/help → Ko'rsatmalar
/me → Sizning profil
/share → Referral link
```

---

## ADMIN STATISTIKASI

```
GET /admin/leads/stats
GET /admin/leads/top-referrers?limit=10
```

---

## PRODUCTION DEPLOYMENT

### Vercel-ga Deploy

```bash
git push origin main
```

Vercel avtomatik deploy qiladi.

### Environment Variables Qo'shish

Vercel dashboard → Settings → Environment Variables:
- DATABASE_URL
- BOT_TOKEN
- BOT_USERNAME
- CHANNEL_USERNAME
- GROUP_CHAT_ID
- JWT_SECRET
- ADMIN_EMAIL
- ADMIN_PASSWORD

---

## MUAMMOLARNI YECHISH

| Muammo | Yechimi |
|--------|--------|
| Bot xabar yubormiayotgan | BOT_TOKEN valid ekanligini tekshiring |
| Database connection xatosi | DATABASE_URL to'g'ri ekanligini tekshiring |
| Login qilib bo'lmiayotgan | ADMIN_EMAIL/PASSWORD to'g'ri ekanligini tekshiring |
| Group ID xatosi | GROUP_CHAT_ID negative bo'lishi kerak (-1001234567890) |

---

## Ball Tizimi

- Taklif: +1 ball
- Toza Lead: +5 ball
- Maqsad: 100 ball = Bepul Umra

---

## Qo'shimcha Hujjat

- `/SETUP.md` - To'liq setup ko'rsatmasi
- `/SECURITY.md` - Security va production guide
- `/README.md` - Loyiha haqida ma'lumot

---

**Tayyor! Bot ishga tushurilgan!** 🚀
