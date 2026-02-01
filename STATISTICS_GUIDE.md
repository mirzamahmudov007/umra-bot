# 📊 Referral Statistikasi - To'liq Yo'riqnoma

## ✅ **Har bir userga unikal referral link yaratiladi!**

### 🔗 **Unikal Link Tizimi:**

Har bir foydalanuvchi o'ziga xos 10 belgidan iborat referral kodga ega:
```
https://t.me/rmlmsbot?start=ABCD1234EF
```

### 📱 **Bot Komandalari:**

#### **1. /stats - Shaxsiy statistika**
```
/stats
```
**Ko'rsatadi:**
- 👤 Foydalanuvchi ma'lumotlari
- 🔗 Shaxsiy referral kodi
- 📱 Telegram ID
- 🎯 Takliflar statistikasi
- 👥 Siz taklif qilganlar ro'yxati (10 ta)
- 🏆 Top 5 referrers

#### **2. /top - Umumiy reyting**
```
/top
```
**Ko'rsatadi:**
- 🏆 Top 10 referrers
- 📊 Jami leadlar va qualified leadlar
- 🥇🥈🥉 Medallar bilan bezatilgan

### 🎯 **Statistika Turlari:**

#### **Shaxsiy ma'lumotlar:**
- **Jami takliflar:** `leadsCount`
- **Qualified leadlar:** `qualifiedCount`
- **To'g'ridan-to'g'ri referrallar:** `referrals.length`

#### **Database orqali tracking:**
- **Har bir lead:** `Lead` jadvaliga yoziladi
- **Referrer ID:** `referredById` orqali bog'lanadi
- **Status tracking:** NEW → QUALIFIED

### 🔍 **Qanday ishlaydi:**

#### **1. Link generatsiya:**
```typescript
// Har bir user uchun unikal kod
const refCode = generateRefCode(10); // "ABCD1234EF"
const link = `https://t.me/rmlmsbot?start=${refCode}`;
```

#### **2. Taklif tracking:**
```typescript
// User taklif qilganda
await this.leads.createLeadIfNotExists({
  leadUserId: me.id,
  referrerUserId: referrer.id,
  // ... boshqa ma'lumotlar
});
```

#### **3. Statistika olish:**
```typescript
// Shaxsiy referrallar
const referrals = await this.users.findByReferrerId(user.id);

// Top referrers
const topReferrers = await this.users.getTopReferrers(10);
```

### 📊 **Admin Panel orqali:**

#### **API endpoint lar:**
```bash
# Barcha leadlar
GET /admin/leads?search=&page=1&limit=20

# Lead ni qualify qilish
POST /admin/leads/{leadId}/qualify
```

#### **Search imkoniyatlari:**
- 🔍 Ism bo'yicha
- 🔍 Username bo'yicha  
- 🔍 Telegram ID bo'yicha
- 🔍 Status bo'yicha (NEW/QUALIFIED)

### 🎁 **Bonus tizimi:**

- **Har bir lead:** +10 ball
- **Guruhga taklif:** +5 ball
- **Kanalga taklif:** +5 ball
- **Qualified lead:** +20 ball

### 🚀 **Real-time tracking:**

#### **Referrerga xabar:**
```
🎉 Yangi lead!
👤 Foydalanuvchi sizning referral linkingiz orqali ro'yxatdan o'tdi!
```

#### **Admin notification:**
- Lead yaratilganda database ga yoziladi
- Status o'zgarganda admin panel da ko'rinadi

### 📈 **Analytics imkoniyatlari:**

1. **Shaxsiy:** `/stats` komandasi
2. **Umumiy:** `/top` reytingi  
3. **Admin:** Web panel orqali
4. **Database:** To'liq SQL so'rovlari

### 🎯 **Foydalanuvchi tajribasi:**

1. **Botga kirish** → `/start`
2. **Link olish** → Shaxsiy referral kod
3. **Do'stlarni taklif** → Link ulashish
4. **Statistikani ko'rish** → `/stats`
5. **Reytingni ko'rish** → `/top`

**🎉 Har bir userning referral faoliyati to'liq tracking qilinadi!**
