# Setup Guide - Video Background

## Quick Start

1. **Siapkan video portrait** (9:16 aspect ratio recommended)
2. **Rename ke `background.mp4`**
3. **Copy ke folder** `public/video/`
4. **Refresh browser** - video akan otomatis sync dengan music!

---

## Step-by-Step untuk Pemula

### Step 1: Dapat/Buat Video Portrait

**Sumber Video:**
- Record sendiri dengan HP (portrait mode)
- Download dari stock video sites (Pexels, Pixabay - free)
- Extract dari YouTube (gunakan tools seperti yt-dlp)

**Rekomendasi Content:**
- Slow motion scenery
- Ambient movement (clouds, water, streets)
- Abstract patterns/colors
- Memory-related imagery (old photos, locations)

### Step 2: Convert/Compress Video

**Jika video sudah dalam format MP4 dan portrait:**
- Langsung rename ke `background.mp4`
- Copy ke `public/video/`
- Done! ✅

**Jika video perlu di-convert:**

#### Option A: Online Tool (Paling Mudah)
1. Buka [CloudConvert.com](https://cloudconvert.com/mp4-converter)
2. Upload video
3. Set format: MP4
4. Set resolution: 1080x1920 (atau 720x1280 untuk mobile)
5. Download dan rename ke `background.mp4`

#### Option B: FFmpeg (Lebih Kontrol)
Install FFmpeg dulu:
- Windows: `choco install ffmpeg`
- Mac: `brew install ffmpeg`
- Linux: `sudo apt install ffmpeg`

Kemudian run command ini di terminal:

```bash
# Basic conversion (portrait video)
ffmpeg -i input-video.mp4 \
  -vf "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920" \
  -c:v libx264 -crf 27 -preset medium \
  -an -movflags +faststart \
  public/video/background.mp4
```

**Penjelasan:**
- `scale=1080:1920` → resize ke portrait size
- `-crf 27` → quality (lower = better quality, bigger file)
- `-an` → remove audio (tidak perlu untuk background)
- `-movflags +faststart` → enable web streaming

### Step 3: Test di Browser

1. Start dev server: `npm run dev`
2. Buka `http://localhost:3000`
3. Play music dari intro
4. Video akan otomatis play bersamaan dengan music!

---

## Troubleshooting

### ❌ Video tidak muncul
**Checklist:**
- [ ] File ada di `public/video/background.mp4`?
- [ ] File format MP4 (bukan MOV, AVI, dll)?
- [ ] File size tidak terlalu besar (< 20MB)?
- [ ] Browser console ada error? (F12 → Console tab)

**Fix:**
- Coba convert ulang dengan FFmpeg command di atas
- Pastikan codec H.264 (bukan H.265/HEVC)

### ❌ Video muncul tapi tidak play
**Kemungkinan:**
- Music belum di-play (video sync dengan music state)
- Browser autoplay policy blocked

**Fix:**
- Klik tombol play music dulu
- Check browser console untuk error

### ❌ Video terpotong aneh di desktop
**Penyebab:**
- Video landscape, bukan portrait
- Aspect ratio tidak sesuai

**Fix:**
- Gunakan video portrait (9:16)
- Atau adjust `object-fit` di VideoBackground.tsx

### ❌ Video lag/stuttering
**Penyebab:**
- File size terlalu besar
- Resolution terlalu tinggi
- Bitrate terlalu tinggi

**Fix:**
```bash
# Compress lebih aggressive
ffmpeg -i input.mp4 \
  -vf "scale=720:1280" \
  -c:v libx264 -crf 30 -preset fast \
  -an -movflags +faststart \
  public/video/background.mp4
```

---

## Advanced Customization

### Adjust Video Opacity

Edit `src/components/VideoBackground.tsx`:

```tsx
// Line ~55
className="... opacity-30"  // Current: 30%
          ^^^^^^^^^^
// Ubah ke:
className="... opacity-20"  // Lebih subtle (20%)
className="... opacity-40"  // Lebih visible (40%)
```

### Change Overlay Color/Intensity

Edit `src/components/VideoBackground.tsx`:

```tsx
// Line ~62-63
<div className="... from-navy-deep/70 via-navy/60 to-navy-deep/80" />
                    ^^^^^^^^^^^^^^^^  ^^^^^^^^^^^  ^^^^^^^^^^^^^^^^
// Adjust opacity values (70, 60, 80) untuk mengubah darkness
```

### Different Video for Mobile vs Desktop

Edit `src/components/VideoBackground.tsx`:

```tsx
// Add conditional source
<source 
  src={isMobile ? "/video/background-mobile.mp4" : "/video/background-desktop.mp4"} 
  type="video/mp4" 
/>
```

### Disable Video on Low-End Devices

Edit `src/components/VideoBackground.tsx`:

```tsx
// At the top
const [shouldRender, setShouldRender] = useState(true);

useEffect(() => {
  // Check device memory (if available)
  if ('deviceMemory' in navigator && navigator.deviceMemory < 4) {
    setShouldRender(false);
  }
}, []);

if (!shouldRender || videoError) return null;
```

---

## File Structure

```
public/
└── video/
    ├── background.mp4          ← Main video file (REQUIRED)
    ├── background.webm         ← Optional WebM version (better compression)
    ├── README.md               ← Basic info
    ├── TEST-SCENARIOS.md       ← Testing guide
    └── SETUP-GUIDE.md          ← This file
```

---

## Recommendations Summary

✅ **Best Setup:**
- Resolution: 1080x1920 (portrait)
- Format: MP4 (H.264)
- File size: 5-8 MB
- FPS: 24
- Duration: 30-60 seconds (seamless loop)
- Content: Slow, ambient movement

✅ **Test On:**
- Mobile portrait (primary experience)
- Mobile landscape
- Desktop (1920x1080)
- Tablet

✅ **Optimize For:**
- Fast loading (< 3 seconds on 3G)
- Smooth playback (no dropped frames)
- Battery efficiency (lower resolution for mobile)

---

## Need Help?

Check browser console (F12 → Console) untuk error messages.
Kebanyakan issue terkait file format atau size - gunakan FFmpeg command di atas untuk fix!
