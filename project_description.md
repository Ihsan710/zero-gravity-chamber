# Zero-Gravity Chamber: A 3D Physics Experience

The **Zero-Gravity Chamber** is a cutting-edge 3D web application that brings the thrill of space physics directly to the browser. Designed as an immersive interactive experiment, it allows users to manipulate gravity in real-time within a visually stunning, neon-lit digital environment. This project bridges the gap between creative coding and rigid body simulation, offering a seamless blend of aesthetics and engineering.

## Core Experience
At the heart of the experience is the ability to toggle gravity instantaneously. Users start in a "grounded" environment where objects—glowing neon cubes, spheres, and torus shapes—obey the normal laws of physics, resting heavily on the reflective floor. With a single click of the "Activate Anti-Gravity" button, the world transforms. Gravity reverses, sending objects floating upward into the void in a mesmerizing dance of weightlessness. To drastically enhance the immersion, the camera performs a cinematic 180-degree flip, reorienting the user’s perspective so the ceiling becomes the floor. This disorienting yet satisfying mechanic perfectly simulates the feeling of deep space exploration.

## Technical Implementation
Built using **Three.js** for high-performance WebGL rendering and **Cannon-es** for precise physics calculations, the application handles complex collisions and forces smoothly at 60 frames per second. The visual style is heavily inspired by cyberpunk aesthetics, utilizing a "Bloom" post-processing effect to make neon colors glow vibrantly against a deep, procedurally generated 3-layer starfield background. The application runs entirely on client-side JavaScript, using ES Modules for a modern, modular codebase.

## Advanced Features
Beyond simple gravity toggles, the project features a "Time Scale" control, allowing users to slow down time for a "Matrix-style" bullet-time effect or freeze the simulation entirely to admire the chaos. A "Chaos Mode" injects randomness into the physics engine, shifting gravity’s direction every two seconds for unpredictable mayhem. Perhaps most impressively, the audio is handled procedurally via the **Web Audio API**, generating sci-fi ambient hums and gravity warp sounds in real-time without requiring any external audio assets.

This project serves as a comprehensive demonstration of modern frontend capabilities, combining 3D rendering, physics engines, and interactive UI design into a cohesive, portfolio-ready experience. It invites users not just to watch, but to play with the fundamental forces of nature in a digital playground.
