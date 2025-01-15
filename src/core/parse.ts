import type { Stats } from 'node:fs';
import { readFile, stat } from 'node:fs/promises';
import { dirname } from 'node:path';
import type { GLTFLoader } from 'three-stdlib';

export async function parseGltfModel(gltf: GLTFLoader, modelFile: string) {
  let stats: Stats;
  try {
    stats = await stat(modelFile);
  } catch {
    throw new Error(`Model file "${modelFile}" does not exist!`);
  }

  if (!stats.isFile()) {
    throw new Error(`"${modelFile}" is not a file!`);
  }

  const json = (await readFile(modelFile)).buffer;

  const model = await gltf.parseAsync(json, dirname(modelFile));

  return model;
}
