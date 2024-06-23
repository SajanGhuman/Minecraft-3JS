import * as THREE from "three";
import { SimplexNoise } from "three/examples/jsm/math/SimplexNoise.js";

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshLambertMaterial({ color: 0x00d000 });

export class World extends THREE.Group {
  data: { id: number; instanceId: number | null }[][][] = [];
  size: { width: number; height: number };

  params = {
    terrain: {
      scale: 30,
      magnitude: 0.5,
      offset: 0.2,
    },
  };

  constructor(size = { width: 32, height: 16 }) {
    super();
    this.size = size;
  }

  generate() {
    this.initializeTerrain();
    this.generateTerrain();
    this.generateMeshes();
  }

  initializeTerrain() {
    this.data = [];
    for (let x = 0; x < this.size.width; x++) {
      const slice: { id: number; instanceId: number | null }[][] = [];
      for (let y = 0; y < this.size.height; y++) {
        const row: { id: number; instanceId: number | null }[] = [];
        for (let z = 0; z < this.size.width; z++) {
          row.push({
            id: 0,
            instanceId: null,
          });
        }
        slice.push(row);
      }
      this.data.push(slice);
    }
  }

  generateTerrain() {
    const simplex = new SimplexNoise();
    for (let x = 0; x < this.size.width; x++) {
      for (let z = 0; z < this.size.width; z++) {
        const value = simplex.noise(
          x / this.params.terrain.scale,
          z / this.params.terrain.scale,
        );

        const scaledNoise =
          this.params.terrain.offset + this.params.terrain.magnitude * value;

        let height = Math.floor(this.size.height * scaledNoise);
        height = Math.max(0, Math.min(height, this.size.height - 1));

        for (let y = 0; y <= height; y++) {
          this.setBlockId(x, y, z, 1);
        }
      }
    }
  }

  generateMeshes() {
    this.clear();

    const maxCount = this.size.width * this.size.width * this.size.height;
    const mesh = new THREE.InstancedMesh(geometry, material, maxCount);
    mesh.count = 0;

    const matrix = new THREE.Matrix4();
    for (let x = 0; x < this.size.width; x++) {
      for (let y = 0; y < this.size.height; y++) {
        for (let z = 0; z < this.size.width; z++) {
          const blockId = this.getBlock(x, y, z)?.id;
          const instanceId = mesh.count;

          if (blockId !== 0) {
            matrix.setPosition(x + 0.5, y + 0.5, z + 0.5);
            mesh.setMatrixAt(instanceId, matrix);
            this.setBlockInstanceId(x, y, z, instanceId);
            mesh.count++;
          }
        }
      }
    }
    this.add(mesh);
  }

  getBlock(
    x: number,
    y: number,
    z: number,
  ): { id: number; instanceId: number } | null {
    if (this.inBounds(x, y, z)) {
      return this.data[x][y][z];
    } else {
      return null;
    }
  }

  setBlockId(x: number, y: number, z: number, id: number) {
    if (this.inBounds(x, y, z)) {
      this.data[x][y][z].id = id;
    }
  }

  setBlockInstanceId(x: number, y: number, z: number, instanceId: number) {
    if (this.inBounds(x, y, z)) {
      this.data[x][y][z].instanceId = instanceId;
    }
  }

  inBounds(x: number, y: number, z: number): Boolean {
    if (
      x >= 0 &&
      x < this.size.width &&
      y >= 0 &&
      y < this.size.height &&
      z >= 0 &&
      z < this.size.width
    ) {
      return true;
    } else {
      return false;
    }
  }

  // isBlockObscured(x: number, y: number, z: number) {
  //   const up = this.getBlock(x, y + 1, z)?.id ?? blocks.empty.id;
  //   const down = this.getBlock(x, y - 1, z)?.id ?? blocks.empty.id;
  //   const left = this.getBlock(x + 1, y, z)?.id ?? blocks.empty.id;
  //   const right = this.getBlock(x - 1, y, z)?.id ?? blocks.empty.id;
  //   const forward = this.getBlock(x, y, z + 1)?.id ?? blocks.empty.id;
  //   const back = this.getBlock(x, y, z - 1)?.id ?? blocks.empty.id;
  //
  //   // If any of the block's sides is exposed, it is not obscured
  //   if (
  //     up === blocks.empty.id ||
  //     down === blocks.empty.id ||
  //     left === blocks.empty.id ||
  //     right === blocks.empty.id ||
  //     forward === blocks.empty.id ||
  //     back === blocks.empty.id
  //   ) {
  //     return false;
  //   } else {
  //     return true;
  //   }
  // }
  //
  // disposeChildren() {
  //   this.traverse((obj) => {
  //     if (obj.dispose) obj.dispose();
  //   });
  //   this.clear();
  // }
}
