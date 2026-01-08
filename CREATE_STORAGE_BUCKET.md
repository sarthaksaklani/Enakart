# 🚀 Supabase Storage Bucket Setup - Step by Step

## Quick Fix (5 minutes)

Follow these EXACT steps:

---

### **Step 1: Open Supabase Dashboard**

Click this link:
```
https://supabase.com/dashboard/project/wlhougvaibxgpooxwfyi/storage/buckets
```

(Ya manually: Dashboard → Your Project → Storage)

---

### **Step 2: Create New Bucket**

1. Click **"New Bucket"** button (top right, green button)

2. Fill the form:

   **Bucket Details:**
   ```
   Name: product-images

   Public bucket: ✅ (CHECK THIS BOX!)

   File size limit: 5 MB

   Allowed MIME types: image/* (leave empty for all)
   ```

3. Click **"Create Bucket"**

---

### **Step 3: Verify Bucket is Public**

After creating:

1. Click on **"product-images"** bucket
2. Click **"Settings"** tab (top)
3. Make sure **"Public bucket"** is ✅ **CHECKED**
4. If not checked, check it and save

---

### **Step 4: Set Policies (Important!)**

1. Go to **Storage** → **Policies** (left sidebar under Storage section)

2. You'll see **"product-images"** bucket

3. Click **"New Policy"** button

4. Click **"For full customization"**

5. Fill:
   ```
   Policy name: public-access

   Allowed operations:
   ✅ SELECT
   ✅ INSERT
   ✅ UPDATE
   ✅ DELETE

   Target roles: public, authenticated, anon, service_role

   USING expression: true
   WITH CHECK expression: true
   ```

6. Click **"Review"** → **"Save policy"**

---

### **Alternative: Quick Policy via SQL**

If above doesn't work, go to **SQL Editor** and run:

```sql
-- Allow public read access
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'product-images' );

-- Allow anyone to upload
CREATE POLICY "Public Upload"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'product-images' );

-- Allow service role full access
CREATE POLICY "Service Access"
ON storage.objects FOR ALL
TO service_role
USING ( bucket_id = 'product-images' );
```

---

### **Step 5: Test Upload**

Now try uploading again:

```bash
# Your server should already be running
# Go to: http://localhost:3000/seller/catalog/add
# Click "Upload from Computer"
# Select an image
# Should work now! ✅
```

---

## 🎯 Screenshots Guide

**Can't find something? Here's where everything is:**

1. **Storage Section:**
   - Left sidebar → "Storage" icon (looks like folder)

2. **New Bucket Button:**
   - Top right corner, green button with "+" icon

3. **Public Bucket Checkbox:**
   - In the "Create bucket" form
   - Below the bucket name field
   - Says "Public bucket" with a checkbox

4. **Policies:**
   - Storage → Policies (in left sidebar under Storage)
   - Or click on bucket → "Policies" tab

---

## ❌ Common Issues

### "I don't see Storage option"
- Make sure you're logged into Supabase
- Select your project first
- Storage is in left sidebar (folder icon)

### "Public bucket checkbox is disabled"
- That's okay, continue
- Set it public from Settings tab later

### "Policies not working"
- Make sure bucket name is exactly `product-images`
- Make sure bucket is public
- Try the SQL method above

---

## 📞 Still Not Working?

### **Temporary Solution: Use URL Upload**

While you fix the bucket:

1. Upload images to any free hosting:
   - **Imgur:** https://imgur.com/upload
   - **Cloudinary:** https://cloudinary.com
   - **ImgBB:** https://imgbb.com

2. Copy image URL

3. In product form, paste URL in text box and press Enter

4. This still works! No bucket needed.

---

## ✅ Verification Checklist

After setup, verify:

- [ ] Bucket `product-images` exists
- [ ] Bucket is marked as **Public**
- [ ] Policies are set (at least one policy exists)
- [ ] You can see the bucket in Storage tab
- [ ] Error message changed or upload works

---

## 🎉 Success!

After bucket is created:
1. Server restart NOT needed (already running)
2. Just refresh browser and try upload again
3. Images will upload to Supabase
4. Public URLs will be generated

---

## 🔗 Quick Links

- **Your Supabase Project:** https://supabase.com/dashboard/project/wlhougvaibxgpooxwfyi
- **Storage Dashboard:** https://supabase.com/dashboard/project/wlhougvaibxgpooxwfyi/storage/buckets
- **SQL Editor:** https://supabase.com/dashboard/project/wlhougvaibxgpooxwfyi/sql

---

**Any questions? Follow the steps carefully and it will work!** 🚀
