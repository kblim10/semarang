# Video Background

Folder ini untuk menyimpan video background yang akan otomatis sync dengan music.

## Format Video

**Recommended:**
- **Orientation:** Portrait (9:16 atau 1080x1920)
- **Format:** MP4 (H.264) atau WebM
- **Resolution:** 
  - Mobile: 720x1280 (HD)
  - Desktop: 1080x1920 (Full HD)
- **Bitrate:** 2-4 Mbps (agar file tidak terlalu besar)
- **FPS:** 24-30 fps
- **Duration:** Loop-able (bisa diulang seamless)

## File yang Dibutuhkan

Letakkan file video dengan nama:
- `background.mp4` (required, for best compatibility)
- `background.webm` (optional, for better compression)

## Tips Compress Video

Untuk mengurangi file size tanpa menurunkan kualitas signifikan:

```bash
# Using ffmpeg (install dulu via choco, brew, atau apt)
# Compress ke MP4
ffmpeg -i input.mp4 -vcodec h264 -crf 28 -preset medium -vf scale=1080:1920 background.mp4

# Convert ke WebM (lebih kecil)
ffmpeg -i input.mp4 -c:v libvpx-vp9 -crf 35 -b:v 0 -vf scale=1080:1920 background.webm
```

## Testing

Video akan:
- ✅ Otomatis play ketika music play
- ✅ Pause ketika music pause
- ✅ Loop seamlessly
- ✅ Muted (tidak ada audio dari video)
- ✅ Opacity 30% dengan overlay gradient biar tidak mengganggu konten

## Catatan Performance

- Video background bisa berat untuk device low-end
- Pastikan file size tidak lebih dari 10MB untuk mobile experience yang smooth
- Video akan di-preload secara otomatis (`preload="auto"`)
