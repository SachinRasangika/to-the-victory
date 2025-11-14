# Game Scene Images

This folder contains all the illustration images for game scenes.

## File Structure

Place your scene images here with the following naming convention:

```
images/
├── scene1.png          # Scene 1: The Castle Gate – The Guard's Challenge
├── scene2.png          # Scene 2: The Throne Room – The King's Test
├── scene3.png          # Scene 3: The Banana Game (if needed)
└── scene4.png          # Scene 4: The Final Trial – Victory or Defeat
```

## Supported Formats

- PNG (.png)
- JPG/JPEG (.jpg, .jpeg)
- WebP (.webp)
- GIF (.gif)

## Image Requirements

- **Recommended dimensions:** 1280x720px (16:9 aspect ratio)
- **File size:** Keep under 500KB for optimal loading
- **Quality:** High resolution for best visual experience

## How to Add Images

1. Convert your illustrations to one of the supported formats
2. Save them in this `images/` folder
3. Name them according to the scene they belong to (scene1.png, scene2.png, etc.)
4. The paths in Game.jsx are already configured to load from this folder automatically

## Current Configuration

In `src/pages/Game.jsx`, images are loaded from `/images/scene{number}.png`:

```javascript
illustrationUrl: "/images/scene1.png"
illustrationUrl: "/images/scene2.png"
illustrationUrl: "/images/scene3.png" (optional)
illustrationUrl: "/images/scene4.png"
```

No additional code changes needed - just add your images and they'll appear!
