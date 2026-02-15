# Zero-Gravity Chamber - Walkthrough

## Overview
I have created the **Zero-Gravity Chamber**! Since `npm` was not available, I implemented it using **ES Modules via CDN**.

The project consists of three files in `c:\Users\Acer\Desktop\game`:
- `index.html`: The entry point and UI.
- `style.css`: The futuristic styling.
- `main.js`: The 3D logic with Three.js, Cannon-es, and Bloom effects.

## How to Run
> [!IMPORTANT]
> Because the project uses `import` statements for Three.js, **you cannot simply double-click `index.html`** in some browsers due to security restrictions (CORS) on file:// protocol.

**Recommended Method:**
1.  Open the folder `c:\Users\Acer\Desktop\game` in **VS Code**.
2.  Install the **"Live Server"** extension if you haven't already.
3.  Right-click `index.html` and select **"Open with Live Server"**.

**Alternative:**
If you have any other local static server tool (like `http-server`, simple python server, etc.), point it to the directory.
Since `python` and `node` were not found in your path, the VS Code Live Server is your best bet.

## Features
- **Anti-Gravity Core**: Click the button to reverse gravity!
- **Physics**: Objects collide, bounce, and rotate realistically.
- **Visuals**: Neon glowing cubes, spheres, and torus shapes with Bloom post-processing.
- **Cinematic Experience**:
    - **Camera Flip**: The world rotates 180° when gravity reverses.
    - **Procedural Audio**: Sci-fi ambient hum and gravity warp sounds (generated in real-time).
- **Controls**:
    - **Gravity Slider**: Fine-tune the gravity from -20 to +20.
    - **Time Scale**: Slow motion (Matrix style) or freeze time.
    - **Chaos Mode**: Randomize gravity every 2 seconds.
    - **Reset Objects**: Restore lost objects to the center.
    - **Interactions**: Click objects to spin them; drag to rotate camera.
- **Social**: Floating GitHub button linking to your profile.

## Troubleshooting
- **No Sound?**: Browsers block audio by default. **Click anywhere** on the screen after loading to start the audio engine.
- **CORS Errors?**: If you see just a black screen, make sure you are using `run.bat` or a local server, NOT just double-clicking `index.html`.

## Deployment
- **GitHub Repo**: [Ihsan710/zero-gravity-chamber](https://github.com/Ihsan710/zero-gravity-chamber)
- **Live Demo**: Deployed on Vercel (Check your Vercel dashboard for the live URL, usually `https://zero-gravity-chamber.vercel.app`)

## Project Structure
```text
game/
├── index.html   # Main entry
├── style.css    # Styles
└── main.js      # All logic
```

Enjoy the anti-gravity experience! 🌌
