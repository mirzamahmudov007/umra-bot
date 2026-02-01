# 🎉 Referral System To'liq Tayyor!

## ✅ Yangi Imkoniyatlar:

### 🔗 **Referral Link Turlari:**

1. **Oddiy referral link:**
   ```
   https://t.me/rmlmsbot?start=ABCD1234
   ```

2. **Guruhga taklif linki:**
   ```
   https://t.me/rmlmsbot?start=ABCD1234&group=true
   ```

### 🎁 **Bonus Tizimi:**

- **Har bir lead:** +10 ball
- **Guruhga taklif:** +5 ball  
- **Qualified lead:** +20 ball

### 📱 **Bot Xususiyatlari:**

✅ **Personal referral link** - har bir foydalanuvchi o'ziga xos kodga ega
✅ **Guruhga taklif** - alohida bonus bilan
✅ **Real-time statistika** - leadlar va qualified leadlar soni
✅ **Markdown format** - chiroyli xabarlar
✅ **Referrerga xabar** - yangi lead qo'shilganda bildirishnoma

### ⚙️ **Environment Variables:**

```env
# Bot konfiguratsiyasi
BOT_USERNAME="rmlmsbot"
BOT_NAME="RMLMS Bot"

# Guruh konfiguratsiyasi  
GROUP_CHAT_ID="-1001234567890"
GROUP_WELCOME_MESSAGE="Assalomu alaykum! Guruhga xush kelibsiz! 🎉"
GROUP_REFERRAL_BONUS="5"

# Bonus tizimi
REFERRAL_BONUS_POINTS="10"
MIN_LEADS_FOR_BONUS="3"
QUALIFIED_LEAD_BONUS="20"
```

### 🚀 **Ishga Tushirish:**

1. **.env ni to'g'rilang:**
   - `GROUP_CHAT_ID` - haqiqiy guruh ID sini kiriting
   - `BOT_USERNAME` - bot username ni kiriting

2. **Botni ishga tushuring:**
   ```bash
   npm run start:dev
   ```

### 📊 **Admin Panel:**

- **Lead management** - barcha leadlarni ko'rish, qualify qilish
- **Search & pagination** - qulay qidiruv
- **JWT authentication** - xavfsizlik

### 🎯 **Foydalanuvchi Tajribasi:**

1. Botga kiradi → personal referral link oladi
2. Link orqali do'stlarini taklif qiladi
3. Guruhga taklif qilish uchun `&group=true` parametri qo'shiladi
4. Har bir yangi lead uchun bonus oladi
5. Referrerga bildirishnoma keladi

**🎉 Sistema to'liq ishga tayyor!**
