import * as THREE from "three";
import { OrbitControls } from "@three-ts/orbit-controls";
import { World } from "./world";
import Stats from "three/examples/jsm/libs/stats.module.js";
import { createUI } from "./ui";

const stats = new Stats();
document.body.append(stats.dom);

//renderer setup
const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x80a0e0);
document.body.appendChild(renderer.domElement);

//camera setup
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  2000,
);
camera.position.set(-20, 16, -20);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(16, 0, 16);
controls.update();

//scene setup
const scene = new THREE.Scene();
const world = new World();
world.generate();
scene.add(world);

//setup lights
function setupLights() {
  const light1 = new THREE.DirectionalLight();
  light1.position.set(-1, 1, -0.5);
  scene.add(light1);

  const light2 = new THREE.DirectionalLight();
  light2.position.set(1, 1, 1);
  scene.add(light2);

  const ambient = new THREE.AmbientLight();
  ambient.intensity = 0.1;
  scene.add(ambient);
}

// render loop
function animate() {
  requestAnimationFrame(animate);
  // cube.rotation.x += 0.01;
  // cube.rotation.y += 0.01;
  renderer.render(scene, camera);
  stats.update();
}

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

setupLights();
createUI(world);
animate();
