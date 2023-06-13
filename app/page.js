"use client";

import Image from "next/image";
import { useEffect } from "react";
import * as THREE from "three";
import * as Stats from "stats-js";

export default function Home() {
  let canvas = null;
  useEffect(() => {
    if (canvas) return;
    // canvasを取得
    let stats = initStats();
    let scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xffffff, 0.015, 100);
    scene.overrideMaterial = new THREE.MeshLambertMaterial({
      color: 0xffffff,
    });
    function initStats() {
      let stats = new Stats();
      stats.setMode(0);

      stats.domElement.style.position = "absolute";
      stats.domElement.style.left = "0px";
      stats.domElement.style.ltop = "0px";
      document.getElementById("Stats-output").appendChild(stats.domElement);

      return stats;
    }
  }, []);
  return (
    <>
      <div id="Stats-output"></div>
      <canvas id="canvas"></canvas>
    </>
  );
}
