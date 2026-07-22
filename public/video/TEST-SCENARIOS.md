# Test Scenarios untuk Video Background

## Skenario Portrait Video di Desktop & Mobile

### 1. **Portrait Video (9:16) - Recommended**
**Aspect Ratio:** 9:16 (contoh: 1080x1920)

**Desktop (Landscape Screen):**
- ✅ Video akan centered vertical
- ✅ Bagian atas dan bawah akan ter-crop jika viewport lebih landscape
- ✅ Video akan cover full width jika viewport sempit
- 🎯 Best untuk: Video dengan focal point di tengah

**Mobile (Portrait Screen):**
- ✅ Perfect fit, full screen coverage
- ✅ Tidak ada cropping
- 🎯 Best experience

**CSS Current Setting:**
```css
min-h-full min-w-full object-cover
```

### 2. **Ultra Portrait Video (9:21)**
**Aspect Ratio:** 9:21 (contoh: 1080x2520)

**Desktop:**
- ⚠️ Lebih banyak crop di top/bottom
- Video tetap cover full width

**Mobile:**
- ✅ Extra space di top/bottom, lebih cinematic
- Bagus untuk scrolling experience

### 3. **Square Video (1:1)**
**Aspect Ratio:** 1:1 (contoh: 1080x1080)

**Desktop:**
- ⚠️ Video akan stretch atau leave empty space
- Tidak optimal untuk landscape viewport

**Mobile:**
- ⚠️ Empty space di top dan bottom
- Tidak recommended

---

## Opsi Penyesuaian yang Bisa Di-tweak

### A. Opacity Video
**Current:** `opacity-30` (30%)

Coba adjust di VideoBackground.tsx:
```tsx
className="... opacity-20"  // Lebih subtle
className="... opacity-40"  // Lebih visible
className="... opacity-50"  // Dominan
```

### B. Object Fit Strategy

**Current:** `object-cover` (crop untuk fill)

**Alternative options:**
```tsx
// Option 1: Contain (no crop, might have letterbox)
className="... object-contain"

// Option 2: Fill (stretch to fit)
className="... object-fill"

// Option 3: Scale down (keep original if smaller)
className="... object-scale-down"
```

### C. Responsive Object Position

Untuk fokus ke bagian tertentu dari video:
```tsx
// Focus on center (default)
style={{ objectPosition: "center center" }}

// Focus on top (untuk video dengan action di atas)
style={{ objectPosition: "center top" }}

// Focus on bottom
style={{ objectPosition: "center bottom" }}
```

### D. Mobile-specific Adjustments

Tambah class untuk behavior berbeda di mobile:
```tsx
className="min-h-full min-w-full object-cover opacity-30 md:object-contain"
//                                                         ^^^^^^^^^^^^^^^^
//                                                     contain di desktop,
//                                                     cover di mobile
```

---

## Recommendations Based on Video Content

### Jika Video Portrait dengan Action/Subject di Tengah:
✅ Use: `object-cover` + `opacity-30`
✅ Position: `center center`
✅ Best aspect ratio: 9:16

### Jika Video Portrait dengan Text/Subject di Atas:
✅ Use: `object-cover` + `opacity-25`
✅ Position: `center top`
✅ Consider: Adjust vignette gradient

### Jika Video Portrait dengan Scenic/Landscape Content:
⚠️ Consider: Recording dalam landscape mode instead
⚠️ Atau: Use tighter crop dengan `object-cover`

---

## Performance Considerations

### File Size Guidelines:
- **Mobile-optimized:** < 5MB (720p, ~24fps, CRF 28)
- **Desktop-optimized:** < 10MB (1080p, ~30fps, CRF 26)
- **Best balance:** 6-8MB (1080p, ~24fps, CRF 27)

### Loading Strategy:
Current: `preload="auto"` - loads saat page load

Alternative:
- `preload="metadata"` - hanya load metadata (lebih ringan)
- `preload="none"` - hanya load when play (paling ringan, tapi delay)

---

## Quick Test Checklist

Setelah upload video ke `/public/video/background.mp4`:

- [ ] Test di mobile portrait - video cover full screen?
- [ ] Test di mobile landscape - video masih visible?
- [ ] Test di desktop (1920x1080) - video tidak terdistorsi?
- [ ] Test di tablet - transisi smooth?
- [ ] Test sync dengan music - video play/pause together?
- [ ] Test opacity - video tidak mengganggu text readability?
- [ ] Test file size - loading cukup cepat?
- [ ] Test loop - transition seamless tanpa jeda?

---

## Example FFmpeg Commands untuk Different Scenarios

### Scenario 1: Portrait Video untuk Mobile Priority
```bash
ffmpeg -i input.mp4 \
  -vf "scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280" \
  -c:v libx264 -crf 28 -preset medium \
  -c:a aac -b:a 128k \
  background-mobile.mp4
```

### Scenario 2: Portrait Video untuk Desktop Priority
```bash
ffmpeg -i input.mp4 \
  -vf "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920" \
  -c:v libx264 -crf 26 -preset medium \
  -c:a aac -b:a 128k \
  background-desktop.mp4
```

### Scenario 3: Balanced untuk Both
```bash
ffmpeg -i input.mp4 \
  -vf "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920" \
  -c:v libx264 -crf 27 -preset medium -movflags +faststart \
  -an \
  background.mp4
```
Note: `-an` removes audio (not needed for background video)
