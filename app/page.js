"use client";

// basis
import Image from "next/image";
import { useEffect, useState } from "react";

// extension lib
import * as Stats from "stats-js";
import * as dat from "dat.gui";

// three lib
import * as THREE from "three";
import { orbitControler } from "../Modules/orbitControler.js";

// original functions
import * as Objects from "../Objects/Structure.js";
import { textToTextureConvertReturnMesh } from "../Modules/tools.js";

// value

export default function Home() {
  const [select, setSelect] = useState("WELCOME");
  useEffect(() => {
    // if (canvas) return;
    // canvasを取得
    let stats = initStats();
    let scene = new THREE.Scene();

    let camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    scene.add(camera);
    camera.position.x = -30;
    camera.position.y = 40;
    camera.position.z = 30;
    // camera.lookAt(scene.position);

    let renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(0x010103));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enable = true;

    document.getElementById("WebGL-output").appendChild(renderer.domElement);

    let orbitControl = orbitControler(camera, renderer);

    let axes = new THREE.AxesHelper(10);
    scene.add(axes);
    // let materials = [
    //   new THREE.MeshLambertMaterial({
    //     opacity: 0.6,
    //     color: 0x44ff44,
    //     transparent: true,
    //   }),
    //   new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true }),
    // ];

    scene.add(Objects.floor);
    scene.add(Objects.leftWall);
    scene.add(Objects.rightWall);

    let plane = textToTextureConvertReturnMesh();
    plane.position.y = 5;
    plane.position.x = -10;
    plane.name = "plane";
    let plane2 = textToTextureConvertReturnMesh();
    plane2.position.y = 10;
    plane2.position.x = -15;
    plane2.scale.set(2, 2, 2);
    plane2.name = "plane";
    scene.add(plane);
    scene.add(plane2);
    let selectObjectText = textToTextureConvertReturnMesh();
    selectObjectText.position.y = 10;
    selectObjectText.position.x = -15;
    selectObjectText.scale.set(2, 2, 2);
    selectObjectText.name = "plane";
    scene.add(selectObjectText);

    let ambientLight = new THREE.AmbientLight(0x444444);
    scene.add(ambientLight);
    let spotLight = new THREE.SpotLight(0x555555);
    spotLight.position.set(-20, 30, -5);
    spotLight.castShadow = true;
    scene.add(spotLight);
    let pointLight = new THREE.PointLight(0x444444);
    spotLight.position.set(-20, 30, -5);
    pointLight.castShadow = true;
    scene.add(pointLight);

    let controls = new (function () {
      this.rotationSpeed = 0.0;
      this.statusRotateSpeed = 0.0;
      this.textValue = 0;
    })();

    let gui = new dat.GUI();
    gui.add(controls, "rotationSpeed", 0, 0.5);
    gui.add(controls, "statusRotateSpeed", -0.3, 0.3);
    gui.add(controls, "textValue", -1000000, 1000000);

    render();

    function render() {
      stats.update();
      // planeStatusMesh.rotation.y += controls.statusRotateSpeed;
      scene.traverse(function (obj) {
        if (obj instanceof THREE.Mesh && obj != Objects.floor) {
          obj.rotation.x += controls.rotationSpeed;
          obj.rotation.y += controls.rotationSpeed;
          obj.rotation.z += controls.rotationSpeed;
        }
      });
      orbitControl.instance.update(orbitControler.delta);
      plane.update(Date.now());
      plane.quaternion.copy(camera.quaternion);
      plane2.update(Date.now());
      plane2.quaternion.copy(camera.quaternion);
      selectObjectText.update(select);
      selectObjectText.quaternion.copy(camera.quaternion);
      console.log(select);
      requestAnimationFrame(render);
      renderer.render(scene, camera);
    }

    window.addEventListener("click", onPointerMove);

    function initStats() {
      let stats = new Stats();
      stats.setMode(0);

      stats.domElement.style.position = "absolute";
      stats.domElement.style.left = "0px";
      stats.domElement.style.ltop = "0px";
      document.getElementById("Stats-output").appendChild(stats.domElement);

      return stats;
    }
    window.addEventListener("resize", onResize, false);

    function onResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function onPointerMove(e) {
      const raycaster = new THREE.Raycaster();
      const vector = new THREE.Vector2(
        (e.clientX / window.innerWidth) * 2 - 1,
        (e.clientY / window.innerHeight) * -2 + 1
      );
      raycaster.setFromCamera(vector, camera);

      const intersects = raycaster.intersectObjects(scene.children);
      if (intersects.length) {
        // console.log(intersects[0].object.name);
        setSelect(intersects[0].object.name);
        if (intersects[0].object.log) {
          window.clearTimeout(timer);
          timer = window.setTimeout(() => intersects[0].object.log(""), 100);
          intersects[0].object.log("click");
        }
      }
      console.log("run");
    }
  }, []);
  return (
    <>
      <div id="Stats-output"></div>
      <div id="WebGL-output"></div>
      {/* <canvas id="canvas"></canvas> */}
    </>
  );
}
