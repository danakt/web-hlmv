import * as THREE                                                   from 'three'
import { vec3, mat4 }                                               from 'gl-matrix'
import { ModelData, parseModel }                                    from './modelDataParser'
import { readFacesData }                                            from './geometryBuilder'
import { calcBoneTransforms, getBoneQuaternions, getBonePositions } from './geometryTransformer'
import { buildTexture }                                             from './textureBuilder'

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

// export const renderBones = (bonesPositions: vec3[], color = 0x0000ff): THREE.Line => {
//   const geometry = new THREE.Geometry()

//   for (let i = 0; i < bonesPositions.length; i++) {
//     geometry.vertices.push(new THREE.Vector3(bonesPositions[i][0], bonesPositions[i][1], bonesPositions[i][2]))
//   }

//   const material = new THREE.LineBasicMaterial({ color })
//   const line = new THREE.Line(geometry, material)

//   return line
// }

/**
 * Applies bone transforms to a position array and returns it
 */
export const applyBoneTranforms = (
  vertices: Float32Array,
  vertIndices: Int16Array,
  vertBoneBuffer: Uint8Array,
  boneTransforms: mat4[]
): Float32Array => {
  const posArray = new Float32Array(vertices.length)
  for (let i = 0; i < vertIndices.length; i++) {
    const transform: mat4 = boneTransforms[vertBoneBuffer[vertIndices[i]]]

    // The vec3.transformMat4 function was removed from here, because its use
    // (creation of an additional vector) increased the code performance by
    // 4 times. Instead, it uses manual multiplication.

    const x = vertices[i * 3 + 0]
    const y = vertices[i * 3 + 1]
    const z = vertices[i * 3 + 2]
    const w = transform[3] * x + transform[7] * y + transform[11] * z + transform[15] || 1.0

    posArray[i * 3 + 0] = (transform[0] * x + transform[4] * y + transform[8] * z + transform[12]) / w
    posArray[i * 3 + 1] = (transform[1] * x + transform[5] * y + transform[9] * z + transform[13]) / w
    posArray[i * 3 + 2] = (transform[2] * x + transform[6] * y + transform[10] * z + transform[14]) / w
  }

  return posArray
}

/**
 * Creates THREE.js object to render
 */
export const renderModel = (modelBuffer: ArrayBuffer) => {
  const container = new THREE.Group()

  const modelData: ModelData = parseModel(modelBuffer)

  const textures: Uint8ClampedArray[] = modelData.textures.map(texture => buildTexture(modelBuffer, texture))

  const bodyPartIndex = 0
  const subModelIndex = 0
  const meshIndex = 0
  const sequenceIndex = 0
  const frame = 0

  const { vertices, uv, indices } = readFacesData(
    modelData.triangles[bodyPartIndex][subModelIndex][meshIndex],
    modelData.vertices[bodyPartIndex][subModelIndex],
    modelData.textures[bodyPartIndex]
  )

  const geometry = new THREE.BufferGeometry()

  const boneQuaternions = getBoneQuaternions(
    modelData.bones,
    modelData.animations[bodyPartIndex],
    modelData.animValues,
    sequenceIndex,
    frame
  )

  const bonesPositions = getBonePositions(modelData.bones)

  const boneTransforms = calcBoneTransforms(boneQuaternions, bonesPositions, modelData.bones)

  const transformedVertices = applyBoneTranforms(
    vertices,
    indices,
    modelData.vertBoneBuffer[bodyPartIndex][subModelIndex],
    boneTransforms
  )

  geometry.addAttribute('position', new THREE.BufferAttribute(transformedVertices, 3))
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
