import * as THREE                from 'three'
import { ModelData, parseModel } from './modelParser'
import * as constants            from '../const/constants'
import * as structs              from '../const/structs'

/**
 * Build image data from buffer
 * @param buffer The model buffer
 * @param texture Texture description
 */
export const buildTexture = (buffer: ArrayBuffer, texture: structs.Texture): ImageData => {
  const textureArea: number = texture.width * texture.height
  const isTextureMasked: number = texture.flags & constants.NF_MASKED

  const textureData = new Uint8Array(buffer, texture.index, textureArea)

  // Palette of colors
  const palette = new Uint8Array(buffer, texture.index + textureArea, constants.PALETTE_SIZE)

  // RGB color which will be replaced with transparency
  const alphaColor: Uint8Array = palette.slice(
    constants.PALETTE_ALPHA_INDEX,
    constants.PALETTE_ALPHA_INDEX + constants.RGB_SIZE
  )

  // Create new image buffer
  const imageBuffer = new Uint8ClampedArray(textureArea * constants.RGBA_SIZE)

  // Parsing indexed color: every item in texture data is index of color in
  // colors palette
  for (let i = 0; i < textureData.length; i++) {
    const item = textureData[i]

    const paletteOffset = item * constants.RGB_SIZE
    const pixelOffset = i * constants.RGBA_SIZE

    // Checks is alpha color
    const isAlphaColor
      = palette[paletteOffset + 0] === alphaColor[0]
      && palette[paletteOffset + 1] === alphaColor[1]
      && palette[paletteOffset + 2] === alphaColor[2]

    if (isTextureMasked && isAlphaColor) {
      // This modifies the model's data. Sets the mask color to black.
      // This is also done by Jed's model viewer (export texture has black)
      imageBuffer[pixelOffset + 0] = 0 // red
      imageBuffer[pixelOffset + 1] = 0 // green
      imageBuffer[pixelOffset + 2] = 0 // blue
      imageBuffer[pixelOffset + 3] = 0 // alpha
    } else {
      // Just applying to texture image data
      imageBuffer[pixelOffset + 0] = palette[paletteOffset + 0] // red
      imageBuffer[pixelOffset + 1] = palette[paletteOffset + 1] // green
      imageBuffer[pixelOffset + 2] = palette[paletteOffset + 2] // blue
      imageBuffer[pixelOffset + 3] = 255 // alpha
    }
  }

  return new ImageData(imageBuffer, texture.width, texture.height)
}

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
 * Returns type of a series of connected triangles
 */
export const getTrianglesType = (trianglesSeriesHead: number) =>
  trianglesSeriesHead < 0 ? constants.TRIANGLE_FAN : constants.TRIANGLE_STRIP

/**
 * Counts vertices for building geometry buffer
 * @param trianglesBuffer Triangles buffer
 * @return Number of vertices
 */
export const countVertices = (trianglesBuffer: Int16Array): number => {
  // Count of vertices
  let vertCount = 0

  // Current position in buffer
  let p = 0

  // Processing triangle series
  while (trianglesBuffer[p]) {
    // Number of following vertices
    const verticesNum = Math.abs(trianglesBuffer[p])

    // This position is no longer needed,
    // we proceed to the following
    p += verticesNum * 4 + 1

    // Increase the number of vertices
    vertCount += (verticesNum - 3) * 3 + 3
  }

  return vertCount
}

/**
 * Returns face vertices of the mesh
 * @todo Make faster
 */
export const getFaceVertices = (trianglesBuffer: Int16Array, vertices: Float32Array, texture: ImageData) => {
  // Number of vertices for generating buffer
  const vertNumber = countVertices(trianglesBuffer)

  // List of vertices data: origin and uv position on texture
  const geometryVertices: number[][] = []

  // Current position in buffer
  let trisPos = 0

  // Processing triangle series
  while (trianglesBuffer[trisPos]) {
    // Detecting triangle series type
    const trianglesType = trianglesBuffer[trisPos] < 0 ? constants.TRIANGLE_FAN : constants.TRIANGLE_STRIP

    // Starting vertex for triangle fan
    let startVert = null

    // Number of following triangles
    const trianglesNum = Math.abs(trianglesBuffer[trisPos])

    // This index is no longer needed,
    // we proceed to the following
    trisPos++

    // For counting we will make steps for 4 array items:
    // 0 — vertex
    // 1 — light (?)
    // 2 — fist uv coordinate
    // 3 — second uv coordinate
    for (let j = 0; j < trianglesNum; j++, trisPos += 4) {
      // const vertIndex: number = trianglesBuffer[trisPos]
      const vert: number = trianglesBuffer[trisPos] * 3
      // const light: number = trianglesBuffer[trisPos + 1] // ?

      // Vertex data
      const vertexData = [
        // Origin
        vertices[vert + 0],
        vertices[vert + 1],
        vertices[vert + 2],

        // UV data
        trianglesBuffer[trisPos + 2] / texture.width,
        1 - trianglesBuffer[trisPos + 3] / texture.height
      ]

      // Triangle strip. Draw the associated group of triangles.
      // Each next vertex, beginning with the third, forms a triangle with the last and the penultimate vertex.
      //       2 ________4 ________ 6
      //       ╱╲        ╱╲        ╱╲
      //     ╱    ╲    ╱    ╲    ╱    ╲
      //   ╱________╲╱________╲╱________╲
      // 1          3         5          7
      if (trianglesType === constants.TRIANGLE_STRIP) {
        if (j > 2) {
          if (j % 2 === 0) {
            // even
            geometryVertices.push(
              geometryVertices[geometryVertices.length - 3], // previously first one
              geometryVertices[geometryVertices.length - 1] // last one
            )
          } else {
            // odd
            geometryVertices.push(
              geometryVertices[geometryVertices.length - 1], // last one
              geometryVertices[geometryVertices.length - 2] // second to last
            )
          }
        }
      }

      // Triangle fan. Draw a connected fan-shaped group of triangles.
      // Each next vertex, beginning with the third, forms a triangle with the last and first vertex.
      //       3 ____4 ____ 5
      //       ╱╲    |    ╱╲
      //     ╱    ╲  |  ╱    ╲
      //   ╱________╲|╱________╲
      // 2          1            6
      if (trianglesType === constants.TRIANGLE_FAN) {
        startVert = startVert || vertexData

        if (j > 2) {
          geometryVertices.push(startVert, geometryVertices[geometryVertices.length - 1])
        }
      }

      // New one
      geometryVertices.push(vertexData)
    }
  }

  // Flattening geometry buffer
  const geometryBuffer = new Float32Array(vertNumber * 3)
  const uvBuffer = new Float32Array(vertNumber * 2)

  for (let i = 0; i < vertNumber; i++) {
    geometryBuffer[i * 3 + 0] = geometryVertices[i][0]
    geometryBuffer[i * 3 + 1] = geometryVertices[i][1]
    geometryBuffer[i * 3 + 2] = geometryVertices[i][2]

    uvBuffer[i * 2 + 0] = geometryVertices[i][3]
    uvBuffer[i * 2 + 1] = geometryVertices[i][4]
  }

  return {
    geometry: geometryBuffer,
    uv:       uvBuffer
  }
}

/**
 * Creates THREE.js object for render on the page
 * @param modelBuffer Source buffer of MDL file
 */
export const renderModel = (modelBuffer: ArrayBuffer) => {
  console.time()
  const modelData: ModelData = parseModel(modelBuffer)
  console.timeEnd()

  const container = new THREE.Group()

  // Skeleton
  const skeleton: THREE.Skeleton = createSkeleton(modelData.bones)
  container.add(skeleton.bones[0])

  // Geometry

  // this.geometry = new THREE.BufferGeometry()
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
    skeleton
  }
}
