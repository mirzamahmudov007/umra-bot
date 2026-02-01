# 🕋 Umra API - To'liq Yo'riqnoma

## 🎯 **API Endpoints:**

### **1. Umra Chiptasi Sotib Olish**
```
POST /api/umra/purchase
```

**Request Body:**
```json
{
  "telegramId": "7613155545",
  "purchaseId": "umra_12345",
  "amount": 1500
}
```

**Response:**
```json
{
  "success": true,
  "message": "Umra chiptasi sotib olish muvaffaqiyatli qayd etildi",
  "data": {
    "userId": "user_123",
    "referrerId": "referrer_456",
    "purchaseId": "umra_12345",
    "amount": 1500
  }
}
```

### **2. Umra Chiptasi Sotib Olganlar Ro'yxati**
```
POST /api/umra/check-purchases
```

**Response:**
```json
{
  "success": true,
  "message": "Umra chiptasi sotib olganlar ro'yxati",
  "data": [
    {
      "userId": "user_123",
      "referrerId": "referrer_456",
      "qualifiedAt": "2024-01-15T10:30:00Z",
      "leadName": "Ali Valiyev",
      "referrerName": "Akbar Botirov"
    }
  ]
}
```

## 🔄 **Ishlash Tartibi:**

### **1. Sotib Olish Jarayoni:**
1. **Foydalanuvchi** umra chiptasini sotib oladi
2. **Tashqi API** `/api/umra/purchase` ga request yuboradi
3. **Bot** referrerni topadi
4. **Lead statusi** `QUALIFIED` ga o'zgaradi
5. **Referrerga** +5 ball qo'shiladi
6. **Referrerga** xabar yuboriladi

### **2. Statistika Olish:**
1. **Admin** `/api/umra/check-purchases` ga request yuboradi
2. **Bot** barcha `QUALIFIED` leadlarni qaytaradi
3. **Ro'yxatda** kimlar umraga yuborilgani ko'rinadi

## 🎁 **Bonus Tizimi:**

| Amal | Bonus |
|------|-------|
| Oddiy taklif | +1 ball |
| Toza lead (umra chiptasi) | +5 ball |

## 📊 **Bot Statistikasi:**

```
📊 SIZNING STATISTIKANGIZ

👤 Ism: Mirzamahmudov G'ayratjon
🔗 Referral kodingiz: NRvxECvFd2

📈 STATISTIKA:
• Jami takliflar: 15
• Toza leadlar: 3
• Sizning referrallaringiz: 15

🎁 Bonuslar:
• Har bir taklif: +1 ball
• Toza lead (umra chiptasi): +5 ball
```

## 🔧 **Integration Qilish:**

### **JavaScript Example:**
```javascript
// Umra chiptasi sotib olish
async function handleUmraPurchase(telegramId, purchaseId, amount) {
  try {
    const response = await fetch('http://localhost:3000/api/umra/purchase', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        telegramId,
        purchaseId,
        amount
      })
    });
    
    const result = await response.json();
    console.log('Result:', result);
    return result;
  } catch (error) {
    console.error('Error:', error);
  }
}

// Foydalanish
handleUmraPurchase('7613155545', 'umra_12345', 1500);
```

### **Python Example:**
```python
import requests
import json

def handle_umra_purchase(telegram_id, purchase_id, amount):
    url = 'http://localhost:3000/api/umra/purchase'
    data = {
        'telegramId': telegram_id,
        'purchaseId': purchase_id,
        'amount': amount
    }
    
    try:
        response = requests.post(url, json=data)
        result = response.json()
        print('Result:', result)
        return result
    except Exception as e:
        print('Error:', e)

# Foydalanish
handle_umra_purchase('7613155545', 'umra_12345', 1500)
```

## 🎯 **Toza Lead Tizimi:**

### **Qachon Toza Lead Bo'ladi?**
- Foydalanuvchi umra chiptasini sotib olganda
- API orqali sotib olish muvaffaqiyatli qayd etilganda
- Lead statusi `QUALIFIED` ga o'zgarganda

### **Referrer Qanday Bonus Oladi?**
- Har bir toza lead uchun +5 ball
- Ball avtomatik qo'shiladi
- Xabar yuboriladi

### **Admin Qanday Tekshiradi?**
- `/api/umra/check-purchases` orqali
- Barcha umra chiptasi sotib olganlar ro'yxati
- Kim qachon sotib olgani ko'rinadi

## 🚀 **Server Manzili:**

- **Local:** `http://localhost:3000`
- **Production:** `https://your-domain.com`

## 📱 **Bot Komandalari:**

- `/start` - Botni boshlash
- `🔗 Referral Link Yaratish` - Link olish
- `📊 Statistika` - Statistikani ko'rish
- `📢 Kanalga A'zo Bo'lish` - Kanalga kirish

## 🎉 **Natija:**

Endi sizda:
- ✅ **Toza lead tizimi** - umra chiptasi sotib olganlar
- ✅ **API integration** - tashqi tizimlar bilan ulash
- ✅ **Bonus tizimi** - toza lead uchun +5 ball
- ✅ **Statistika** - kimlar umraga yuborilgani
- ✅ **Soddalashtirilgan bot** - faqat kerakli ma'lumotlar

**🕋 Umra referral system to'liq tayyor!**
