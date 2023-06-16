import * as THREE from "three";

function autoInitTexture(textureObj) {
  textureObj.wrapS = THREE.RepeatWrapping;
  textureObj.wrapT = THREE.RepeatWrapping;
  textureObj.repeat = new THREE.Vector2(2, 2);
  textureObj.rotation = -0.5 * Math.PI;
}
export { autoInitTexture };

function textToTextureConvert(geom, options) {
  //   const canvas = document.createElement("canvas");
  //   const ctx = canvas.getContext("2d");
  // //   const dpr = Math.min(window.devicePixelRatio, 2);

  //   const fontFamily = "monospace";
  //   ctx.font = `bold ${options.fontSize * dpr}px '${fontFamily}'`;
  //   const textWidth = ctx.measureText(options.text);

  //   const width = textWidth.width;
  //   const height = options.fontSize * dpr * 0.8;

  //   canvas.width = width;
  //   canvas.height = height;
  //   ctx.font = `bold ${options.fontSize * dpr}px '${fontFamily}'`;
  //   ctx.textAlign = "left";
  //   ctx.textBaseline = "hanging";
  //   ctx.fillstyle = "rgba(255,255,255,1.0)";
  //   ctx.fillText(options.text, -5, 0);

  //   const texture = new THREE.CanvasTexture(canvas);
  //   texture.needsUpdate = false;
  //   texture.minFilter = THREE.LinearFilter;
  //   texture.magFilter = THREE.LinearFilter;
  //   texture.format = THREE.RGBAFormat;

  let canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const dpr = Math.min(window.devicePixelRatio, 2);

  ctx.font = "48px serif";
  ctx.fillText("nyoooooon", 10, 50);
  ctx.fillStyle = "rgba(255,255,255,1.0)";
  console.log(ctx);
  //   const fontFamily = "monospace";
  //   ctx.font = `bold ${options.fontSize * dpr}px '${fontFamily}'`;
  //   const textWidth = ctx.measureText(options.text);

  //   const width = textWidth.width;
  //   const height = options.fontSize * dpr * 0.8;

  //   canvas.width = width;
  //   canvas.height = height;
  //   ctx.font = `bold ${options.fontSize * dpr}px '${fontFamily}'`;
  //   ctx.textAlign = "left";
  //   ctx.textBaseline = "hanging";
  //   ctx.fillstyle = "rgba(255,255,255,1.0)";
  //   ctx.fillText(options.text, -5, 0);

  const texture = new THREE.CanvasTexture(canvas);
  //   texture.needsUpdate = false;
  //   texture.minFilter = THREE.LinearFilter;
  //   texture.magFilter = THREE.LinearFilter;
  //   texture.format = THREE.RGBAFormat;

  texture.needsUpdate = true;

  let canvasMap = new THREE.Texture(canvas);
  let mat = new THREE.MeshPhongMaterial();
  mat.map = texture;
  let mesh = new THREE.Mesh(geom, mat);
  return mesh;
}
export { textToTextureConvert };
