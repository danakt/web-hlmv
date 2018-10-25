import * as THREE                from 'three'
import { ModelData, parseModel } from './modelDataParser'
import * as structs              from '../const/structs'
import { readFacesData }         from './geometryBuilder'
import { buildTexture }          from './textureBuilder'

/**
 * Creates model skeleton
 * @param bonesData Bones data
 */
export const createSkeleton = (bonesData: structs.Bone[]): THREE.Skeleton => {
  const bones: THREE.Bone[] = []

  for (let i = 0; i < bonesData.length; i++) {
    const bone = new THREE.Bone()
    bone.position.x = bonesData[i].value[0]
    bone.position.y = bonesData[i].value[1]
    bone.position.z = bonesData[i].value[2]

    // bone.scale.x = bonesData[i].scale[3]
    // bone.scale.y = bonesData[i].scale[4]
    // bone.scale.z = bonesData[i].scale[5]

    if (bonesData[i].parent > -1) {
      bones[bonesData[i].parent].add(bone)
    }

    bones[i] = bone
  }

  return new THREE.Skeleton(bones)
}

/**
 * Creates texture instance
 */
export const createTexture = (modelBuffer: ArrayBuffer, textureData: structs.Texture): THREE.Texture => {
  const buildedSkin = buildTexture(modelBuffer, textureData)
  const texture = new THREE.Texture(
    new ImageData(buildedSkin, textureData.width, textureData.height) as any,
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

/**
 * Creates the Geometry instance from Float32Array
 * (Temporary escaping BufferGeometry)
 */
export const createGeometryFromBuffer = (geometryBuffer: Float32Array): THREE.Geometry => {
  const geometry = new THREE.Geometry()

  for (let i = 0; i < geometryBuffer.length; i += 3) {
    if (i !== 0 && i % 9 === 0) {
      geometry.faces.push(
        new THREE.Face3(geometry.vertices.length - 3, geometry.vertices.length - 2, geometry.vertices.length - 1)
      )
    }

    geometry.vertices.push(new THREE.Vector3(geometryBuffer[i], geometryBuffer[i + 1], geometryBuffer[i + 2]))
  }

  return geometry
}

/**
 * Creates vertex UVs
 */
export const createVertexUvs = (uvBuffer: Float32Array): THREE.Vector2[][] => {
  const vertexUvs: THREE.Vector2[][] = []

  // Two numbers (U and V) for every vertex of every face
  for (let i = 0; i < uvBuffer.length; i += 6) {
    const faceUvs: THREE.Vector2[] = []

    for (let j = i; j < i + 6; j += 2) {
      faceUvs.push(new THREE.Vector2(uvBuffer[j], uvBuffer[j + 1]))
    }

    vertexUvs.push(faceUvs)
  }

  return vertexUvs
}

/**
 * Creates THREE.js object for render on the page
 * @param modelBuffer Source buffer of MDL file
 */
export const renderModel = (modelBuffer: ArrayBuffer) => {
  const modelData: ModelData = parseModel(modelBuffer)
  const container = new THREE.Group()

  // Skeleton
  const skeleton: THREE.Skeleton = createSkeleton(modelData.bones)

  const { geometry: vertices, uv } = readFacesData(
    modelData.triangles[0][0][0],
    modelData.vertices[0][0],
    modelData.textures[0]
  )

  const geometry = new THREE.BufferGeometry()

  geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3))
  geometry.addAttribute('uv', new THREE.BufferAttribute(uv, 2))

  // Preparing texture
  const texture: THREE.Texture = createTexture(modelBuffer, modelData.textures[0])

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
  // mesh.bind(skeleton)
  // mesh.normalizeSkinWeights()
  ;(window as any).skeleton = skeleton

  container.add(mesh)

  console.log(modelData)

  return {
    modelData,
    // skeleton,
    container
  }
}
