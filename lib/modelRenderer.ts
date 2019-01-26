import * as THREE                                                                  from 'three'
import * as R                                                                      from 'ramda'
import { mat4 }                                                                    from 'gl-matrix'
import { ModelData, parseModel }                                                   from './modelDataParser'
import { readFacesData }                                                           from './geometryBuilder'
import { calcBoneTransforms, getBoneQuaternions, getBonePositions, calcRotations } from './geometryTransformer'
import { buildTexture }                                                            from './textureBuilder'

/**
 * Mesh buffers of each frame of each sequence of the model and mesh UV-maps
 */
export type MeshRenderData = {
  geometryBuffers: THREE.BufferAttribute[][]
  uvMap: THREE.BufferAttribute
}

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

/**
 * Applies bone transforms to a position array and returns it
 */
export const applyBoneTransforms = (
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
 * Returns generated mesh buffers and UV-maps of each frame of each sequence of
 * the model
 * @param modelData Model data
 */
export const prepareRenderData = (modelData: ModelData): MeshRenderData[][][] =>
  modelData.bodyParts.map((_, bodyPartIndex) =>
    modelData.subModels[bodyPartIndex].map((_, subModelIndex) =>
      modelData.meshes[bodyPartIndex][subModelIndex].map((_, meshIndex) => {
        const textureIndex = modelData.skinRef[modelData.meshes[bodyPartIndex][subModelIndex][meshIndex].skinref]

        // Unpack faces of the mesh
        const { vertices, uv, indices } = readFacesData(
          modelData.triangles[bodyPartIndex][subModelIndex][meshIndex],
          modelData.vertices[bodyPartIndex][subModelIndex],
          modelData.textures[textureIndex]
        )

        return {
          // UV-map of the mesh
          uvMap: new THREE.BufferAttribute(uv, 2),

          // List of mesh buffer for each frame of each sequence
          geometryBuffers: modelData.sequences.map((sequence, sequenceIndex) =>
            Array(sequence.numframes)
              .fill(null)
              .map((_, frame) => {
                const boneTransforms = calcRotations(modelData, sequenceIndex, frame)
                const transformedVertices = applyBoneTransforms(
                  vertices,
                  indices,
                  modelData.vertBoneBuffer[bodyPartIndex][subModelIndex],
                  boneTransforms
                )

                const bufferAttribute = new THREE.BufferAttribute(transformedVertices, 3)

                return bufferAttribute
              })
          )
        }
      })
    )
  )

export const createModelMeshes = (
  meshesRenderData: MeshRenderData[][][],
  modelData: ModelData,
  textureBuffers: Uint8ClampedArray[]
) => {
  const textures: THREE.Texture[] = textureBuffers.map((textureBuffer, textureIndex) => {
    const texture = new THREE.Texture(
      new ImageData(
        textureBuffer,
        modelData.textures[textureIndex].width,
        modelData.textures[textureIndex].height
      ) as any,
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
  })

  return meshesRenderData.map((bodyPart, bodyPartIndex) =>
    // Body part level
    bodyPart.map((subModel, subModelIndex) =>
      // Sub model level
      subModel.map(({ geometryBuffers, uvMap }, meshIndex) => {
        // Pizdec kakoi-to
        const textureIndex = modelData.skinRef[modelData.meshes[bodyPartIndex][subModelIndex][meshIndex].skinref]

        // Mesh level
        const material = new THREE.MeshBasicMaterial({
          map:          textures[textureIndex],
          side:         THREE.DoubleSide,
          transparent:  true,
          alphaTest:    0.5,
          morphTargets: true
          // color:        0xffffff
        })

        // Prepare geometry
        const geometry = new THREE.BufferGeometry()
        geometry.addAttribute('position', geometryBuffers[0][0])
        geometry.addAttribute('uv', uvMap)

        // Prepare mesh
        return new THREE.Mesh(geometry, material)
      })
    )
  )
}

/**
 * Creates THREE.js object to render
 */
export const createContainer = (meshes: THREE.Mesh[][][]) => {
  const container = new THREE.Group()

  // Adding meshes to the container
  meshes.forEach(bodyPart =>
    // Body part level
    bodyPart.forEach(subModel =>
      // Sub model level
      subModel.forEach(mesh => {
        // Mesh level
        container.add(mesh)
      })
    )
  )

  // Sets to display the front of the model
  container.rotation.x = THREE.Math.degToRad(-90)
  container.rotation.z = THREE.Math.degToRad(-90)

  // Sets to display model on the center of camera
  const boundingBox = new THREE.Box3().setFromObject(container)
  container.position.y = (boundingBox.min.y - boundingBox.max.y) / 2

  return container
}
