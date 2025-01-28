import type { Group, Mesh } from "three";

declare const path: unique symbol;

export const SwirlyBallScene: {
  [path]: [0];
  Quad_Sphere: {
    [path]: [0, 0];
  };
};

export function getNode(spec: typeof SwirlyBallScene): Promise<Group>;
export function getNode(spec: typeof SwirlyBallScene.Quad_Sphere): Promise<Mesh>;

export {};
