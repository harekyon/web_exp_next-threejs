"use client";

// basis
import Image from "next/image";
import { useEffect } from "react";

// extension lib
import * as Stats from "stats-js";
import * as dat from "dat.gui";

// three lib
import * as THREE from "three";
import { orbitControler } from "../Modules/orbitControler.js";

// original functions
import * as Objects from "../Objects/Structure.js";
import { textToTextureConvert } from "../Modules/tools.js";

// value

export default function Home() {
  useEffect(() => {
    console.log(textToTextureConvert);
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
    camera.lookAt(scene.position);

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

    let bitmap = document.createElement("canvas");
    let g = bitmap.getContext("2d");
    let text = "nyoooonaaaaaaaaaaa";
    bitmap.width = 200;
    bitmap.height = 200;
    g.font = "Bold 10px Arial";
    g.fillStyle = "white";
    g.fillText(text, 0, 10);
    g.strokeStyle = "black";
    g.strokeText(text, 0, 10);

    let texture = new THREE.Texture(bitmap);
    texture.needsUpdate = true;

    let planeStatusGeometry = new THREE.PlaneGeometry(10, 10, 1, 1);
    let planeStatusMaterial = new THREE.MeshStandardMaterial({
      map: texture,
    });
    let planeStatusMesh = new THREE.Mesh(
      planeStatusGeometry,
      planeStatusMaterial
    );

    const options = {
      fontSize: "10px",
      text: "harepoko",
    };
    scene.add(textToTextureConvert(planeStatusGeometry, options));

    planeStatusMesh.position.y = 5;
    planeStatusMesh.position.x = -10;
    planeStatusMesh.name = "plane";
    scene.add(planeStatusMesh);

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
    })();

    let gui = new dat.GUI();
    gui.add(controls, "rotationSpeed", 0, 0.5);
    gui.add(controls, "statusRotateSpeed", -0.3, 0.3);

    render();

    function render() {
      stats.update();
      planeStatusMesh.rotation.y += controls.statusRotateSpeed;
      scene.traverse(function (obj) {
        if (obj instanceof THREE.Mesh && obj != Objects.floor) {
          obj.rotation.x += controls.rotationSpeed;
          obj.rotation.y += controls.rotationSpeed;
          obj.rotation.z += controls.rotationSpeed;
        }
      });
      orbitControl.instance.update(orbitControler.delta);
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
        console.log(intersects[0].object.name);
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
