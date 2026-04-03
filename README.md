# 🌌 Zero-Gravity Chamber

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen.svg)](https://zero-gravity-chamber.vercel.app)

A futuristic, interactive 3D web experience that simulates a zero-gravity environment directly in the browser. Built with **Three.js** for rendering and **Cannon-es** for real-time physics, this project demonstrates advanced frontend development skills including 3D graphics, physics simulations, and procedural audio.

![Zero Gravity Preview](https://raw.githubusercontent.com/Ihsan710/Zero-Gravity-Chamber/main/preview.jpg)
*(Replace with a screenshot of your project)*

## ✨ Key Features

*   **⚡ Real-Time Physics**: Fully interactive rigid body physics where objects collide, bounce, and respond to forces.
*   **🔀 Variable Gravity**: Toggle between normal earth gravity (9.8 m/s²) and anti-gravity (-3.0 m/s²) with smooth transitions.
*   **🎥 Cinematic Camera**: The camera dynamically flips 180° when gravity reverses, creating a disorienting, immersive sci-fi effect.
*   **🔊 Procedural Audio**: Generates real-time sci-fi sound effects (ambient hum, gravity warps) using the Web Audio API—no external assets required.
*   **⏯️ Time Control**: Matrix-style "Bullet Time" slider to slow down or freeze the simulation.
*   **🎲 Chaos Mode**: A randomized mode where gravity shifts wildly every 2 seconds.
*   **🎨 Cyberpunk Aesthetics**: Neon lighting, bloom post-processing, and a deep space starfield background.

## 🛠️ Technology Stack

*   **Rendering**: [Three.js](https://threejs.org/) (WebGL)
*   **Physics**: [Cannon-es](https://github.com/pmndrs/cannon-es)
*   **Language**: Vanilla JavaScript (ES Modules)
*   **Styling**: CSS3 with Glassmorphism
*   **Audio**: Web Audio API

## 🚀 How to Run

Since this project uses ES Modules, it requires a local server to run (browsers block local file imports for security).

### Option 1: Double-Click (Windows)
1.  Open the `game` folder.
2.  Double-click **`run.bat`**.
3.  The browser will open automatically at `http://localhost:8000`.

### Option 2: VS Code
1.  Open the folder in **VS Code**.
2.  Install the **Live Server** extension.
3.  Right-click `index.html` and choose "Open with Live Server".

## 🎮 Controls

*   **Gravity Button**: Toggle Anti-Gravity On/Off.
*   **Gravity Slider**: Fine-tune gravitational force.
*   **Time Slider**: Control simulation speed (1.0x to 0x).
*   **Chaos Mode**: Enable random gravity shifts.
*   **Mouse**: Click objects to spin them; Drag to rotate camera; Scroll to zoom.

---
*Created by [Ihsan710](https://github.com/Ihsan710)*
