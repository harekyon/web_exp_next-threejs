"use client";

// basis
import Image from "next/image";
import { useEffect } from "react";

// extension lib
import * as Stats from "stats-js";
import * as dat from "dat.gui";

// three lib
import * as THREE from "three";
import { createMultiMaterialObject } from "../node_modules/three/examples/jsm/utils/SceneUtils.js";
import { OrbitControls } from "../node_modules/three/examples/jsm/controls/OrbitControls.js";

export default function Home() {
  useEffect(() => {
    console.log(OrbitControls);
    // if (canvas) return;
    // canvasを取得
    let stats = initStats();
    let scene = new THREE.Scene();
    // scene.fog = new THREE.Fog(0xffffff, 0.015, 100);
    // scene.overrideMaterial = new THREE.MeshLambertMaterial({
    //   color: 0xffffff,
    // });

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

    console.log(OrbitControls);
    let orbitControls = new OrbitControls(camera, renderer.domElement);
    // orbitControls.autoRotate = true;
    let clock = new THREE.Clock();
    let delta = clock.getDelta();

    let axes = new THREE.AxesHelper(25);
    scene.add(axes);
    let materials = [
      new THREE.MeshLambertMaterial({
        opacity: 0.6,
        color: 0x44ff44,
        transparent: true,
      }),
      new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true }),
    ];
    let planeGeometry = new THREE.PlaneGeometry(50, 50, 1, 1);

    let textureLoader = new THREE.TextureLoader();
    let floorTex = {
      texDiff: textureLoader.load(
        "/laminate_floor_03_2k/textures/laminate_floor_03_diff_2k.jpg",
        THREE.RepeatWrappin,
        THREE.RepeatWrappin
      ),
      texAo: textureLoader.load(
        "/laminate_floor_03_2k/textures/laminate_floor_03_ao_2k.jpg"
      ),
      texNormal: textureLoader.load(
        "/laminate_floor_03_2k/textures/laminate_floor_03_nor_dx_2k.jpg"
      ),
      texDisp: textureLoader.load(
        "/laminate_floor_03_2k/textures/laminate_floor_03_disp_2k.jpg"
      ),
      texRough: textureLoader.load(
        "/laminate_floor_03_2k/textures/laminate_floor_03_rough_2k.jpg"
      ),
    };
    console.log(floorTex.texDiff);
    floorTex.texDiff.wrapS = THREE.RepeatWrapping;
    floorTex.texDiff.wrapT = THREE.RepeatWrapping;
    floorTex.texDiff.repeat = new THREE.Vector2(2, 2);
    floorTex.texDiff.rotation = -0.5 * Math.PI;
    function autoInitTexture(textureObj) {
      textureObj.wrapS = THREE.RepeatWrapping;
      textureObj.wrapT = THREE.RepeatWrapping;
      textureObj.repeat = new THREE.Vector2(2, 2);
      textureObj.rotation = -0.5 * Math.PI;
    }
    autoInitTexture(floorTex.texDiff);
    autoInitTexture(floorTex.texAo);
    autoInitTexture(floorTex.texNormal);
    autoInitTexture(floorTex.texDisp);
    autoInitTexture(floorTex.texRough);

    let wallTex = {
      texDiff: textureLoader.load(
        "/leather_white_2k/textures/leather_white_diff_2k.jpg"
      ),
      texAo: textureLoader.load(
        "/leather_white_2k/textures/leather_white_ao_2k.jpg"
      ),
      texNormal: textureLoader.load(
        "/leather_white_2k/textures/leather_white_nor_gl_2k.jpg"
      ),
      texRough: textureLoader.load(
        "/leather_white_2k/textures/leather_white_rough_2k.jpg"
      ),
    };
    let floorMaterials = new THREE.MeshStandardMaterial({
      map: floorTex.texDiff,
      normalMap: floorTex.texNormal,
      normalScale: new THREE.Vector2(1, -1),
      aoMap: floorTex.texAo,
      displacementMap: floorTex.texDisp,
      roughnessMap: floorTex.texRough,
    });
    let wallMaterials = new THREE.MeshStandardMaterial({
      map: wallTex.texDiff,
      normalMap: wallTex.texNormal,
      normalScale: new THREE.Vector2(1, -1),
      aoMap: wallTex.texAo,
      roughnessMap: wallTex.texRough,
    });
    let floor = new THREE.Mesh(planeGeometry, floorMaterials);
    floor.receiveShadow = true;
    floor.rotation.x = -0.5 * Math.PI;
    floor.position.x = 0;
    floor.position.y = 0;
    floor.position.z = 0;
    scene.add(floor);
    let leftWall = new THREE.Mesh(planeGeometry, wallMaterials);
    leftWall.receiveShadow = true;
    leftWall.rotation.y = -0.5 * Math.PI;
    leftWall.position.x = 25;
    leftWall.position.y = 25;
    leftWall.position.z = 0;
    scene.add(leftWall);
    let rightWall = new THREE.Mesh(planeGeometry, wallMaterials);
    rightWall.receiveShadow = true;
    rightWall.rotation.z = 0.5 * Math.PI;
    rightWall.position.x = 0;
    rightWall.position.y = 25;
    rightWall.position.z = -25;

    scene.add(rightWall);

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
    })();

    let gui = new dat.GUI();
    gui.add(controls, "rotationSpeed", 0, 0.5);

    render();

    function render() {
      stats.update();

      scene.traverse(function (obj) {
        if (obj instanceof THREE.Mesh && obj != floor) {
          obj.rotation.x += controls.rotationSpeed;
          obj.rotation.y += controls.rotationSpeed;
          obj.rotation.z += controls.rotationSpeed;
        }
      });
      orbitControls.update(delta);
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
