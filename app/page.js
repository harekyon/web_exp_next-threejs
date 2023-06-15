"use client";

import Image from "next/image";
import { useEffect } from "react";
import * as THREE from "three";
import * as Stats from "stats-js";
import * as dat from "dat.gui";

export default function Home() {
  // let canvas = null;
  useEffect(() => {
    // if (canvas) return;
    // canvasを取得
    let stats = initStats();
    let scene = new THREE.Scene();
    // scene.fog = new THREE.Fog(0xffffff, 0.015, 100);
    scene.overrideMaterial = new THREE.MeshLambertMaterial({
      color: 0xffffff,
    });

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
    renderer.setClearColor(new THREE.Color(0xeeeeee));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enable = true;

    document.getElementById("WebGL-output").appendChild(renderer.domElement);

    let planeGeometry = new THREE.PlaneGeometry(50, 50, 1, 1);
    let planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
    let plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true;
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.x = 0;
    plane.position.y = 0;
    plane.position.z = 0;
    scene.add(plane);

    let ambientLight = new THREE.AmbientLight(0x0c0c0c);
    // scene.add(ambientLight);
    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-20, 30, -5);
    spotLight.castShadow = true;
    scene.add(spotLight);

    let controls = new (function () {
      this.rotationSpeed = 0.02;
    })();

    let gui = new dat.GUI();
    gui.add(controls, "rotationSpeed", 0, 0.5);

    render();

    function render() {
      stats.update();

      scene.traverse(function (obj) {
        if (obj instanceof THREE.Mesh && obj != plane) {
          obj.rotation.x += controls.rotationSpeed;
          obj.rotation.y += controls.rotationSpeed;
          obj.rotation.z += controls.rotationSpeed;
        }
      });
      requestAnimationFrame(render);
      renderer.render(scene, camera);
    }

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
    console.log("aaa");
    function onResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
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
