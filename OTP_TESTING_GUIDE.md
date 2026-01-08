# OTP Testing Guide

## Issue: "OTP expired or invalid"

### Common Causes:
1. **Server restart** - In development, server restarts clear the in-memory OTP store
2. **Wrong mobile number** - Mobile number format mismatch
3. **Actual expiry** - OTP expired (now set to 30 minutes)

---

## ✅ **SOLUTION: How to Test OTP**

### **Step 1: Start Server (DON'T RESTART)**
```bash
npm run dev
```

**IMPORTANT:** ⚠️ **Keep this terminal window open and DON'T restart the server until OTP is verified!**

---

### **Step 2: Open Browser**
```
http://localhost:3000
```

---

### **Step 3: Register New User**

1. Click **"Register"**
2. Choose **"Customer"** (easiest to test)
3. Fill the form:
   - First Name: Test
   - Last Name: User
   - Gender: Male
   - **Mobile: 9876543210** (remember this!)
   - Email: test@example.com
4. Click **"Continue"**

---

### **Step 4: Check Terminal for OTP**

You'll see output like this:
```
🔐 REGISTRATION OTP for 9876543210: 123456
📱 Valid for 30 minutes
```

**Copy the OTP: 123456**

---

### **Step 5: Enter OTP (QUICKLY!)**

1. In browser, enter the OTP: **123456**
2. Click **"Verify"**

**If you see debugging output:**
```
🔍 Verifying OTP for mobile: 9876543210
✅ OTP found in store
📅 Expires at: ...
⏰ Current time: ...
🔢 Stored OTP: 123456, Provided OTP: 123456
✅ OTP verified successfully!
```

**Success!** ✅ User created in database!

---

## 🐛 Debugging Issues

### Issue: "No OTP found in store"

**Terminal shows:**
```
❌ No OTP found in store for: 9876543210
```

**Causes:**
1. Server restarted after sending OTP
2. Wrong mobile number

**Solution:**
- **Don't restart server!**
- Keep terminal open
- Send OTP and verify in one go (within 30 minutes)

---

### Issue: "OTP mismatch"

**Terminal shows:**
```
🔢 Stored OTP: 123456, Provided OTP: 654321
❌ OTP mismatch
```

**Solution:**
- Copy OTP correctly from terminal
- Check for extra spaces

---

### Issue: "OTP expired"

**Terminal shows:**
```
❌ OTP expired
```

**Solution:**
- Request new OTP
- OTP valid for 30 minutes now

---

## 💡 Pro Tips

### **Tip 1: Keep Terminal Visible**
Keep terminal window next to browser so you can see OTP immediately.

### **Tip 2: Don't Save Files**
If you save files in `src/app/api/`, Next.js will restart the server and clear OTP store!

### **Tip 3: Test Complete Flow**
Do entire registration flow without interruption:
1. Start server
2. Fill form
3. Get OTP from terminal
4. Enter OTP
5. Done!

### **Tip 4: Use Browser Console**
The API also returns OTP in development mode. Check browser console (F12) → Network tab → Response.

---

## 🔄 If OTP Still Fails

### Option 1: Use Fixed OTP for Testing

Edit `src/lib/utils/otpStore.ts` line 42:

```typescript
// Generate OTP
generateOTP(): string {
  // return Math.floor(100000 + Math.random() * 900000).toString();
  return '123456'; // Fixed OTP for testing
}
```

Now OTP will always be **123456** for testing.

### Option 2: Use Database for OTP Storage

Instead of in-memory, store OTP in Supabase table (more reliable but slower).

### Option 3: Disable OTP for Testing

Create a test route that bypasses OTP verification.

---

## ✅ Expected Flow

```
1. User fills registration form
   ↓
2. Click "Continue to Verification"
   ↓
3. Server generates OTP: 123456
   ↓
4. Terminal shows: 🔐 REGISTRATION OTP for 9876543210: 123456
   ↓
5. User enters OTP in browser
   ↓
6. Server verifies OTP
   ↓
7. Terminal shows: ✅ OTP verified successfully!
   ↓
8. User created in Supabase database
   ↓
9. User logged in and redirected to homepage
```

---

## 🚀 Quick Test Command

Run this test flow:

```bash
# 1. Start server
npm run dev

# 2. In browser:
# - Register with mobile: 9876543210
# - Get OTP from terminal
# - Enter OTP immediately
# - Success!
```

---

## 📝 Notes

- **OTP validity:** 30 minutes (was 10 minutes before)
- **Storage:** In-memory (clears on server restart)
- **Development mode:** OTP shown in terminal
- **Production:** Will send real SMS via Twilio/MSG91

---

**Happy Testing!** 🎉
