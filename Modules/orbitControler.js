import * as THREE from "three";
import { OrbitControls } from "../node_modules/three/examples/jsm/controls/OrbitControls.js";

export const orbitControler = (camera, renderer) => {
  let orbitControls = new OrbitControls(camera, renderer.domElement);
  // orbitControls.autoRotate = true;
  let clock = new THREE.Clock();
  let delta = clock.getDelta();
  return { instance: orbitControls, delta: delta };
};
