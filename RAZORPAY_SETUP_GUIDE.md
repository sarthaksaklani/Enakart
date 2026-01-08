# 🔐 Razorpay Complete Setup Guide

**Goal:** Payment gateway setup for your optical store
**Time:** 10-15 minutes
**Mode:** Test mode (for development)

---

## 📋 Step 1: Create Razorpay Account

### 1.1 Visit Razorpay Dashboard
```
https://dashboard.razorpay.com/signup
```

### 1.2 Sign Up Options
Choose any one:
- **Email + Password** (easiest)
- Google Account
- LinkedIn Account

**Fill Details:**
```
✅ Email: your-email@gmail.com
✅ Create Password
✅ Mobile Number: +91-XXXXXXXXXX
✅ Business Name: एnakart Optical Store (or your store name)
```

### 1.3 Verify Email & Mobile
- Check email for verification link → Click it
- Check SMS for OTP → Enter it
- ✅ Account Created!

---

## 🔑 Step 2: Get Test API Keys

### 2.1 Login to Dashboard
```
https://dashboard.razorpay.com/
```

### 2.2 Navigate to API Keys
```
Dashboard → Settings (left sidebar) → API Keys
```

You'll see two modes:
- 🧪 **Test Mode** (for development) ← Use this now
- 🟢 **Live Mode** (for production) ← Use later after testing

### 2.3 Generate Test Keys

**If keys already exist:**
- You'll see: `Key ID` and `Key Secret`
- Click "Regenerate Test Key" if needed

**If no keys exist:**
- Click **"Generate Test Key"** button
- Keys will be generated instantly

### 2.4 Copy Your Keys

You'll get TWO keys:

**1. Test Key ID** (Public - safe to expose)
```
Format: rzp_test_XXXXXXXXXXXX
Example: rzp_test_1DP5mmOlF5G5ag
```

**2. Test Key Secret** (Private - NEVER expose publicly)
```
Format: XXXXXXXXXXXXXXXXXXXXXXXX
Example: aB1cD2eF3gH4iJ5kL6mN7oP8
```

⚠️ **IMPORTANT:** Key Secret will be shown ONLY ONCE!
- Copy it immediately
- Store it safely
- If lost, regenerate new keys

---

## 🔧 Step 3: Add Keys to Your Project

### 3.1 Open .env.local File
```bash
# In your project root folder
nano .env.local
# or open with any text editor
```

### 3.2 Add Razorpay Keys

Replace the empty values:

**BEFORE:**
```env
NEXT_PUBLIC_RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
```

**AFTER:**
```env
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_1DP5mmOlF5G5ag
RAZORPAY_KEY_SECRET=aB1cD2eF3gH4iJ5kL6mN7oP8
```

Replace with YOUR actual keys! ☝️

### 3.3 Save File
```bash
# Press Ctrl+S (or Cmd+S on Mac)
# Make sure file is saved!
```

---

## ✅ Step 4: Verify Setup

### 4.1 Restart Dev Server

**Kill current server:**
```bash
# Press Ctrl+C in terminal where npm run dev is running
```

**Start again:**
```bash
npm run dev
```

### 4.2 Check Keys Loaded

Open browser console:
```javascript
// Should show your key ID (NOT secret!)
console.log(process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID)
// Output: rzp_test_XXXXXXXXXXXX
```

---

## 🧪 Step 5: Test Payments (Test Mode)

### 5.1 Test Card Details

Razorpay provides test cards that ALWAYS succeed:

**✅ Successful Payment Test Card:**
```
Card Number: 4111 1111 1111 1111
CVV: 123
Expiry: Any future date (e.g., 12/25)
Name: Any name
```

**❌ Failed Payment Test Card:**
```
Card Number: 4000 0000 0000 0002
CVV: 123
Expiry: Any future date
```

### 5.2 Test UPI

**Test UPI ID:**
```
success@razorpay
```

### 5.3 Test Netbanking

Select any bank → Use test credentials:
```
Username: razorpay
Password: razorpay
```

---

## 💳 Step 6: Test Your Checkout Flow

### 6.1 Complete Purchase Flow

1. **Login to your app**
   ```
   http://localhost:3000/account
   ```

2. **Add product to cart**
   ```
   Browse → Select Product → Add to Cart
   ```

3. **Go to checkout**
   ```
   Cart → Proceed to Checkout
   ```

4. **Enter address**
   ```
   Fill shipping address form → Continue
   ```

5. **Place Order**
   ```
   Review Order → Place Order button
   ```

6. **Razorpay Modal Opens** 🎉
   ```
   - You'll see Razorpay payment modal
   - Select "Card" payment method
   - Enter test card: 4111 1111 1111 1111
   - CVV: 123
   - Expiry: 12/25
   - Click "Pay"
   ```

7. **Payment Success!** ✅
   ```
   - Modal closes
   - Redirects to order confirmation
   - Cart is cleared
   - Order saved in database
   ```

### 6.2 Check Payment in Dashboard

```
Razorpay Dashboard → Transactions → Payments
```

You'll see your test payment:
- Amount: ₹XXX
- Status: ✅ Captured
- Order ID: Your order number
- Payment ID: pay_XXXXXXXXXXXX

---

## 🔍 Step 7: Debug Common Issues

### Issue 1: "Razorpay is not defined"
**Solution:**
```javascript
// Check if script is loaded
console.log(window.Razorpay) // Should show [Function]

// If undefined, refresh page
// Script loads on checkout page mount
```

### Issue 2: "Invalid Key ID"
**Solutions:**
- ✅ Check .env.local has correct key
- ✅ Restart dev server (npm run dev)
- ✅ Key starts with `rzp_test_` for test mode
- ✅ No extra spaces in .env.local

### Issue 3: "Payment Failed"
**Solutions:**
- ✅ Use test card: 4111 1111 1111 1111
- ✅ Make sure you're in TEST mode (not live)
- ✅ Check Razorpay dashboard for error details

### Issue 4: Keys Not Loading
**Check:**
```bash
# In terminal
echo $NEXT_PUBLIC_RAZORPAY_KEY_ID
# Should show your key

# If empty, check .env.local file exists
ls -la .env.local
```

---

## 🚀 Step 8: Production Setup (Later)

### When to Switch to Live Mode?
- ✅ All testing complete
- ✅ Ready to accept real payments
- ✅ Business verified on Razorpay

### 8.1 Activate Live Mode

**Prerequisites:**
1. Complete KYC on Razorpay
   - Business details
   - Bank account
   - PAN card
   - GST (if applicable)

2. Activate account
   - Submit documents
   - Wait for approval (1-2 days)

### 8.2 Generate Live Keys

```
Dashboard → Settings → API Keys →
Toggle to "Live Mode" → Generate Live Key
```

### 8.3 Update Production .env

**Create .env.production:**
```env
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_XXXXXXXXXXXX
RAZORPAY_KEY_SECRET=your_live_secret_key
```

⚠️ **CRITICAL:**
- NEVER commit live keys to git
- Add .env.production to .gitignore
- Use environment variables in deployment (Vercel/Netlify)

---

## 📊 Payment Flow Summary

```
User clicks "Place Order"
    ↓
Your API creates order (/api/orders/create)
    ↓
Your API creates Razorpay order (/api/payment/create-order)
    ↓
Razorpay modal opens with payment options
    ↓
User enters card/UPI/netbanking details
    ↓
Razorpay processes payment
    ↓
Success → razorpay_payment_id returned
    ↓
Your API verifies payment (/api/payment/verify)
    ↓
Order status updated to "paid"
    ↓
Cart cleared
    ↓
User redirected to order success page
```

---

## 🎯 Quick Reference

### Test Mode Keys Location
```
Dashboard → Settings → API Keys → Test Mode
```

### Test Payment Methods
```
Card: 4111 1111 1111 1111 | CVV: 123
UPI: success@razorpay
Netbanking: razorpay/razorpay
```

### .env.local Format
```env
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_XXXX
RAZORPAY_KEY_SECRET=your_secret_XXXX
```

### Restart After Changes
```bash
# Kill server: Ctrl+C
npm run dev
```

---

## ✅ Checklist

Before testing, ensure:

- [ ] Razorpay account created
- [ ] Test API keys generated
- [ ] Keys added to .env.local
- [ ] Dev server restarted
- [ ] Test card details ready
- [ ] User can login to your app

---

## 🆘 Need Help?

### Razorpay Support
- Docs: https://razorpay.com/docs/
- Support: support@razorpay.com
- Community: https://razorpay.com/community/

### Common Razorpay Docs
- Test Cards: https://razorpay.com/docs/payments/payments/test-card-details/
- Checkout Integration: https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/

---

**Razorpay setup complete hone ke baad, payment testing shuru kar sakte ho!** 🎉
