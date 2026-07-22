# Memory Images

Folder ini untuk menyimpan foto-foto kenangan yang akan ditampilkan random di background slideshow bersama dengan video.

## Setup

1. **Tambahkan foto-foto** ke folder ini (format: JPG, PNG, WebP)
2. **Edit `src/components/VideoBackground.tsx`**
3. **Tambahkan entry** di array `MEDIA_ITEMS`:

```tsx
const MEDIA_ITEMS = [
  { type: "video" as const, src: "/video/background.mp4" },
  { type: "image" as const, src: "/images/memory-1.jpg" },
  { type: "image" as const, src: "/images/memory-2.jpg" },
  { type: "image" as const, src: "/images/memory-3.jpg" },
  { type: "image" as const, src: "/images/memory-4.jpg" },
  // Add more...
];
```

## Naming Convention

**Recommended:**
- `memory-1.jpg`, `memory-2.jpg`, `memory-3.jpg`, dll.
- Atau nama deskriptif: `jogging.jpg`, `ngopi.jpg`, `birthday.jpg`

## Image Specs

**Format:**
- JPG (best for photos)
- PNG (for transparency, tapi lebih besar)
- WebP (best compression, modern browsers)

**Resolution:**
- Portrait: 1080x1920 (best match dengan video)
- Landscape: 1920x1080 (akan di-crop untuk fit)
- Square: 1080x1080 (akan di-crop)

**File Size:**
- Target: < 500KB per image
- Max: 1MB per image

## Compress Images

### Online Tool (Easy)
1. [TinyPNG.com](https://tinypng.com/) - drag & drop
2. [Squoosh.app](https://squoosh.app/) - advanced control

### Command Line (FFmpeg)
```bash
# Resize & compress JPG
ffmpeg -i input.jpg -vf "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920" -q:v 3 memory-1.jpg

# Convert to WebP (better compression)
ffmpeg -i input.jpg -vf "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920" -quality 85 memory-1.webp
```

## How Slideshow Works

1. **Random Order** - Semua media (video + images) di-shuffle
2. **4 Second Display** - Setiap item muncul 4 detik
3. **Video Clips** - Video diputar 4 detik per tampil
4. **Video Position Memory** - Video lanjut dari detik terakhir
   - Play 1: detik 0-4
   - Play 2: detik 4-8
   - Play 3: detik 8-12
   - dst... sampai habis, terus reset ke 0
5. **Smooth Transitions** - Fade transition antar media

## Example Structure

```
public/images/
├── memory-1.jpg      (jogging pagi)
├── memory-2.jpg      (ngopi bareng)
├── memory-3.jpg      (birthday surprise)
├── memory-4.jpg      (group photo)
├── memory-5.jpg      (sunset)
└── README.md
```

Then in `VideoBackground.tsx`:
```tsx
const MEDIA_ITEMS = [
  { type: "video", src: "/video/background.mp4" },
  { type: "image", src: "/images/memory-1.jpg" },
  { type: "image", src: "/images/memory-2.jpg" },
  { type: "image", src: "/images/memory-3.jpg" },
  { type: "image", src: "/images/memory-4.jpg" },
  { type: "image", src: "/images/memory-5.jpg" },
];
```

## Customization

### Change Display Duration
Edit `DISPLAY_DURATION` in VideoBackground.tsx:
```tsx
const DISPLAY_DURATION = 5000; // 5 seconds
```

### Change Video Clip Length
Edit `VIDEO_CLIP_DURATION` in VideoBackground.tsx:
```tsx
const VIDEO_CLIP_DURATION = 6; // 6 seconds per video clip
```

### Disable Video, Images Only
Remove video entries from `MEDIA_ITEMS`:
```tsx
const MEDIA_ITEMS = [
  { type: "image", src: "/images/memory-1.jpg" },
  { type: "image", src: "/images/memory-2.jpg" },
  // No videos
];
```

## Tips

✅ **Aspect Ratio:** Portrait images (9:16) work best
✅ **Variety:** Mix close-ups, group shots, scenery
✅ **Quality:** Use high-res images, component will handle scaling
✅ **Quantity:** 5-10 images minimum untuk variety yang bagus
✅ **Content:** Choose meaningful moments dari memories Semarang
