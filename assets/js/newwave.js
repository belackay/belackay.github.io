// Get the canvas element
const canvas = document.getElementById('hero-canvas');

// Create a WebGL renderer
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true }); // alpha makes background transparent
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

renderer.setClearColor(0x000000, 1); // black background

// Create a new scene
const scene = new THREE.Scene();

// Load the texture for the circle
const textureLoader = new THREE.TextureLoader();
const circleTexture = textureLoader.load('assets/images/circle.png');

// Set up a camera with perspective projection
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 100); // Above the grid, looking down
camera.lookAt(0, 0, 0);  
camera.aspect = window.innerWidth / window.innerHeight;
camera.updateProjectionMatrix();

// Handle window resize
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});




// Add ambient light to the scene
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Add a directional light to the scene
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0, 1, 1).normalize();
scene.add(directionalLight);

// Create a grid of points
const gridSize = 50;
const separation = 1.2;
const geometry = new THREE.BufferGeometry();
const positions = [];

for (let x = -gridSize / 2; x < gridSize / 2; x++) {
  for (let y = -gridSize / 2; y < gridSize / 2; y++) {
    positions.push(x * separation, y * separation, 0);
  }
}

geometry.setAttribute(
  'position',
  new THREE.Float32BufferAttribute(positions, 3)
);

// Create a material for the points
const material = new THREE.PointsMaterial({
  color: 0xffffff,
  map: circleTexture,
  size: 0.5,
});

// Create the point cloud
const points = new THREE.Points(geometry, material);
scene.add(points);
points.rotation.x = -Math.PI / 3.5;
//points.rotation.y = Math.PI / 6;


function addStars(count) {
  const starGeometry = new THREE.BufferGeometry();
  const starPositions = [];

  for (let i = 0; i < count; i++) {
    const x = (Math.random() - 0.5) * 200;
    const y = (Math.random() - 0.5) * 200;
    const z = (Math.random() - 0.5) * 200;
    starPositions.push(x, y, z);
  }

  starGeometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(starPositions, 3)
  );

  const r = 0.8 + Math.random() * 0.2;
  const g = 0.8 + Math.random() * 0.2;
  const b = 0.8 + Math.random() * 0.2;
  const starMaterial = new THREE.PointsMaterial({
    color: new THREE.Color(r, g, b),
    size: 0.5,
    map: circleTexture,
    transparent: true,
    opacity: 0.8,
  });

  const stars = new THREE.Points(starGeometry, starMaterial);
  scene.add(stars);
}

addStars(1000);


// Animation loop
function animate(time) {
  requestAnimationFrame(animate);

  const pos = points.geometry.attributes.position.array;
  const count = pos.length / 3;

  for (let i = 0; i < count; i++) {
    const x = pos[i * 3];
    const y = pos[i * 3 + 1];
    const distance = Math.sqrt(x * x + y * y);
    const z = Math.sin(distance - time * 0.005) * 2;
    pos[i * 3 + 2] = z;
  }

  points.geometry.attributes.position.needsUpdate = true;

  // Add rotation animation
  points.rotation.z += 0.002; // spin slowly around z axis

  renderer.render(scene, camera);
}

animate();
