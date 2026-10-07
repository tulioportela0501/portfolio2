// ============================================
// CLÍNICA PORTELA — INTERAÇÕES DA DEMONSTRAÇÃO
// ============================================

const WHATSAPP = "5598991252339";
const MESSAGE = "Olá! Vim pelo site da Clínica Portela e gostaria de saber mais sobre a clínica.";

document.querySelectorAll("[data-whatsapp]").forEach((link) => {
  link.href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(MESSAGE)}`;
  link.target = "_blank";
  link.rel = "noopener";
});

// Header com efeito de scroll
const header = document.getElementById("header");
window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 30);
}, { passive: true });

// Menu mobile
const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");
menuBtn.addEventListener("click", () => nav.classList.toggle("open"));
nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => nav.classList.remove("open")));

// Reveal das seções
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add("visible");
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

// ============================================
// OBJETO 3D PROCEDURAL COM THREE.JS
// Não precisa de arquivo GLB.
// ============================================

const container = document.getElementById("scene3d");

if (window.THREE && container && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    35,
    container.clientWidth / container.clientHeight,
    0.1,
    100
  );
  camera.position.set(0, 0.2, 6.5);

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: "high-performance"
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.outputEncoding = THREE.sRGBEncoding;
  container.appendChild(renderer.domElement);

  // Luzes suaves
  const ambient = new THREE.AmbientLight(0xcddbd2, 1.7);
  scene.add(ambient);

  const keyLight = new THREE.PointLight(0xd9fff0, 4, 10);
  keyLight.position.set(2.5, 2.5, 4);
  scene.add(keyLight);

  const rimLight = new THREE.PointLight(0x9ab9aa, 3, 9);
  rimLight.position.set(-3, -1, 2);
  scene.add(rimLight);

  // Grupo principal
  const group = new THREE.Group();
  scene.add(group);

  // Esfera central translúcida
  const sphereGeometry = new THREE.IcosahedronGeometry(1.28, 4);
  const sphereMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xbccdc3,
    metalness: 0.12,
    roughness: 0.18,
    transmission: 0.18,
    transparent: true,
    opacity: 0.72,
    clearcoat: 0.8
  });

  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  group.add(sphere);

  // Núcleo interno
  const core = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.52, 2),
    new THREE.MeshStandardMaterial({
      color: 0xf1f4ef,
      emissive: 0x53675d,
      emissiveIntensity: 0.8,
      metalness: 0.35,
      roughness: 0.2
    })
  );
  group.add(core);

  // Anéis tecnológicos
  const ringMaterial = new THREE.MeshBasicMaterial({
    color: 0xdbe7df,
    transparent: true,
    opacity: 0.42
  });

  const ring1 = new THREE.Mesh(
    new THREE.TorusGeometry(1.62, 0.012, 10, 120),
    ringMaterial
  );
  ring1.rotation.x = Math.PI / 2.7;
  group.add(ring1);

  const ring2 = new THREE.Mesh(
    new THREE.TorusGeometry(1.85, 0.008, 10, 120),
    ringMaterial
  );
  ring2.rotation.x = -Math.PI / 3;
  ring2.rotation.z = Math.PI / 5;
  group.add(ring2);

  // Pequenos pontos orbitais
  const dotGeometry = new THREE.SphereGeometry(0.035, 12, 12);
  const dotMaterial = new THREE.MeshBasicMaterial({ color: 0xe6f0e9 });

  const dots = [];
  for (let i = 0; i < 9; i++) {
    const dot = new THREE.Mesh(dotGeometry, dotMaterial);
    const angle = (i / 9) * Math.PI * 2;
    dot.userData.angle = angle;
    dot.userData.radius = 1.95 + (i % 2) * 0.22;
    dot.userData.speed = 0.18 + (i % 3) * 0.025;
    group.add(dot);
    dots.push(dot);
  }

  // Resposta ao mouse
  let targetX = 0;
  let targetY = 0;
  let mouseX = 0;
  let mouseY = 0;

  window.addEventListener("pointermove", (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = (event.clientY / window.innerHeight) * 2 - 1;
    targetX = mouseX * 0.28;
    targetY = mouseY * 0.18;
  }, { passive: true });

  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const t = clock.getElapsedTime();

    group.rotation.y += 0.0027;
    group.rotation.x = Math.sin(t * 0.45) * 0.08;
    group.position.y = Math.sin(t * 0.75) * 0.08;

    group.rotation.y += (targetX - group.rotation.y) * 0.0008;
    group.rotation.x += (targetY - group.rotation.x) * 0.0008;

    sphere.rotation.x = t * 0.08;
    sphere.rotation.z = t * 0.055;
    core.rotation.y = -t * 0.18;

    ring1.rotation.z = t * 0.18;
    ring2.rotation.y = t * 0.12;

    dots.forEach((dot, i) => {
      const a = dot.userData.angle + t * dot.userData.speed;
      const r = dot.userData.radius;
      dot.position.set(
        Math.cos(a) * r,
        Math.sin(a * 1.15) * 0.7,
        Math.sin(a) * r * 0.55
      );
    });

    renderer.render(scene, camera);
  }

  animate();

  function resize() {
    const width = container.clientWidth;
    const height = container.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  window.addEventListener("resize", resize);
}
