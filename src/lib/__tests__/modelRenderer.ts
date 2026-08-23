import * as THREE from 'three';
import { createMesh } from '../modelRenderer';

describe('test model renderer', () => {
  test('should build geometry with position and uv attributes', () => {
    const mesh = createMesh(
      new THREE.BufferAttribute(new Float32Array(9), 3),
      new THREE.BufferAttribute(new Float32Array(6), 2),
      new THREE.Texture()
    );

    const geometry = mesh.geometry as THREE.BufferGeometry;

    expect(geometry.getAttribute('position')).toBeDefined();
    expect(geometry.getAttribute('uv')).toBeDefined();
  });
});
