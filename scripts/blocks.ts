import * as THREE from "three";

const textureLoader = new THREE.TextureLoader();

function loadTexture(path) {
  const texture = textureLoader.load(path);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.NearestFilter;
  texture.magFilter = THREE.NearestFilter;
  return texture;
}

export interface Block {
  id: number;
  name: string;
  color?: number;
  scale?: { x: number; y: number; z: number };
  scarcity?: number;
  material?: THREE.MeshLambertMaterial[] | THREE.MeshLambertMaterial;
}

const textures = {
  cactusSide: loadTexture("cactus_side.png"),
  cactusTop: loadTexture("cactus_top.png"),
  dirt: loadTexture("dirt.png"),
  grass: loadTexture("grass.png"),
  grassSide: loadTexture("grass_side.png"),
  coalOre: loadTexture("coal_ore.png"),
  ironOre: loadTexture("iron_ore.png"),
  jungleTreeSide: loadTexture("jungle_tree_side.png"),
  jungleTreeTop: loadTexture("jungle_tree_top.png"),
  jungleLeaves: loadTexture("jungle_leaves.png"),
  leaves: loadTexture("leaves.png"),
  treeSide: loadTexture("tree_side.png"),
  treeTop: loadTexture("tree_top.png"),
  sand: loadTexture("sand.png"),
  snow: loadTexture("snow.png"),
  snowSide: loadTexture("snow_side.png"),
  stone: loadTexture("stone.png"),
};

export const blocks: { [key: string]: Block } = {
  empty: {
    id: 0,
    name: "empty",
  },
  grass: {
    id: 1,
    name: "grass",
    color: 0x559020,
    material: [
      new THREE.MeshLambertMaterial({ map: textures.grassSide }), // right
      new THREE.MeshLambertMaterial({ map: textures.grassSide }), // left
      new THREE.MeshLambertMaterial({ map: textures.grass }), // top
      new THREE.MeshLambertMaterial({ map: textures.dirt }), // bottom
      new THREE.MeshLambertMaterial({ map: textures.grassSide }), // front
      new THREE.MeshLambertMaterial({ map: textures.grassSide }), // back
    ],
  },
  dirt: {
    id: 2,
    name: "dirt",
    color: 0x807020,
    material: new THREE.MeshLambertMaterial({ map: textures.dirt }),
  },
  stone: {
    id: 3,
    name: "stone",
    color: 0x808080,
    scale: { x: 30, y: 30, z: 30 },
    scarcity: 0.5,
    material: new THREE.MeshLambertMaterial({ map: textures.stone }),
  },
  coalOre: {
    id: 4,
    name: "coalOre",
    color: 0x202020,
    scale: { x: 20, y: 20, z: 20 },
    scarcity: 0.8,
    material: new THREE.MeshLambertMaterial({ map: textures.coalOre }),
  },
  ironOre: {
    id: 5,
    name: "ironOre",
    color: 0x806060,
    scale: { x: 60, y: 60, z: 60 },
    scarcity: 0.9,
    material: new THREE.MeshLambertMaterial({ map: textures.ironOre }),
  },
};

export const resources = [blocks.stone, blocks.ironOre, blocks.coalOre];
