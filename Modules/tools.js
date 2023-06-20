import * as THREE from "three";

function autoInitTexture(textureObj) {
  textureObj.wrapS = THREE.RepeatWrapping;
  textureObj.wrapT = THREE.RepeatWrapping;
  textureObj.repeat = new THREE.Vector2(2, 2);
  textureObj.rotation = -0.5 * Math.PI;
}
export { autoInitTexture };

//renderでupdate()を書けばテキストを再描画してくれる
function textToTextureConvertReturnMesh(canvasSize = 500, fontSize = 50) {
  const bitmap = document.createElement("canvas");
  const g = bitmap.getContext("2d");
  let refleshText = "refleshText";
  console.log(g.measureText(refleshText));
  bitmap.width = canvasSize;
  bitmap.height = canvasSize;
  g.font = `Bold ${fontSize}px Arial`;
  const planeStatusGeometry = new THREE.PlaneGeometry(10, 10, 1, 1);
  const texture = new THREE.Texture(bitmap);
  const planeStatusMaterial = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
  });
  function update(text) {
    refleshText = text;
    // console.log(g.measureText(refleshText));
    g.clearRect(0, 0, bitmap.width, bitmap.height);
    g.fillStyle = "white";
    g.textAlign = "left";
    g.fillText(
      text,
      canvasSize / 2 - g.measureText(text).width / 2,
      (canvasSize + fontSize / 2) / 2
    );
    // console.log(g.actualBoundingBoxAscent + g.actualBoundingBoxDescent);
    g.strokeStyle = "black";
    g.strokeText(
      text,
      canvasSize / 2 - g.measureText(text).width / 2,
      (canvasSize + fontSize / 2) / 2
    );
    texture.needsUpdate = true;
  }
  const planeStatusMesh = new THREE.Mesh(
    planeStatusGeometry,
    planeStatusMaterial
  );
  planeStatusMesh.update = update;
  return planeStatusMesh;
}
export { textToTextureConvertReturnMesh };

const calcRadian = (rot) => {
  return (rot * Math.PI) / 180;
};
export { calcRadian };
