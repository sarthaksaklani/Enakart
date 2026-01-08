# Image Upload Setup Guide

## ✅ **Direct File Upload - NOW IMPLEMENTED!**

Ab aap apne computer se directly images upload kar sakte ho! No need to paste URLs.

---

## 🚀 Supabase Storage Setup (Required)

Pehle ek baar Supabase Storage setup karna hoga:

### Step 1: Create Storage Bucket

1. **Supabase Dashboard** open karo:
   ```
   https://supabase.com/dashboard
   ```

2. **Your Project** select karo (wlhougvaibxgpooxwfyi)

3. Left sidebar mein **"Storage"** pe click karo

4. **"New Bucket"** button click karo

5. Bucket details:
   - **Name:** `product-images`
   - **Public bucket:** ✅ **YES** (checked)
   - Click **"Create bucket"**

### Step 2: Set Bucket Policies (Public Access)

1. **Storage** > **Policies** pe jao

2. **product-images** bucket select karo

3. **New Policy** create karo:

**Policy 1: Public Read Access**
```sql
-- Allow public to view images
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
TO public
USING ( bucket_id = 'product-images' );
```

**Policy 2: Authenticated Upload**
```sql
-- Allow authenticated users to upload
CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT
TO authenticated, anon
WITH CHECK ( bucket_id = 'product-images' );
```

**Policy 3: Service Role Full Access (for API)**
```sql
-- Service role can do anything
CREATE POLICY "Service Role Access"
ON storage.objects FOR ALL
TO service_role
USING ( bucket_id = 'product-images' );
```

Ya simple tarike se:
1. Click **"New policy"**
2. Select **"For full customization"**
3. Policy name: "Public read, authenticated write"
4. Target roles: `public`, `authenticated`, `anon`
5. Operations: Check all (SELECT, INSERT, UPDATE, DELETE)
6. Click **"Review"** then **"Save policy"**

---

## 📸 How to Use

### Upload Images from Computer:

1. Go to: `http://localhost:3000/seller/catalog/add`

2. Fill product details

3. In **Images** section:
   - Click **"Upload from Computer"** blue button
   - Select one or multiple images (max 5MB each)
   - Images will upload automatically
   - Preview appears immediately

4. Click **"Upload X Catalog(s)"** to save product

### Alternative: Paste URL (Optional):

Still works! Type URL in text box and press Enter.

---

## 🎯 Features

✅ **Direct file upload from computer**
✅ **Multiple images at once**
✅ **Instant preview**
✅ **Automatic upload to Supabase Storage**
✅ **Public URLs generated automatically**
✅ **Max 5MB per image**
✅ **Supported formats:** JPG, PNG, GIF, WebP
✅ **Still supports URL pasting** (optional)

---

## 🔧 Troubleshooting

### Error: "Failed to upload image"

**Check:**
1. Supabase Storage bucket `product-images` exists
2. Bucket is **Public**
3. Storage policies are set (see Step 2 above)
4. Image is less than 5MB
5. File is an image (JPG, PNG, etc.)

### Error: "Bucket not found"

**Solution:**
- Go to Supabase Dashboard → Storage
- Create bucket named exactly `product-images`
- Make it **Public**

### Images not showing after upload

**Check:**
1. Bucket policies allow public read access
2. Browser console for errors (F12)
3. Image URL in network tab

---

## 📊 How It Works

```
1. User clicks "Upload from Computer"
   ↓
2. User selects images
   ↓
3. Frontend shows temporary preview (blob URL)
   ↓
4. Each image uploads to API: /api/upload
   ↓
5. API uploads to Supabase Storage bucket
   ↓
6. API returns public URL
   ↓
7. Frontend replaces temp preview with real URL
   ↓
8. URLs saved when product is created
```

---

## 🎨 Upload Limits

- **Max file size:** 5MB per image
- **Max images per variant:** 8 images
- **Allowed formats:** JPG, JPEG, PNG, GIF, WebP
- **Storage:** Unlimited* (Supabase free tier: 1GB)

---

## 💡 Tips

1. **Optimize images before upload:**
   - Use tools like TinyPNG, ImageOptim
   - Recommended size: 1000x1000px or less
   - This saves storage and loads faster

2. **Multiple images:**
   - Select multiple files at once
   - All upload in parallel
   - Wait for all to finish before submitting

3. **Preview before upload:**
   - Images show immediately after selection
   - Blur/loading indicator during upload
   - Remove unwanted images before submitting

---

## 🚀 Next Enhancements

Planned improvements:
- 🔨 Drag & drop upload
- 🔨 Image cropping/resizing
- 🔨 Progress bar during upload
- 🔨 Bulk image upload for multiple variants
- 🔨 Image compression before upload

---

## 📝 Example Workflow

```bash
# 1. Setup (one-time)
# - Create Supabase bucket
# - Set public policies

# 2. Upload Product
# - Go to /seller/catalog/add
# - Fill: Name, Brand, Category
# - Click "Upload from Computer"
# - Select product photos
# - Wait for upload (see preview)
# - Add price and stock
# - Click "Upload Catalog"

# 3. Done!
# Images saved to Supabase Storage
# Product shows in catalog with images
```

---

## ✅ Summary

**Status:** ✅ **FULLY WORKING!**

You can now:
- ✅ Upload images directly from computer
- ✅ Multiple images at once
- ✅ Automatic storage in Supabase
- ✅ Public URLs generated
- ✅ Still paste URLs if needed

**No more copy-paste URLs required!** 📸🎉

---

## 🔗 Links

- Supabase Dashboard: https://supabase.com/dashboard
- Storage Docs: https://supabase.com/docs/guides/storage
- Your Project: https://wlhougvaibxgpooxwfyi.supabase.co

Happy Uploading! 📷✨
