import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { World } from "./world";
import { resources } from "./blocks";
import { Player } from "./player";
import * as THREE from "three";

export function createUI(scene: THREE.Scene, world: World, player: Player) {
  const gui = new GUI();

  const sceneFolder = gui.addFolder("Scene");
  sceneFolder.add(scene.fog, "near", 1, 200, 1).name("Fog Near");
  sceneFolder.add(scene.fog, "far", 1, 200, 1).name("Fog Far");

  const playerFolder = gui.addFolder("Player");
  playerFolder.add(player, "maxSpeed", 1, 20).name("Max Speed");
  playerFolder.add(player.cameraHelper, "visible").name("Show Camera Helper");

  const worldFolder = gui.addFolder("World");
  worldFolder.add(world, "drawDistance", 0, 5, 1).name("Draw Distance");
  worldFolder.add(scene.fog, "near", 1, 200, 1).name("Fog Near");
  worldFolder.add(scene.fog, "far", 1, 200, 1).name("Fog Far");

  const terrainFolder = gui.addFolder("Terrain");
  terrainFolder.add(world.params, "seed", 0, 10000).name("Seed");
  terrainFolder.add(world.params.terrain, "scale", 10, 100).name("Scale");
  terrainFolder.add(world.params.terrain, "magnitude", 0, 1).name("Magnitude");
  terrainFolder.add(world.params.terrain, "offset", 0, 1).name("Offset");

  const resourcesFolder = gui.addFolder("Rescources");

  resources.forEach((resource) => {
    const resourceFolder = resourcesFolder.addFolder(resource.name);
    resourcesFolder.add(resource, "scarcity", 0, 1).name("Scarcity");

    const scaleFolder = resourceFolder.addFolder("Scale");
    scaleFolder.add(resource.scale, "x", 10, 100).name("X Scale");
    scaleFolder.add(resource.scale, "y", 10, 100).name("Y Scale");
    scaleFolder.add(resource.scale, "z", 10, 100).name("Z Scale");
  });

  gui.onChange(() => {
    world.generate();
  });
}
