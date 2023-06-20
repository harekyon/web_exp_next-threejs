"use client";

// basis
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

// extension lib
import * as Stats from "stats-js";
import GUI from "lil-gui";

// three lib
import * as THREE from "three";
import { orbitControler } from "../Modules/orbitControler.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { RectAreaLightHelper } from "three/addons/helpers/RectAreaLightHelper.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
// import hdr1 from "/public/brown_photostudio_02_1k.hdr";

// original functions
import * as Objects from "../Objects/Structure.js";
import {
  calcRadian,
  textToTextureConvertReturnMesh,
} from "../Modules/tools.js";
import { cameraControler } from "@/Modules/cameraControler.js";

// value

export default function Home() {
  const [select, setSelect] = useState("");
  const sel = useRef("aaa");
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  loader.setDRACOLoader(dracoLoader);

  const display = useRef();

  useEffect(() => {
    // if (canvas) return;
    // canvasを取得
    let stats = initStats();
    let scene = new THREE.Scene();

    let intersectObjects = [];

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
    renderer.shadowMap.type = true;

    document.getElementById("WebGL-output").appendChild(renderer.domElement);

    let orbitControl = orbitControler(camera, renderer);
    let cameraControl = cameraControler(camera);
    cameraControler(camera);

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
    intersectObjects.push(Objects.floor);
    intersectObjects.push(Objects.leftWall);
    intersectObjects.push(Objects.rightWall);

    let plane = textToTextureConvertReturnMesh();
    plane.position.y = 5;
    plane.position.x = 10;
    plane.name = "plane";
    let plane2 = textToTextureConvertReturnMesh();
    plane2.position.y = 10;
    plane2.position.x = -15;
    plane2.scale.set(2, 2, 2);
    plane2.name = "plane";
    scene.add(plane);
    scene.add(plane2);
    let selectObjectText = textToTextureConvertReturnMesh();
    selectObjectText.position.y = 15;
    selectObjectText.position.x = 0;
    selectObjectText.scale.set(3, 3, 3);
    selectObjectText.name = "plane";
    scene.add(selectObjectText);

    let ambientLight = new THREE.AmbientLight(0x444444);
    scene.add(ambientLight);
    // let spotLight = new THREE.SpotLight(0x666666);
    // spotLight.position.set(-20, 30, -5);
    // spotLight.castShadow = true;
    // scene.add(spotLight);
    let pointLight = new THREE.PointLight(0x887788);
    const pointLightHelper = new THREE.PointLightHelper(pointLight, 5);
    // spotLight.position.set(-20, 30, -5);
    pointLightHelper.castShadow = true;

    let rectAreaLight = new THREE.SpotLight(0xffffff);
    rectAreaLight.penumbra = 0.5;
    rectAreaLight.angle = 0.5;
    scene.add(rectAreaLight);
    let rectAreaLightHelper = new THREE.SpotLightHelper(rectAreaLight, 5);
    scene.add(rectAreaLightHelper);

    // scene.add(pointLight);
    // scene.add(pointLightHelper);

    let pointLights = [];
    let pointLightsHelpers = [];
    for (let n = 0; n < 6; n++) {
      pointLights.push(new THREE.SpotLight(0x887788));
      pointLightsHelpers.push(new THREE.SpotLightHelper(pointLights[n], 5));
      pointLights[n].penumbra = 0.8;
      pointLights[n].angle = 0.9;
      pointLights[n].castShadow = true;
      pointLights[n].shadowMapWidth = 2048; // これ!
      pointLights[n].shadowMapHeight = 2048; // これ!
      scene.add(pointLights[n]);
    }
    let testCube = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(testCube, material);
    scene.add(cube);

    // new RGBELoader().load(hdr1, function (texture) {
    //   texture.mapping = THREE.EquirectangularReflectionMapping;
    //   //scene.background = texture;
    //   scene.environment = texture; // 解像度の低いテクスチャを使用
    // });

    const displayWrap = new THREE.Object3D();
    displayWrap.rotation.y = (Math.PI / 180) * -90;
    displayWrap.position.x = 23;
    displayWrap.position.y = 10;
    displayWrap.receiveShadow = true;
    console.log((Math.PI / 360) * 90);
    scene.add(displayWrap);
    loader.load(
      "/display.glb",
      function (gltf) {
        // scene.add(gltf.scene);
        // console.log(gltf.scene);
        const displayObject = gltf.scene;
        displayObject.animations;
        displayObject.scene;
        displayObject.scenes;
        displayObject.cameras;
        displayObject.asset;
        gltf.scene.traverse(function (node) {
          if (node.isMesh) {
            console.log(node.isMesh);
            node.castShadow = true;
          }
        });
        displayWrap.add(displayObject);
      },
      function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      function (error) {
        console.log("An error happend");
      }
    );
    // loader.
    const tableWrap = new THREE.Object3D();
    tableWrap.rotation.y = calcRadian(90);
    tableWrap.position.y = 0.2;
    tableWrap.receiveShadow = true;
    scene.add(tableWrap);
    loader.load(
      "/table.glb",
      function (gltf) {
        // scene.add(gltf.scene);
        // console.log(gltf.scene);
        const tableObject = gltf.scene;
        tableObject.animations;
        tableObject.scene;
        tableObject.scenes;
        tableObject.cameras;
        tableObject.asset;
        gltf.scene.traverse(function (node) {
          if (node.isMesh) {
            console.log(node.isMesh);
            node.castShadow = true;
            node.receiveShadow = true;
          }
        });
        tableWrap.add(tableObject);
      },
      function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      function (error) {
        console.log("An error happend");
      }
    );

    // let controls = new (function () {
    //   this.rotationSpeed = 0.0;
    //   this.statusRotateSpeed = 0.0;
    //   // this.
    // })();
    let RoomLightArray = [];
    for (let n = 0; n < 6; n++) {
      RoomLightArray.push({
        name: `RoomLight${n}`,
        color: 0xffdd9e,
        intensity: 1.0,
        posX: 0,
        posY: 0,
        posZ: 0,
      });
    }

    let controls = {
      RoomLightArray: RoomLightArray,
      RoomLight1Color: 0xffdd9e,
      RoomLight1Intensity: 1.0,
      RoomLight1PosX: 17.0,
      RoomLight1PosY: 39.0,
      RoomLight1PosZ: 15.0,
      myText: "lilGUIだよん",
      myBoolean: true,
      myNumber: 1,
      myFunction: function () {
        console.log("button pushed!");
      },
      myDropDowns: "select1",
      myColor: 0xff0000,
      rectAreaLightPosX: 0,
      rectAreaLightPosY: 0,
      rectAreaLightPosZ: 0,
      rectAreaLightRotX: 0,
      rectAreaLightRotY: 0,
      rectAreaLightRotZ: 0,

      RoomLight0Color: 0xffdd9e,
      RoomLight1Color: 0xffdd9e,
      RoomLight2Color: 0xffdd9e,
      RoomLight3Color: 0xffdd9e,
      RoomLight4Color: 0xffdd9e,
      RoomLight5Color: 0xffdd9e,
      RoomLight0Intensity: 0.4,
      RoomLight1Intensity: 0.4,
      RoomLight2Intensity: 0.4,
      RoomLight3Intensity: 0.4,
      RoomLight4Intensity: 0.4,
      RoomLight5Intensity: 0.4,
      RoomLight0PosX: 17,
      RoomLight1PosX: 0,
      RoomLight2PosX: -17,
      RoomLight3PosX: 17,
      RoomLight4PosX: 0,
      RoomLight5PosX: -17,
      RoomLight0PosY: 50,
      RoomLight1PosY: 50,
      RoomLight2PosY: 50,
      RoomLight3PosY: 50,
      RoomLight4PosY: 50,
      RoomLight5PosY: 50,
      RoomLight0PosZ: -15.0,
      RoomLight1PosZ: -15.0,
      RoomLight2PosZ: -15.0,
      RoomLight3PosZ: 15.0,
      RoomLight4PosZ: 15.0,
      RoomLight5PosZ: 15.0,
    };

    let gui = new GUI();
    const folder = gui.addFolder("lilGUI Practice");
    folder.close();
    folder.add(controls, "myText");
    folder.add(controls, "myBoolean");
    folder.add(controls, "myNumber");
    folder.add(controls, "myFunction");
    folder.add(controls, "myDropDowns", { Slow: 0.1, Normal: 1, Fast: 5 });
    folder.addColor(controls, "myColor");
    const folderArray = [6];
    for (let n = 0; n < 6; n++) {
      folderArray[n] = gui.addFolder(capitalize(`${RoomLightArray[n].name}`));
      folderArray[n].close();
      console.log(folderArray[n]);
      // console.log(`${RoomLightArray[n].name}Color`);
      // console.log(RoomLightArray[n].name);
      folderArray[n].addColor(controls, `${RoomLightArray[n].name}Color`);
      folderArray[n].add(
        controls,
        `${RoomLightArray[n].name}Intensity`,
        0,
        1,
        0.1
      );
      folderArray[n].add(
        controls,
        `${RoomLightArray[n].name}PosX`,
        -50.0,
        50.0,
        0.1
      );
      folderArray[n].add(
        controls,
        `${RoomLightArray[n].name}PosY`,
        -50.0,
        50.0,
        0.1
      );
      folderArray[n].add(
        controls,
        `${RoomLightArray[n].name}PosZ`,
        -50.0,
        50.0,
        0.1
      );
    }
    let rectAreaLightFolder = gui.addFolder("rectAreaLight");
    rectAreaLightFolder.add(controls, "rectAreaLightPosX", -50, 50, 1);
    rectAreaLightFolder.add(controls, "rectAreaLightPosY", -50, 50, 1);
    rectAreaLightFolder.add(controls, "rectAreaLightPosZ", -50, 50, 1);
    rectAreaLightFolder.add(controls, "rectAreaLightRotX", 0, 360, 1);
    rectAreaLightFolder.add(controls, "rectAreaLightRotY", 0, 360, 1);
    rectAreaLightFolder.add(controls, "rectAreaLightRotZ", 0, 360, 1);

    // const roomLightFolder = gui.addFolder("RoomLight1");
    // roomLightFolder.addColor(controls, "RoomLight1Color");
    // roomLightFolder.add(controls, "RoomLight1Intensity", 0, 1, 0.1);
    // roomLightFolder.add(controls, "RoomLight1PosX", -50.0, 50.0, 0.1);
    // roomLightFolder.add(controls, "RoomLight1PosY", -50.0, 50.0, 0.1);
    // roomLightFolder.add(controls, "RoomLight1PosZ", -50.0, 50.0, 0.1);
    console.log(pointLights[5]);
    pointLights[5].castShadow = true;
    // gui.add();
    function capitalize(str) {
      if (typeof str !== "string" || !str) return str;
      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

    render();

    function render() {
      stats.update();
      // planeStatusMesh.rotation.y += controls.statusRotateSpeed;

      orbitControl.instance.update(orbitControler.delta);
      // console.log(cameraControl);
      plane.update(Date.now());
      plane.quaternion.copy(camera.quaternion);
      plane2.update(Date.now());
      plane2.quaternion.copy(camera.quaternion);

      pointLight.color.setHex(controls.RoomLight1Color);
      pointLight.intensity = controls.RoomLight1Intensity;
      pointLight.position.x = controls.RoomLight1PosX;
      pointLight.position.y = controls.RoomLight1PosY;
      pointLight.position.z = controls.RoomLight1PosZ;
      pointLightHelper.position.x = pointLight.position.x;
      pointLightHelper.position.y = pointLight.position.y;
      pointLightHelper.position.z = pointLight.position.z;
      for (let n = 0; n < 6; n++) {
        pointLights[n].color.setHex(controls[eval(`"RoomLight${n}Color"`)]);
        pointLights[n].intensity = controls[eval(`"RoomLight${n}Intensity"`)];
        pointLights[n].position.x = controls[eval(`"RoomLight${n}PosX"`)];
        pointLights[n].position.y = controls[eval(`"RoomLight${n}PosY"`)];
        pointLights[n].position.z = controls[eval(`"RoomLight${n}PosZ"`)];
        pointLightsHelpers[n].position.x = pointLights[n].position.x;
        pointLightsHelpers[n].position.y = pointLights[n].position.y;
        pointLightsHelpers[n].position.z = pointLights[n].position.z;
        scene.add(pointLights[n]);
        scene.add(pointLightsHelpers[n]);
      }
      rectAreaLight.position.set(
        controls.rectAreaLightPosX,
        controls.rectAreaLightPosY,
        controls.rectAreaLightPosZ
      );
      rectAreaLight.rotation.set(
        calcRadian(controls.rectAreaLightRotX),
        calcRadian(controls.rectAreaLightRotY),
        calcRadian(controls.rectAreaLightRotZ)
      );
      rectAreaLightHelper.position.set(
        controls.rectAreaLightPosX,
        controls.rectAreaLightPosY,
        controls.rectAreaLightPosZ
      );
      rectAreaLightHelper.rotation.set(
        calcRadian(controls.rectAreaLightRotX),
        calcRadian(controls.rectAreaLightRotY),
        calcRadian(controls.rectAreaLightRotZ)
      );

      selectObjectText.update(sel.current);
      selectObjectText.quaternion.copy(camera.quaternion);
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

      const intersects = raycaster.intersectObjects(intersectObjects);
      if (intersects.length) {
        console.log(intersects[0].object.name);
        // setSelect(intersects[0].object.name);
        sel.current = intersects[0].object.name;
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
