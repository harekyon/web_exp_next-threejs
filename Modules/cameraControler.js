import * as THREE from "three";
import { OrbitControls } from "../node_modules/three/examples/jsm/controls/OrbitControls.js";

let rot = 0;
export const cameraControler = (camera, renderer) => {
  const radian = (rot * Math.PI) / 180;
  const calcRadian = (rot) => {
    return (rot * Math.PI) / 180;
  };
  document.addEventListener("keypress", keypress_event);
  let result = null;
  function keypress_event(e) {
    console.log(e.code);
    console.log(camera);
    let code = e.code;
    switch (code) {
      case "Numpad7":
        camera.position.x = 0;
        camera.position.y = 200;
        console.log(camera.rotation);
        camera.lookAt(new THREE.Vector3(0, 0, 0));
      default:
    }
    // camera.position = new THREE.Vector3(0, 0, 0);
    result = e;
  }
  //   document.removeEventListener("keypress", keypress_event);
  return result;
};
