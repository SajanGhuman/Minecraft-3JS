import * as THREE from "three";
import { OrbitControls } from "@three-ts/orbit-controls";
import { World } from "./world";
import Stats from "three/examples/jsm/libs/stats.module.js";
import { createUI } from "./ui";
import { Player } from "./player";
import { Physics } from "./physics";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const stats = new Stats();
document.body.append(stats.dom);

//renderer setup
const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x80a0e0);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

//camera setup
const orbitCamera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  2000,
);
orbitCamera.position.set(-20, 16, -20);

const controls = new OrbitControls(orbitCamera, renderer.domElement);
controls.target.set(16, 0, 16);
controls.update();

//scene setup
const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x80a0e0, 10, 100);
const world = new World();
world.generate();
scene.add(world);

//villager
const loader = new GLTFLoader();

loader.load(
  "minecraft_-_villager/scene.gltf",
  function (gltf) {
    const model = gltf.scene;
    scene.add(model);
    model.position.set(20, 2.3, 15); // x, y, z position

    // Scale the model
    model.scale.set(0.06, 0.06, 0.06);
  },
  undefined,
  function (error) {
    console.error(error);
  },
);

loader.load(
  "../public/untitled.glb",
  function (gltf) {
    const model = gltf.scene;
    scene.add(model);
    model.position.set(21, 0.4, 15); // x, y, z position

    // Scale the model
    model.scale.set(2, 2, 2);
  },
  undefined,
  function (error) {
    console.error(error);
  },
);

const player = new Player(scene);

const physics = new Physics(scene);

const sun = new THREE.DirectionalLight();
//setup lights
function setupLights() {
  sun.position.set(50, 50, 50);
  sun.castShadow = true;
  sun.shadow.camera.left = -100;
  sun.shadow.camera.right = 100;
  sun.shadow.camera.bottom = -100;
  sun.shadow.camera.top = 100;
  sun.shadow.camera.near = 0.1;
  sun.shadow.camera.far = 200;
  sun.shadow.bias = -0.0001;
  sun.shadow.mapSize = new THREE.Vector2(2048, 2048);
  scene.add(sun);
  scene.add(sun.target);

  const ambient = new THREE.AmbientLight();
  ambient.intensity = 0.1;
  scene.add(ambient);
}

// Chat interaction logic
let chatForm = document.getElementById("chat-form") as HTMLFormElement;
let chatInput = document.getElementById("chat") as HTMLTextAreaElement;
let followText = document.getElementById("follow-text");

if (chatForm) {
  chatForm.addEventListener("submit", async (e: Event) => {
    e.preventDefault();

    // Fetch response from the villager AI
    const question = chatInput.value;
    const response = await getResponse(question);
    console.log(response);

    // Display the villager's response
    if (followText) {
      followText.textContent = response;
    }

    // Clear the input field
    chatInput.value = "";
  });
}
// render loop
let previousTime = performance.now();
function animate() {
  let currentTime = performance.now();
  let dt = (currentTime - previousTime) / 1000;

  requestAnimationFrame(animate);
  if (player.controls.isLocked) {
    physics.update(dt, player, world);
    world.update(player);
    sun.position.copy(player.position);
    sun.position.sub(new THREE.Vector3(-50, -50, -50));
    sun.target.position.copy(player.position);
  }

  renderer.render(
    scene,
    player.controls.isLocked ? player.camera : orbitCamera,
  );
  stats.update();
  previousTime = currentTime;
}

window.addEventListener("resize", () => {
  orbitCamera.aspect = window.innerWidth / window.innerHeight;
  orbitCamera.updateProjectionMatrix();
  player.camera.aspect = window.innerWidth / window.innerHeight;
  player.camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

setupLights();
createUI(scene, world, player);
animate();
