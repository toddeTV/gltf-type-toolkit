import gltfLoader from "/home/andi/code/3rd-party/gltf-vite-plugin/src/gltf-loader.ts";

const path = Symbol();

export const SwirlyBallScene = {
  [path]: [0],
  Quad_Sphere: {
    [path]: [0, 0],
  },
};

export async function getNode(spec) {
  let node = { children: (await loadModel()).scenes };
  for (const idx of spec[path]) {
    node = node.children[idx];
  }

  return node;
}

import gltfPath from "./SwirlyBall.glb";

async function loadModel() {
  return await gltfLoader.loadAsync(gltfPath);
}
