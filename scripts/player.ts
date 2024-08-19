import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";

export class Player {
  radius = 0.5;
  height = 1.75;
  jumpSpeed = 10;
  onGround = false;

  maxSpeed = 10;
  input = new THREE.Vector3();
  velocity = new THREE.Vector3();
  #worldVelocity = new THREE.Vector3();
  camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.1,
    200,
  );
  controls = new PointerLockControls(this.camera, document.body);
  cameraHelper = new THREE.CameraHelper(this.camera);

  villagerPosition = new THREE.Vector3(20, 2.3, 15); // Define villager position
  isNearVillager = false; // Track if the player is near the villager

  constructor(scene: THREE.Scene) {
    this.camera.position.set(20, 16, 20);
    scene.add(this.camera);
    scene.add(this.cameraHelper);

    document.addEventListener("keydown", this.onKeyDown.bind(this));
    document.addEventListener("keyup", this.onKeyUp.bind(this));

    this.boundsHelper = new THREE.Mesh(
      new THREE.CylinderGeometry(this.radius, this.radius, this.height, 16),
      new THREE.MeshBasicMaterial({ wireframe: true }),
    );
    scene.add(this.boundsHelper);
  }

  get worldVelocity() {
    this.#worldVelocity.copy(this.velocity);
    this.#worldVelocity.applyEuler(
      new THREE.Euler(0, this.camera.rotation.y, 0),
    );
    return this.#worldVelocity;
  }

  applyWorldDeltaVelocity(dv: THREE.Vector3) {
    dv.applyEuler(new THREE.Euler(0, -this.camera.rotation.y, 0));
    this.velocity.add(dv);
  }

  applyInputs(dt: number) {
    if (this.controls.isLocked) {
      this.velocity.x = this.input.x;
      this.velocity.z = this.input.z;
      this.controls.moveRight(this.velocity.x * dt);
      this.controls.moveForward(this.velocity.z * dt);
      this.position.y += this.velocity.y * dt;

      document.getElementById("player-position")!.innerHTML = this.toString();

      // Check if the player is near the villager
      this.isNearVillager = this.isPlayerNearVillager(
        this.position,
        this.villagerPosition,
      );
    }
  }

  updateBoundsHelper() {
    this.boundsHelper.position.copy(this.position);
    this.boundsHelper.position.y -= this.height / 2;
  }

  get position(): THREE.Vector3 {
    return this.camera.position;
  }

  onKeyDown(event: KeyboardEvent) {
    const chatForm = document.getElementById("chat-form");

    if (chatForm && chatForm.style.display === "block") {
      // Do nothing if chatbox is visible
      return;
    }

    if (!this.controls.isLocked) {
      this.controls.lock();
    }
    switch (event.code) {
      case "KeyW":
        this.input.z = this.maxSpeed;
        break;
      case "KeyA":
        this.input.x = -this.maxSpeed;
        break;
      case "KeyS":
        this.input.z = -this.maxSpeed;
        break;
      case "KeyD":
        this.input.x = this.maxSpeed;
        break;
      case "KeyR":
        this.position.set(16, 30, 16);
        break;
      case "Space":
        if (this.onGround) {
          this.velocity.y += this.jumpSpeed;
        }
        break;
      case "KeyF":
        // Trigger the action if near the villager
        if (this.isNearVillager) {
          this.talkToVillager();
        }
        break;
    }
  }

  onKeyUp(event: KeyboardEvent) {
    switch (event.code) {
      case "KeyW":
        this.input.z = 0;
        break;
      case "KeyA":
        this.input.x = 0;
        break;
      case "KeyS":
        this.input.z = 0;
        break;
      case "KeyD":
        this.input.x = 0;
        break;
    }
  }

  toString() {
    return `X: ${this.position.x.toFixed(3)} Y: ${this.position.y.toFixed(3)} Z: ${this.position.z.toFixed(3)}`;
  }

  isPlayerNearVillager(
    playerPosition: THREE.Vector3,
    villagerPosition: THREE.Vector3,
    threshold: number = 7, // Increased proximity
  ): boolean {
    const distance = playerPosition.distanceTo(villagerPosition);
    return distance <= threshold;
  }

  talkToVillager() {
    const chatForm = document.getElementById("chat-form");
    if (chatForm) {
      chatForm.style.display =
        chatForm.style.display === "none" || chatForm.style.display === ""
          ? "block"
          : "none";
    }
  }
}
