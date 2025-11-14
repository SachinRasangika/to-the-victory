# 🎨 Scene Images Setup Guide

## Quick Start

Your game is now configured to load images from this folder. Follow these simple steps:

### Step 1: Prepare Your Images
Convert your scene illustrations to one of these formats:
- **PNG** (.png) - Recommended
- **JPEG** (.jpg, .jpeg)
- **WebP** (.webp)
- **GIF** (.gif)

### Step 2: Place Images Here
Save your images in this folder (`frontend/public/images/`) with these names:

| Scene | Filename | Location in Game |
|-------|----------|------------------|
| 1 | **scene1.png** | The Castle Gate – The Guard's Challenge |
| 2 | **scene2.png** | The Throne Room – The King's Test |
| 3 | (optional) | Banana Game (game play scene) |
| 4 | **scene4.png** | The Final Trial – Victory or Defeat |

### Step 3: Done! 🎉
That's it! No code changes needed. When the game loads, it will automatically display your images.

---

## Example File Structure

```
frontend/
└── public/
    └── images/
        ├── scene1.png          ← Castle Gate scene
        ├── scene2.png          ← Throne Room scene
        ├── scene4.png          ← Final Trial scene
        ├── placeholder.png     (fallback if image missing)
        └── placeholder-bg.png  (background fallback)
```

---

## Image Optimization Tips

### Recommended Dimensions
- **Width:** 1280px
- **Height:** 720px
- **Aspect Ratio:** 16:9

### File Size Guidelines
- Target: **300-500 KB** per image
- Maximum: **1 MB** per image

### How to Optimize
**Using Free Tools:**
- [TinyPNG](https://tinypng.com) - Compress PNG/JPG
- [Squoosh](https://squoosh.app) - Google's image compressor
- [ImageMagick](https://imagemagick.org) - Command line tool

**Using Online Resizers:**
- [Pixlr](https://pixlr.com)
- [Canva](https://canva.com)
- [Photopea](https://photopea.com) - Photoshop online

---

## Troubleshooting

### Images Not Showing?
1. ✅ Check filenames match exactly: `scene1.png`, `scene2.png`, `scene4.png`
2. ✅ Files are in `frontend/public/images/` folder
3. ✅ Restart the dev server after adding images
4. ✅ Clear browser cache (Ctrl+Shift+Delete or Cmd+Shift+Delete)

### Image Looks Blurry?
- Use high-resolution source (at least 1280x720)
- Compress only after resizing to target dimensions

### File Format Issues?
- Use **PNG** for best compatibility
- JPG works if file size is critical
- WebP for modern browsers (may not work on older browsers)

---

## Advanced: Custom Image Paths

If you want to add more images or use different names, edit `frontend/src/pages/Game.jsx`:

```javascript
// Change this line (find illustrationUrl):
illustrationUrl: "/images/scene1.png",

// To your custom path:
illustrationUrl: "/images/custom-scene1.png",
```

---

## File Currently Loaded From

All game scenes currently reference images from:
- `/images/scene1.png` - Scene 1
- `/images/scene2.png` - Scene 2
- `/images/scene4.png` - Scene 4
- `/images/placeholder.png` - Fallback (if no image provided)
- `/images/placeholder-bg.png` - Background fallback

Happy gaming! 🎮
