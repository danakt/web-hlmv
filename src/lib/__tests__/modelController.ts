import * as THREE from 'three';
import { ModelData } from '../modelDataParser';
import { MeshRenderData } from '../modelRenderer';
import { createMeshController } from '../modelController';

const sequenceFrames = [3, 2];

const createModelData = (): ModelData =>
  ({
    sequences: sequenceFrames.map((numFrames, i) => ({
      label: `sequence${i}`,
      fps: 30,
      numFrames
    }))
  } as ModelData);

const createMeshRenderData = (): MeshRenderData => ({
  uvMap: new THREE.BufferAttribute(new Float32Array([0, 0, 0, 0, 0, 0]), 2),
  geometryBuffers: sequenceFrames.map(numFrames =>
    Array.from({ length: numFrames }, () => new THREE.BufferAttribute(new Float32Array(9), 3))
  )
});

const createMesh = (): THREE.Mesh => {
  const geometry = new THREE.BufferGeometry();
  // `@types/three` is pinned to r93, which still calls `setAttribute` `addAttribute`
  (geometry as any).setAttribute('position', new THREE.BufferAttribute(new Float32Array(9), 3));

  return new THREE.Mesh(geometry, new THREE.MeshBasicMaterial());
};

describe('test mesh controller', () => {
  test('should start an animation without throwing', () => {
    const mesh = createMesh();
    const controller = createMeshController(mesh, createMeshRenderData(), createModelData());

    expect(() => controller.setAnimation(0)).not.toThrow();
  });

  test('should expose a morph target dictionary matching the animation clip names', () => {
    const mesh = createMesh();

    createMeshController(mesh, createMeshRenderData(), createModelData());

    expect(mesh.morphTargetDictionary).toBeDefined();
    expect(mesh.morphTargetDictionary!['0']).toBe(0);
    expect(mesh.morphTargetDictionary!['1']).toBe(1);
  });

  test('should switch between animations without throwing', () => {
    const mesh = createMesh();
    const controller = createMeshController(mesh, createMeshRenderData(), createModelData());

    controller.setAnimation(0);

    expect(() => controller.setAnimation(1)).not.toThrow();
  });
});
