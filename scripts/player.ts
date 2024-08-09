import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";

export class Player {
  camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.1,
    200,
  );
  controls = new PointerLockControls(this.camera, document.body);

  constructor(scene: THREE.Scene) {
    this.camera.position.set(32, 16, 32);
    scene.add(this.camera);
  }

  get position(): THREE.Vector3 {
    return this.camera.position;
  }
}
