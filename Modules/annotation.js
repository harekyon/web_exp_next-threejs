import * as THREE from "three";
import { useEffect, useRef, useState } from "react";

export function simpleAnnotation({
  mesh,
  camera,
  domId = "annotation1",
  addClassWrapElement = ["simple-annotation--wrap"],
  addClassTitleElement = ["simple-annotation__title"],
  addClassAbsElement = ["simple-annotation__abs"],
  addTextTitle = "InitTitle",
  addTextAbs = "InitAbstract",
}) {
  if (!document.getElementById(domId)) {
    const wrapElement = document.createElement("div");
    wrapElement.id = domId;
    document.body.appendChild(wrapElement);
    const titleElement = document.createElement("p");
    titleElement.textContent = addTextTitle;
    titleElement.classList.add(addClassTitleElement);
    const absElement = document.createElement("p");
    absElement.textContent = addTextAbs;
    absElement.classList.add(addClassAbsElement);
    wrapElement.appendChild(titleElement);
    wrapElement.appendChild(absElement);
    wrapElement.classList.add(addClassWrapElement);
    wrapElement.classList.add("annotation-init-properties");
  }

  const meshPosition = mesh.getWorldPosition(new THREE.Vector3());
  const projection = meshPosition.project(camera);
  const sx = (window.innerWidth / 2) * (projection.x + 1.0);
  const sy = (window.innerHeight / 2) * (-projection.y + 1.0);
  const annotation = document.getElementById(domId);
  annotation.style.transform = `translate(${sx}px, ${sy}px)`;
}
