import * as THREE from 'three';
import { createModelController } from '../modelController';
import { ModelData } from '../modelDataParser';
import { MeshRenderData } from '../modelRenderer';

// One triangle and a looping four-frame sequence, like the viewer's animation controls consume.
const createController = () => {
  const geometryBuffers = Array.from(
    { length: 4 },
    () => new THREE.BufferAttribute(new Float32Array([0, 0, 0, 1, 0, 0, 0, 1, 0]), 3)
  );
  const geometry = new THREE.BufferGeometry();
  geometry.attributes.position = geometryBuffers[0];
  geometry.morphAttributes.position = geometryBuffers;
  // Let Three initialize its morph-target bindings before the controller starts playback.
  const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial());
  const renderData: MeshRenderData = {
    geometryBuffers: [geometryBuffers],
    uvMap: new THREE.BufferAttribute(new Float32Array(6), 2),
  };
  const modelData = {
    bodyParts: [{ name: 'triangle' }],
    sequences: [{ label: 'turn', numFrames: 4, fps: 2 }],
  } as ModelData;

  return createModelController([[[mesh]]], [[[renderData]]], modelData);
};

describe('playback rate through the model controller', () => {
  test.each([
    [0, 0],
    [0.5, 0],
    [1, 1],
    [2, 2],
  ])('rate %s advances to frame %s after half a second', (rate, expectedFrame) => {
    const controller = createController();

    controller.setPlaybackRate(rate);
    controller.update(0.5);

    expect(controller.getCurrentState().frame).toBe(expectedFrame);
  });
});
