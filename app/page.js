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
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
// import hdr1 from "/public/brown_photostudio_02_1k.hdr";

// original functions
import { calcRadian } from "/Modules/tools.js";
import { textToTextureConvertReturnMesh } from "/Modules/tools.js";
import { cameraControler } from "@/Modules/cameraControler.js";
import { exportGltf } from "@/Modules/tools.js";
import { simpleAnnotation } from "@/Modules/annotation.js";
import * as Tools from "../Modules/tools";

const mode = "";

export default function Home() {
  const sel = useRef("aaa");
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  loader.setDRACOLoader(dracoLoader);
  //objs: returnHoverObj関数で使用。hoverしたMeshを返してくれる
  const objs = useRef("");
  useEffect(() => {
    let stats = initStats();
    let scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x000000, 50, 2000);
    let camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    // camera.position.x = -30;
    // camera.position.y = 40;
    // camera.position.z = 30;
    camera.position.x = -30;
    camera.position.y = 60;
    camera.position.z = 10;
    camera.lookAt(scene.position);
    scene.add(camera);

    let renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(0x000000));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.toneMapping = THREE.ReinhardToneMapping;
    renderer.toneMappingExposure = 0.2;
    renderer.domElement.id = "main-canvas";

    let intersectObjects = [];
    let orbitControl = orbitControler(camera, renderer);
    cameraControler(camera);
    let axes = new THREE.AxesHelper(10);
    scene.add(axes);

    let planeGeometry = new THREE.PlaneGeometry(42, 42, 1, 1);
    let textureLoader = new THREE.TextureLoader();
    let floorTex = {
      texDiff: textureLoader.load(
        "/laminate_floor_03_2k/textures/laminate_floor_03_diff_2k.jpg"
      ),
      texAo: textureLoader.load(
        "/laminate_floor_03_2k/textures/laminate_floor_03_ao_2k.jpg"
      ),
      texNormal: textureLoader.load(
        "/laminate_floor_03_2k/textures/laminate_floor_03_nor_dx_2k.jpg"
      ),
      texRough: textureLoader.load(
        "/laminate_floor_03_2k/textures/laminate_floor_03_rough_2k.jpg"
      ),
    };
    floorTex.texDiff.wrapS = THREE.RepeatWrapping;
    floorTex.texDiff.wrapT = THREE.RepeatWrapping;
    floorTex.texDiff.repeat = new THREE.Vector2(2, 2);
    floorTex.texDiff.rotation = -0.5 * Math.PI;
    Tools.autoInitTexture(floorTex.texDiff);
    Tools.autoInitTexture(floorTex.texAo);
    Tools.autoInitTexture(floorTex.texNormal);
    Tools.autoInitTexture(floorTex.texRough);

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
    floor.name = "floor";
    floor.castShadow = true;
    floor.receiveShadow = true;
    let leftWall = new THREE.Mesh(planeGeometry, wallMaterials);
    leftWall.receiveShadow = true;
    leftWall.rotation.z = 0.5 * Math.PI;
    leftWall.position.x = 0;
    leftWall.position.y = 21;
    leftWall.position.z = -21;
    leftWall.name = "leftWall";
    let rightWall = new THREE.Mesh(planeGeometry, wallMaterials);
    rightWall.receiveShadow = true;
    rightWall.rotation.y = -0.5 * Math.PI;
    rightWall.position.x = 21;
    rightWall.position.y = 21;
    rightWall.position.z = 0;
    rightWall.name = "rightWall";
    let frontWall = new THREE.Mesh(planeGeometry, wallMaterials);
    frontWall.receiveShadow = true;
    frontWall.rotation.y = -Math.PI;
    frontWall.position.x = 0;
    frontWall.position.y = 21;
    frontWall.position.z = 21;
    frontWall.name = "frontWall";
    scene.add(floor);
    scene.add(leftWall);
    scene.add(rightWall);
    // scene.add(frontWall);

    intersectObjects.push(floor);
    intersectObjects.push(leftWall);
    intersectObjects.push(rightWall);

    let plane = textToTextureConvertReturnMesh();
    plane.position.y = 5;
    plane.position.x = 10;
    plane.name = "plane";
    let plane2 = textToTextureConvertReturnMesh();
    plane2.position.y = 10;
    plane2.position.x = -15;
    plane2.scale.set(2, 2, 2);
    plane2.name = "plane";
    // scene.add(plane);
    // scene.add(plane2);
    let selectObjectText = textToTextureConvertReturnMesh();
    selectObjectText.position.y = 15;
    selectObjectText.position.x = 0;
    selectObjectText.scale.set(3, 3, 3);
    selectObjectText.name = "plane";
    // scene.add(selectObjectText);

    const displayObj = exportGltf({
      glbPath: `${
        mode === "PRODUCT" ? "/threePractice/display.glb" : "/display.glb"
      }`,
    });
    displayObj.rotation.y = (Math.PI / 180) * -90;
    displayObj.position.set(20, 10, 0);
    displayObj.receiveShadow = true;
    scene.add(displayObj);

    // const tableObj = exportGltf({ glbPath: "/table.glb" });
    const tableObj = exportGltf({
      glbPath: mode === "PRODUCT" ? "/threePractice/table.glb" : "/table.glb",
    });
    tableObj.rotation.y = calcRadian(90);
    tableObj.position.y = 0.2;
    tableObj.receiveShadow = true;
    scene.add(tableObj);

    // const artObj = exportGltf({ glbPath: "/art.glb" });
    const artObj = exportGltf({
      glbPath: mode === "PRODUCT" ? "/threePractice/art.glb" : "/art.glb",
    });
    artObj.rotation.y = calcRadian(-90);
    artObj.position.set(-4, 5, -20.4);
    artObj.scale.set(0.9, 0.9, 0.9);
    artObj.receiveShadow = true;
    scene.add(artObj);
    const artGlassObj = exportGltf({
      glbPath: "/art_glass.glb",
      transparent: true,
    });
    artGlassObj.rotation.y = calcRadian(-90);
    artGlassObj.position.set(-4, 5, -20.4);
    artGlassObj.scale.set(0.9, 0.9, 0.9);
    artGlassObj.receiveShadow = true;
    scene.add(artGlassObj);

    // const pypeObj = exportGltf({ glbPath: "/pype.glb" });
    const pypeObj = exportGltf({
      glbPath: mode === "PRODUCT" ? "/threePractice/pype.glb" : "/pype.glb",
    });
    pypeObj.rotation.y = calcRadian(89);
    pypeObj.position.y = 0.2;
    pypeObj.position.set(-12, 0.2, -18);
    pypeObj.receiveShadow = true;
    scene.add(pypeObj);

    // const rackObj = exportGltf({ glbPath: "/rack.glb" });
    const rackObj = exportGltf({
      glbPath: mode === "PRODUCT" ? "/threePractice/rack.glb" : "/rack.glb",
    });
    rackObj.rotation.y = calcRadian(89);
    rackObj.position.y = 0.2;
    rackObj.position.set(14, 0.2, -19);
    rackObj.receiveShadow = true;
    scene.add(rackObj);

    // const awardWallObj = exportGltf({
    //   glbPath: "/award.glb",
    // });
    const awardWallObj = exportGltf({
      glbPath: mode === "PRODUCT" ? "/threePractice/award.glb" : "/award.glb",
    });
    awardWallObj.rotation.y = calcRadian(90);
    awardWallObj.position.set(0, -0.4, 23.5);
    awardWallObj.scale.y = 1.01;
    awardWallObj.receiveShadow = true;
    scene.add(awardWallObj);
    // const awardWallGlassObj = exportGltf({
    //   glbPath: "/award_glass.glb",
    //   transparent: true,
    // });
    const awardWallGlassObj = exportGltf({
      glbPath:
        mode === "PRODUCT"
          ? "/threePractice/award_glass.glb"
          : "/award_glass.glb",
      transparent: true,
    });
    awardWallGlassObj.rotation.y = calcRadian(90);
    awardWallGlassObj.position.set(0, 0, 23.5);
    awardWallGlassObj.receiveShadow = true;
    // scene.add(awardWallGlassObj);
    // const book1 = exportGltf({ glbPath: "/book.glb" });
    const book1 = exportGltf({
      glbPath: mode === "PRODUCT" ? "/threePractice/book.glb" : "/book.glb",
    });
    book1.receiveShadow = true;
    book1.position.set(0, 8.28, 0);
    book1.rotation.set(0, calcRadian(74), 0);
    book1.name = "redbook";
    console.log(book1);
    scene.add(book1);

    // const book2 = exportGltf({ glbPath: "/book.glb" });
    const book2 = exportGltf({
      glbPath: mode === "PRODUCT" ? "/threePractice/book.glb" : "/book.glb",
    });
    book2.receiveShadow = true;
    book2.position.set(4, 8.28, -5);
    book2.rotation.set(0, calcRadian(74), 0);
    book2.name = "bluebook";
    scene.add(book2);

    const chairWhite = [];
    for (let n = 0; n < 3; n++) {
      // chairWhite[n] = exportGltf({ glbPath: "/cheir_white.glb" });
      chairWhite[n] = exportGltf({
        glbPath:
          mode === "PRODUCT"
            ? "/threePractice/cheir_white.glb"
            : "/cheir_white.glb",
      });
      chairWhite[n].receiveShadow = true;
      scene.add(chairWhite[n]);
    }
    const chairBlack = [];
    for (let n = 0; n < 3; n++) {
      // chairBlack[n] = exportGltf({ glbPath: "/cheir_black.glb" });
      chairBlack[n] = exportGltf({
        glbPath:
          mode === "PRODUCT"
            ? "/threePractice/cheir_black.glb"
            : "/cheir_black.glb",
      });
      chairBlack[n].receiveShadow = true;
      scene.add(chairBlack[n]);
    }
    chairWhite[0].rotation.y = calcRadian(85);
    chairWhite[0].position.set(0, -0.4, 7);
    chairWhite[0].scale.set(1.1, 1.1, 1.1);
    chairBlack[0].rotation.y = calcRadian(95);
    chairBlack[0].position.set(-9, -0.4, 6.5);
    chairBlack[0].scale.set(1.1, 1.1, 1.1);
    chairBlack[1].rotation.y = calcRadian(80);
    chairBlack[1].position.set(9, -0.4, 6);
    chairBlack[1].scale.set(1.1, 1.1, 1.1);

    chairBlack[2].rotation.y = calcRadian(-93);
    chairBlack[2].position.set(0, -0.4, -7);
    chairBlack[2].scale.set(1.1, 1.1, 1.1);
    chairWhite[1].rotation.y = calcRadian(-95);
    chairWhite[1].position.set(-9, -0.4, -7);
    chairWhite[1].scale.set(1.1, 1.1, 1.1);
    chairWhite[2].rotation.y = calcRadian(-90);
    chairWhite[2].position.set(9, -0.4, -7);
    chairWhite[2].scale.set(1.1, 1.1, 1.1);

    let hdrObj = new RGBELoader().load(
      // `${mode === "PRODUCT" ? "/threePractice/hdr.hdr" : "/hdr.hdr"}`,
      "/hdr.hdr",
      function (texture) {
        let hdrImg = new THREE.MeshStandardMaterial({ map: texture });
        hdrImg.envMapIntensity = 0.1;
        hdrImg.envMap = texture;
        console.log(hdrImg);
        hdrImg.map.mapping = THREE.EquirectangularReflectionMapping;
        let aaaa = texture;
        aaaa.repeat.set(0.5, 0.5);
        scene.environment = aaaa; // 解像度の低いテクスチャを使用
      }
    );
    console.log(hdrObj);

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
    let ambientLight = new THREE.AmbientLight(0x444444);
    scene.add(ambientLight);

    let outSideLight = new THREE.PointLight(0xffffff);
    outSideLight.penumbra = 0.5;
    outSideLight.angle = 0.5;
    outSideLight.intensity = 0.2;
    outSideLight.castShadow = true;
    scene.add(outSideLight);
    let outSideLightHelper = new THREE.PointLightHelper(outSideLight, 5);
    // scene.add(outSideLightHelper);

    let pointLights = [];
    let pointLightsHelpers = [];
    for (let n = 0; n < 6; n++) {
      pointLights.push(new THREE.SpotLight(0x887788));
      // pointLightsHelpers.push(new THREE.SpotLightHelper(pointLights[n], 5));
      pointLights[n].penumbra = 0.8;
      pointLights[n].angle = 0.9;
      pointLights[n].castShadow = true;
      pointLights[n].shadowMapWidth = 2048;
      pointLights[n].shadowMapHeight = 2048;
      pointLights[n].shadow.radius = 3;
      scene.add(pointLights[n]);
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
      outSideLightPosX: 0,
      outSideLightPosY: 27,
      outSideLightPosZ: 32,

      RoomLight0Color: 0xfebe48,
      RoomLight1Color: 0xffc966,
      RoomLight2Color: 0xfebe48,
      RoomLight3Color: 0xffc966,
      RoomLight4Color: 0xfebe48,
      RoomLight5Color: 0xffc966,
      RoomLight0Intensity: 1.3,
      RoomLight1Intensity: 1.3,
      RoomLight2Intensity: 1.3,
      RoomLight3Intensity: 1.3,
      RoomLight4Intensity: 1.3,
      RoomLight5Intensity: 1.3,
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
      // console.log(folderArray[n]);
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
    let outSideLightFolder = gui.addFolder("outSideLight");
    outSideLightFolder.add(controls, "outSideLightPosX", -50, 50, 1);
    outSideLightFolder.add(controls, "outSideLightPosY", -50, 50, 1);
    outSideLightFolder.add(controls, "outSideLightPosZ", -50, 50, 1);

    // gui.add();
    function capitalize(str) {
      if (typeof str !== "string" || !str) return str;
      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

    // const bookPosition = book1.getWorldPosition(new THREE.Vector3());
    // let projection = bookPosition.project(camera);
    // let sx = (window.innerWidth / 2) * (projection.x + 1.0);
    // let sy = (window.innerHeight / 2) * (-projection.x + 1.0);
    // console.log(`sx:${sx}, sy:${sy}`);

    // vector.project(camera);

    // vector.x = Math.round(
    //   (0.5 + vector.x / 2) * (canvas.width / window.devicePixelRatio)
    // );
    // vector.y = Math.round(
    //   (0.5 - vector.y / 2) * (canvas.height / window.devicePixelRatio)
    // );

    // const annotation = document.querySelector(".annotation");
    // annotation.style.top = `${vector.y}px`;
    // annotation.style.left = `${vector.x}px`;

    // const y = 32;
    // const radius = 30;
    // const startAngle = 30;
    // const endAngle = Math.PI * 2;

    // console.log(ctx);
    // ctx.fillStyle = "rgb(0, 0, 0)";
    // ctx.beginPath();
    // ctx.arc(x, y, radius, startAngle, endAngle);
    // ctx.fill();

    // ctx.strokeStyle = "rgb(255, 255, 255)";
    // ctx.lineWidth = 3;
    // ctx.beginPath();
    // ctx.arc(x, y, radius, startAngle, endAngle);
    // ctx.stroke();

    // ctx.fillStyle = "rgb(255, 255, 255)";
    // ctx.font = "32px sans-serif";
    // ctx.textAlign = "center";
    // ctx.textBaseline = "middle";
    // ctx.fillText("1", x, y);

    // const numberTexture = new THREE.CanvasTexture(
    //   document.querySelector("#number")
    // );

    // const spriteMaterial = new THREE.SpriteMaterial({
    //   map: numberTexture,
    //   alphaTest: 0.5,
    //   transparent: true,
    //   depthTest: false,
    //   depthWrite: false,
    // });

    // let sprite = new THREE.Sprite(spriteMaterial);
    // sprite.position.set(250, 250, 250);
    // sprite.scale.set(35, 35, 1);

    // scene.add(sprite);

    // const meshDistance = camera.position.distanceTo(mesh.position);
    // const spriteDistance = camera.position.distanceTo(sprite.position);
    // spriteBehindObject = spriteDistance > meshDistance;

    // sprite.material.opacity = spriteBehindObject ? 0.25 : 1;
    // annotation.style.opacity = spriteBehindObject ? 0.25 : 1;

    document.getElementById("WebGL-output").appendChild(renderer.domElement);
    render();

    function render() {
      stats.update();
      orbitControl.instance.update(orbitControler.delta);
      // console.log(cameraControl);
      plane.update(Date.now());
      plane.quaternion.copy(camera.quaternion);
      plane2.update(Date.now());
      plane2.quaternion.copy(camera.quaternion);
      selectObjectText.update(sel.current);
      selectObjectText.quaternion.copy(camera.quaternion);
      // const bookPosition = book1.getWorldPosition(new THREE.Vector3());
      // const projection = bookPosition.project(camera);
      // const sx = (window.innerWidth / 2) * (projection.x + 1.0);
      // const sy = (window.innerHeight / 2) * (-projection.y + 1.0);
      // // console.log(projection);
      // console.log(`sx:${sx}, sy:${sy}`);
      // const annotation = document.querySelector(".annotation");
      // annotation.style.transform = `translate(${sx}px, ${sy}px)`;
      simpleAnnotation({
        mesh: book1,
        camera: camera,
        domId: "annotation1",
        addClassWrapElement: ["simple-annotation--wrap"],
        addTextTitle: "RED BOOK",
        addTextAbs: "クリックでアノテーションを表示する",
      });
      simpleAnnotation({
        mesh: book2,
        camera: camera,
        domId: "annotation2",
        addClassWrapElement: ["simple-annotation--wrap"],
        addTextTitle: "BLUE BOOK",
        addTextAbs: "クリックでパーティクルを表示する",
      });
      // annotation.style.top = `${sy}px`;
      // annotation.style.left = `${sx}px`;

      for (let n = 0; n < 6; n++) {
        pointLights[n].color.setHex(controls[eval(`"RoomLight${n}Color"`)]);
        pointLights[n].intensity = controls[eval(`"RoomLight${n}Intensity"`)];
        pointLights[n].position.x = controls[eval(`"RoomLight${n}PosX"`)];
        pointLights[n].position.y = controls[eval(`"RoomLight${n}PosY"`)];
        pointLights[n].position.z = controls[eval(`"RoomLight${n}PosZ"`)];
        // pointLightsHelpers[n].position.x = pointLights[n].position.x;
        // pointLightsHelpers[n].position.y = pointLights[n].position.y;
        // pointLightsHelpers[n].position.z = pointLights[n].position.z;
        scene.add(pointLights[n]);
        // scene.add(pointLightsHelpers[n]);
      }
      outSideLight.position.set(
        controls.outSideLightPosX,
        controls.outSideLightPosY,
        controls.outSideLightPosZ
      );
      outSideLight.rotation.set(
        calcRadian(controls.outSideLightRotX),
        calcRadian(controls.outSideLightRotY),
        calcRadian(controls.outSideLightRotZ)
      );

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
        // console.log(intersects[0].object.name);
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

    window.addEventListener("mousemove", returnHoverObj);
    function returnHoverObj(e) {
      // console.log(book1.name);
      let mouseX =
        ((e.offsetX - window.innerWidth / 2) / window.innerWidth) * 2;
      let mouseY =
        ((-e.offsetY + window.innerHeight / 2) / window.innerHeight) * 2;
      let pos = new THREE.Vector3(mouseX, mouseY, 1);
      pos.unproject(camera);
      let ray = new THREE.Raycaster(
        camera.position,
        pos.sub(camera.position).normalize()
      );
      objs.current = ray.intersectObjects(scene.children);

      let objsResult = objs.current.map((obj) => {
        // console.log(obj.object);
        // if (obj.object.name === "redbook") {
        //   console.log(objsResult);
        // }
      });
    }
  }, []);
  return (
    <>
      {/* <div className="annotation" id="annotation1">
        <p>Book</p>
        <p>three.js practices.</p>
      </div> */}
      <div id="Stats-output"></div>
      <div id="WebGL-output"></div>
    </>
  );
}
