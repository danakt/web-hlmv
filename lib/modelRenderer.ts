import * as THREE        from 'three'
import { vec3 }          from 'gl-matrix'
import { ModelData }     from './modelDataParser'
import { readFacesData } from './geometryBuilder'

/**
 * Creates texture instance
 */
export const createTexture = (skinBuffer: Uint8ClampedArray, width: number, height: number): THREE.Texture => {
  const texture = new THREE.Texture(
    new ImageData(skinBuffer, width, height) as any,
    THREE.UVMapping,
    THREE.ClampToEdgeWrapping,
    THREE.ClampToEdgeWrapping,
    THREE.LinearFilter,
    THREE.LinearFilter,
    THREE.RGBAFormat,
    THREE.UnsignedByteType
  )

  texture.needsUpdate = true

  return texture
}

export const renderBones = (bonesPositions: vec3[], color = 0x0000ff): THREE.Line => {
  const geometry = new THREE.Geometry()

  for (let i = 0; i < bonesPositions.length; i++) {
    geometry.vertices.push(new THREE.Vector3(bonesPositions[i][0], bonesPositions[i][1], bonesPositions[i][2]))
  }

  const material = new THREE.LineBasicMaterial({ color })
  const line = new THREE.Line(geometry, material)

  return line
}

/**
 * Creates THREE.js object to render
 */
export const renderModel = (modelData: ModelData, textures: Uint8ClampedArray[]) => {
  const container = new THREE.Group()

  const { geometry: vertices, uv } = readFacesData(
    modelData.triangles[0][0][0],
    modelData.vertices[0][0],
    modelData.textures[0]
  )

  const geometry = new THREE.BufferGeometry()

  geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3))
  geometry.addAttribute('uv', new THREE.BufferAttribute(uv, 2))

  // Preparing texture
  const texture: THREE.Texture = createTexture(textures[0], modelData.textures[0].width, modelData.textures[0].height)

  // // Mesh material
  const material = new THREE.MeshBasicMaterial({
    map:          texture,
    side:         THREE.DoubleSide,
    transparent:  true,
    alphaTest:    0.5,
    morphTargets: true
    // color:        0xffffff
  })

  const mesh = new THREE.Mesh(geometry, material)

  container.add(mesh)

  return container
}
