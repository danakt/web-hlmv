import * as THREE                from 'three'
import { ModelData, parseModel } from './modelParser'
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
 * Creates THREE.js object for render on the page
 * @param modelBuffer Source buffer of MDL file
 */
export const renderModel = (modelBuffer: ArrayBuffer) => {
  const modelData: ModelData = parseModel(modelBuffer)
  const container = new THREE.Group()

  // Skeleton
  const skeleton: THREE.Skeleton = createSkeleton(modelData.bones)
  container.add(skeleton.bones[0])

  // Geometry
  const geometry = new THREE.BufferGeometry()

  const { geometry: vertices, uv } = readFacesData(
    modelData.triangles[0][0][0],
    modelData.vertices[0][0],
    modelData.textures[0]
  )
  geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3))
  geometry.addAttribute('uv', new THREE.BufferAttribute(uv, 2))

  // Preparing of texture
  const buildedSkin = buildTexture(modelBuffer, modelData.textures[0])
  const texture = new THREE.Texture(
    buildedSkin as any,
    THREE.UVMapping,
    THREE.ClampToEdgeWrapping,
    THREE.ClampToEdgeWrapping,
    THREE.LinearFilter,
    THREE.LinearFilter,
    THREE.RGBAFormat,
    THREE.UnsignedByteType
  )
  texture.needsUpdate = true

  // // Mesh material
  const material = new THREE.MeshBasicMaterial({
    map:          texture,
    side:         THREE.DoubleSide,
    transparent:  true,
    alphaTest:    0.5,
    morphTargets: true
    // color: 0xffffff
  })

  const mesh = new THREE.SkinnedMesh(geometry, material)
  mesh.normalizeSkinWeights()
  container.add(mesh)

  // this.geometry.addAttribute('position', this.morphPositions[firstSequenceName][0])
  // this.geometry.addAttribute('uv', new THREE.BufferAttribute(uvMap, 2))

  // // Mesh material
  // const material = new THREE.MeshBasicMaterial({
  //   map: texture,
  //   side: THREE.DoubleSide,
  //   transparent: true,
  //   alphaTest: 0.5,
  //   morphTargets: true
  // })

  // // Creating the mesh
  // this.mesh = new THREE.SkinnedMesh(this.geometry, material)

  console.log(modelData)

  return {
    modelData,
    skeleton,
    container
  }
}
