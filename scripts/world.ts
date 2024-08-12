import * as THREE from "three";
import { WorldChunk } from "./worldChunk";
import { Player } from "./player";

export class World extends THREE.Group {
  asyncLoading = true;
  drawDistance = 2;
  chunkSize = { width: 16, height: 16 };
  params = {
    seed: 1,
    terrain: {
      scale: 20,
      magnitude: 0.1,
      offset: 0,
    },
  };

  constructor(seed = 0) {
    super();
    this.seed = seed;
  }

  generate() {
    this.disposeChunks();
    for (let x = -this.drawDistance; x <= this.drawDistance; x++) {
      for (let z = -this.drawDistance; z <= this.drawDistance; z++) {
        const chunk = new WorldChunk(this.chunkSize, this.params);
        chunk.position.set(
          x * this.chunkSize.width,
          0,
          z * this.chunkSize.width,
        );
        chunk.userData = { x, z };
        chunk.generate();
        this.add(chunk);
      }
    }
  }

  update(player: Player) {
    const visibleChunks = this.getVisibleChunks(player);
    const chunksToAdd = this.getChunksToAdd(visibleChunks);
    this.removeUnusedChunks(visibleChunks);

    for (const chunk of chunksToAdd) {
      this.generateChunk(chunk.x, chunk.z);
    }
  }

  getVisibleChunks(player: Player) {
    const visibleChunks = [];

    const coords = this.worldToChunkCoords(
      player.position.x,
      player.position.y,
      player.position.z,
    );

    const chunkX = coords.chunk.x;
    const chunkZ = coords.chunk.z;

    for (
      let x = chunkX - this.drawDistance;
      x <= chunkX + this.drawDistance;
      x++
    ) {
      for (
        let z = chunkZ - this.drawDistance;
        z <= chunkZ + this.drawDistance;
        z++
      ) {
        visibleChunks.push({ x, z });
      }
    }
    return visibleChunks;
  }

  getChunksToAdd(visibleChunks) {
    // Filter down the visible chunks to those not already in the world
    return visibleChunks.filter((chunk) => {
      const chunkExists = this.children
        .map((obj) => obj.userData)
        .find(({ x, z }) => chunk.x === x && chunk.z === z);

      return !chunkExists;
    });
  }

  removeUnusedChunks(visibleChunks) {
    // Filter down the visible chunks to those not already in the world
    const chunksToRemove = this.children.filter((chunk) => {
      const { x, z } = chunk.userData;
      const chunkExists = visibleChunks.find(
        (visibleChunk) => visibleChunk.x === x && visibleChunk.z === z,
      );

      return !chunkExists;
    });

    for (const chunk of chunksToRemove) {
      chunk.disposeInstances();
      this.remove(chunk);
      console.log(
        `Removing chunk at X: ${chunk.userData.x} Z: ${chunk.userData.z}`,
      );
    }
  }

  generateChunk(x, z) {
    const chunk = new WorldChunk(this.chunkSize, this.params);
    chunk.position.set(x * this.chunkSize.width, 0, z * this.chunkSize.width);
    chunk.userData = { x, z };
    if (this.asyncLoading) {
      requestIdleCallback(chunk.generate.bind(chunk), { timeout: 1000 });
    } else {
      chunk.generate();
    }
    this.add(chunk);
  }

  getBlock(x: number, y: number, z: number) {
    const coords = this.worldToChunkCoords(x, y, z);
    const chunk = this.getChunk(coords.chunk.x, coords.chunk.z);

    if (chunk && chunk.loaded) {
      return chunk.getBlock(coords.block.x, coords.block.y, coords.block.z);
    } else {
      return null;
    }
  }

  getChunk(chunkX, chunkZ) {
    return this.children.find((chunk) => {
      return chunk.userData.x === chunkX && chunk.userData.z === chunkZ;
    });
  }

  disposeChunks() {
    this.traverse((chunk) => {
      if (chunk.disposeInstances) {
        chunk.disposeInstances();
      }
    });
    this.clear();
  }

  worldToChunkCoords(x, y, z) {
    const chunkCoords = {
      x: Math.floor(x / this.chunkSize.width),
      z: Math.floor(z / this.chunkSize.width),
    };
    const blockCoords = {
      x: x - this.chunkSize.width * chunkCoords.x,
      y,
      z: z - this.chunkSize.width * chunkCoords.z,
    };

    return {
      chunk: chunkCoords,
      block: blockCoords,
    };
  }
}
