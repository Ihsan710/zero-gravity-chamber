import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import * as CANNON from 'cannon-es';

// --- CONFIGURATION ---
const CONFIG = {
    normalGravity: -9.8,
    antiGravity: 3.0,
    floorSize: 200,
    objectCount: 20,
    colors: [0x00f3ff, 0xbc13fe, 0xff0055, 0xffff00],
    bloom: true
};

let isAntiGravity = false;

// --- SETUP THREE.JS ---
const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ReinhardToneMapping;

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050510);
scene.fog = new THREE.FogExp2(0x050510, 0.02);

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 10);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(10, 20, 10);
dirLight.castShadow = true;
dirLight.shadow.mapSize.width = 2048;
dirLight.shadow.mapSize.height = 2048;
scene.add(dirLight);

// Neon Lights (Point Lights)
const pLight1 = new THREE.PointLight(0x00f3ff, 2, 30);
pLight1.position.set(-5, 5, -5);
scene.add(pLight1);

const pLight2 = new THREE.PointLight(0xbc13fe, 2, 30);
pLight2.position.set(5, 5, 5);
scene.add(pLight2);

// Post-Processing (Bloom)
const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
bloomPass.threshold = 0.2;
bloomPass.strength = 1.2;
bloomPass.radius = 0.5;

const composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);

// --- SETUP CANNON.JS ---
const world = new CANNON.World();
world.gravity.set(0, CONFIG.normalGravity, 0);
world.broadphase = new CANNON.NaiveBroadphase();
world.solver.iterations = 10;

// Material
const defaultMaterial = new CANNON.Material('default');
const defaultContactMaterial = new CANNON.ContactMaterial(defaultMaterial, defaultMaterial, {
    friction: 0.3,
    restitution: 0.7, // Bounciness
});
world.addContactMaterial(defaultContactMaterial);

// --- OBJECTS FACTORY ---
const objectsToUpdate = [];

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const sphereGeometry = new THREE.SphereGeometry(0.5);
const torusGeometry = new THREE.TorusGeometry(0.5, 0.2, 16, 100);

const createObject = (type, position) => {
    // Three.js Mesh
    let mesh;
    let shape;
    const color = CONFIG.colors[Math.floor(Math.random() * CONFIG.colors.length)];
    const material = new THREE.MeshStandardMaterial({
        color: color,
        metalness: 0.1,
        roughness: 0.2,
        emissive: color,
        emissiveIntensity: 0.5
    });

    if (type === 'box') {
        mesh = new THREE.Mesh(boxGeometry, material);
        shape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));
    } else if (type === 'sphere') {
        mesh = new THREE.Mesh(sphereGeometry, material);
        shape = new CANNON.Sphere(0.5);
    } else if (type === 'torus') {
        mesh = new THREE.Mesh(torusGeometry, material);
        // Approximate torus with sphere for physics or simple box
        shape = new CANNON.Sphere(0.6); // Simple approximation
    }

    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.position.copy(position);
    scene.add(mesh);

    // Cannon.js Body
    const body = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(position.x, position.y, position.z),
        shape: shape,
        material: defaultMaterial
    });
    // Add random initial rotation
    body.quaternion.setFromEuler(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
    );
    world.addBody(body);

    objectsToUpdate.push({ mesh, body });
};

// Create Floor
const createFloor = () => {
    const floorGeo = new THREE.PlaneGeometry(CONFIG.floorSize, CONFIG.floorSize);
    const floorMat = new THREE.MeshStandardMaterial({
        color: 0x111111,
        metalness: 0.8,
        roughness: 0.1,
        side: THREE.DoubleSide
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    const floorShape = new CANNON.Plane();
    const floorBody = new CANNON.Body({
        mass: 0, // Static
        shape: floorShape,
        material: defaultMaterial
    });
    floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
    world.addBody(floorBody);
};

// Create Ceiling (Invisible boundary for Anti-Gravity)
const createCeiling = () => {
    const ceilShape = new CANNON.Plane();
    const ceilBody = new CANNON.Body({
        mass: 0,
        shape: ceilShape,
        material: defaultMaterial
    });
    // Rotate to face down, positioned high up
    ceilBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), Math.PI / 2);
    ceilBody.position.set(0, 20, 0); // 20 units high
    world.addBody(ceilBody);
};

// Initialize World
createFloor();
createCeiling();

for (let i = 0; i < CONFIG.objectCount; i++) {
    const type = ['box', 'sphere', 'torus'][Math.floor(Math.random() * 3)];
    const x = (Math.random() - 0.5) * 10;
    const y = 5 + Math.random() * 5;
    const z = (Math.random() - 0.5) * 10;
    createObject(type, { x, y, z });
}

// --- PARTICLES (Deep Space Starfield) ---
const createStarField = (count, size, color) => {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
        pos[i] = (Math.random() - 0.5) * 200; // Wider spread
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
        size: size,
        color: color,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true
    });
    const mesh = new THREE.Points(geo, mat);
    scene.add(mesh);
    return mesh;
};

// 3 Layers of stars for depth
const starsSmall = createStarField(2000, 0.1, 0xffffff); // Distant stars
const starsMedium = createStarField(500, 0.2, 0xccccff); // Closer brighter stars
const starsDust = createStarField(1000, 0.05, 0xbc13fe); // Purple cosmic dust

// Store in array for animation
const starFields = [starsSmall, starsMedium, starsDust];

// --- RAYCASTER INTERACTION ---
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('click', (event) => {
    // Only trigger if clicking on canvas (not UI)
    if (event.target.closest('.controls')) return;

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    // Intersect visual meshes
    const intersects = raycaster.intersectObjects(objectsToUpdate.map(o => o.mesh));

    if (intersects.length > 0) {
        const intersectedObject = intersects[0].object;
        // Find corresponding physics body
        const obj = objectsToUpdate.find(o => o.mesh === intersectedObject);
        if (obj) {
            // Apply impulse and torque
            const force = new CANNON.Vec3(0, 5, 0);
            const worldPoint = new CANNON.Vec3(intersects[0].point.x, intersects[0].point.y, intersects[0].point.z);
            obj.body.applyImpulse(force, worldPoint);
            obj.body.angularVelocity.set(
                Math.random() * 10,
                Math.random() * 10,
                Math.random() * 10
            );

            // Visual feedback
            const originalEmissive = intersectedObject.material.emissiveIntensity;
            intersectedObject.material.emissiveIntensity = 2.0;
            setTimeout(() => {
                intersectedObject.material.emissiveIntensity = originalEmissive;
            }, 200);
        }
    }
});

// --- AUDIO SYSTEM (Procedural) ---
let audioCtx;
let ambientOsc;
let ambientGain;

const initAudio = () => {
    if (audioCtx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();

    // Ambient Hum (Low frequency)
    ambientOsc = audioCtx.createOscillator();
    ambientGain = audioCtx.createGain();

    ambientOsc.type = 'sine';
    ambientOsc.frequency.setValueAtTime(50, audioCtx.currentTime); // 50Hz hum
    ambientGain.gain.setValueAtTime(0.05, audioCtx.currentTime); // Low volume

    ambientOsc.connect(ambientGain);
    ambientGain.connect(audioCtx.destination);
    ambientOsc.start();
};

const playGravitySound = (isAnti) => {
    if (!audioCtx) return;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sawtooth';
    // Frequency sweep
    const now = audioCtx.currentTime;
    if (isAnti) {
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 1);
    } else {
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(200, now + 1);
    }

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(now + 1.5);
};

// --- UI LOGIC ---
const btn = document.getElementById('gravity-btn');
const slider = document.getElementById('gravity-slider');
const valDisplay = document.getElementById('gravity-value');
const timeSlider = document.getElementById('time-slider');
const timeValDisplay = document.getElementById('time-value');
const chaosBtn = document.getElementById('chaos-btn');

// Target gravity for interpolation
let targetGravity = new CANNON.Vec3(0, CONFIG.normalGravity, 0);
let timeScale = 1.0;
let chaosInterval = null;

// Camera Rotation Target
let targetCameraRotationX = 0; // standard roughly looking down/forward
let targetCameraRotationZ = 0;

const toggleGravity = () => {
    // Initialize audio on first user interaction
    initAudio();

    isAntiGravity = !isAntiGravity;
    playGravitySound(isAntiGravity);

    // Audio & Debug Logging
    console.log(`Gravity Toggled: ${isAntiGravity ? 'ANTI-GRAVITY' : 'NORMAL'}`);
    console.log(`New Gravity Vector:`, isAntiGravity ? CONFIG.antiGravity : CONFIG.normalGravity);

    // Camera shake effect
    document.body.classList.add('shake');
    setTimeout(() => document.body.classList.remove('shake'), 500);

    if (isAntiGravity) {
        // Switch to Anti-Gravity
        targetGravity.set(0, CONFIG.antiGravity, 0);
        btn.textContent = "DEACTIVATE ANTI-GRAVITY";
        btn.classList.add('active');

        slider.value = CONFIG.antiGravity;
        valDisplay.textContent = `${CONFIG.antiGravity} m/s²`;

        // Lighting and Post-Processing Shift
        scene.fog.color.setHex(0x220033);
        scene.background.setHex(0x220033);
        pLight1.intensity = 4;
        pLight2.intensity = 4;
        bloomPass.strength = 2.0;

        // Cinematic Camera Flip (Upside Down)
        targetCameraRotationZ = Math.PI;


    } else {
        // Switch to Normal Gravity
        targetGravity.set(0, CONFIG.normalGravity, 0);
        btn.textContent = "ACTIVATE ANTI-GRAVITY";
        btn.classList.remove('active');

        slider.value = CONFIG.normalGravity;
        valDisplay.textContent = `${CONFIG.normalGravity} m/s²`;

        // Restore lighting
        scene.fog.color.setHex(0x050510);
        scene.background.setHex(0x050510);
        pLight1.intensity = 2;
        pLight2.intensity = 2;
        bloomPass.strength = 1.2;

        // Restore Camera
        targetCameraRotationZ = 0;

        // Wake up bodies
        objectsToUpdate.forEach(o => o.body.wakeUp());
    }
};

btn.addEventListener('click', () => {
    // Disable chaos mode if active
    if (chaosInterval) toggleChaosMode();
    toggleGravity();
});

slider.addEventListener('input', (e) => {
    if (chaosInterval) toggleChaosMode(); // Manual override stops chaos
    initAudio();

    const val = parseFloat(e.target.value);
    targetGravity.set(0, val, 0);
    valDisplay.textContent = `${val} m/s²`;

    // Update state based on slider
    if (val > 0 && !isAntiGravity) {
        isAntiGravity = true;
        targetCameraRotationZ = Math.PI;
        btn.textContent = "DEACTIVATE ANTI-GRAVITY";
        btn.classList.add('active');
    } else if (val < 0 && isAntiGravity) {
        isAntiGravity = false;
        targetCameraRotationZ = 0;
        btn.textContent = "ACTIVATE ANTI-GRAVITY";
        btn.classList.remove('active');
    }
    objectsToUpdate.forEach(o => o.body.wakeUp());
});

// Time Scale Logic
timeSlider.addEventListener('input', (e) => {
    timeScale = parseFloat(e.target.value);
    timeValDisplay.textContent = `${timeScale.toFixed(1)}x`;
});

// Chaos Mode Logic
const toggleChaosMode = () => {
    initAudio();

    if (chaosInterval) {
        clearInterval(chaosInterval);
        chaosInterval = null;
        chaosBtn.classList.remove('active');
        chaosBtn.textContent = "CHAOS MODE";
        // Reset to slider value
        targetGravity.set(0, parseFloat(slider.value), 0);
    } else {
        chaosBtn.classList.add('active');
        chaosBtn.textContent = "STOP CHAOS";
        chaosInterval = setInterval(() => {
            const rX = (Math.random() - 0.5) * 20;
            const rY = (Math.random() - 0.5) * 20;
            const rZ = (Math.random() - 0.5) * 20;
            targetGravity.set(rX, rY, rZ);

            // Visual pulse
            bloomPass.strength = 3.0;
            setTimeout(() => bloomPass.strength = 1.5, 200);

            // Audio blip
            if (audioCtx) {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.frequency.setValueAtTime(Math.random() * 1000 + 200, audioCtx.currentTime);
                gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start();
                osc.stop(audioCtx.currentTime + 0.5);
            }

        }, 2000); // Change every 2 seconds
    }
};

chaosBtn.addEventListener('click', toggleChaosMode);

// Reset Objects Logic
const resetBtn = document.getElementById('reset-btn');
resetBtn.addEventListener('click', () => {
    objectsToUpdate.forEach(obj => {
        // Reset Position
        const x = (Math.random() - 0.5) * 10;
        const y = 5 + Math.random() * 5;
        const z = (Math.random() - 0.5) * 10;

        obj.body.position.set(x, y, z);
        obj.body.velocity.set(0, 0, 0);
        obj.body.angularVelocity.set(0, 0, 0);
        obj.body.quaternion.setFromEuler(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );
        obj.body.wakeUp();
    });

    // Also reset gravity to normal if it's too wild?
    // Optional: Keep current gravity state
});

// --- ANIMATION LOOP ---
const clock = new THREE.Clock();
let oldElapsedTime = 0;

// Camera wrapper for smooth rotation
const cameraHolder = new THREE.Group();
scene.add(cameraHolder);
cameraHolder.add(camera);
// controls.object = camera; // OrbitControls controls the camera directly usually, but we want to rotate the world or camera holder?
// Actually, rotating the camera.up or using a holder is better.
// Let's try rotating the Camera Holder 'Z' to simulate rolling upside down.
// BUT OrbitControls fights with custom rotations.
// Strategy: We will rotate the whole SCENE (or everything inside it except lights/camera)??
// No, rotating the camera UP vector is the Three.js way for "Gravity Direction" changes usually.
// Or just animate camera.rotation.z if OrbitControls permits... OrbitControls overrides rotation.
// Fix: We'll tween camera.up to (0, -1, 0)
// Or simpler: We rotate the camera visual only?
// Let's use a "Camera Group" approach where OrbitControls rotates the Camera, and we rotate the Group?
// No, OrbitControls must attach to the object being moved.

// Plan B for Camera:
// We create a `sceneContent` group containing all objects.
// We rotate the `sceneContent` group logic? No, physics issues.
// We will simple rotate the camera.up vector!
// Default up is (0, 1, 0). Anti-gravity up is (0, -1, 0).
let currentUpRange = 0; // 0 to 1 interpolation

const tick = () => {
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - oldElapsedTime;
    oldElapsedTime = elapsedTime;

    // Smooth Gravity Interpolation
    world.gravity.lerp(targetGravity, 0.05, world.gravity);

    // Camera Rotation / Tilt
    // We want to flip the camera 180 degrees around Z axis effectively.
    // OrbitControls makes this hard.
    // Hack: We can interpolate `camera.up.y` from 1 to -1.
    // Three.js OrbitControls respects camera.up.

    const targetY = isAntiGravity ? -1 : 1;
    // Lerp camera.up.y
    camera.up.y += (targetY - camera.up.y) * 0.05;
    camera.lookAt(0, 0, 0); // Re-orient

    // Update Physics (Time Scaled)
    if (timeScale > 0) {
        world.step(1 / 60, deltaTime * timeScale, 3);
    }

    // Sync Meshes with Bodies
    for (const object of objectsToUpdate) {
        object.mesh.position.copy(object.body.position);
        object.mesh.quaternion.copy(object.body.quaternion);
    }

    // Animate Particles (Parallax effect)
    starFields.forEach((stars, index) => {
        stars.rotation.y = elapsedTime * 0.02 * (index + 1) * timeScale;
        stars.rotation.x = elapsedTime * 0.01 * (index + 1) * timeScale;
    });

    // Controls
    controls.update();

    // Render
    // renderer.render(scene, camera);
    composer.render();

    window.requestAnimationFrame(tick);
};

tick();

// --- RESIZE HANDLER ---
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    composer.setSize(window.innerWidth, window.innerHeight);
});
