import * as THREE                from 'three'
import { ModelData, parseModel } from './modelParser'
import * as constants            from '../const/constants'
import * as structs              from '../const/structs'

/**
 * Type of description of face vertices
 */
type VertexDesc = {
  origin: THREE.Vector3
  light: number
  uv: THREE.Vector2 // Coordinates of UV-mapping
  index: number
}

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

    // bone.scale.x = bonesData[i].scale[0]
    // bone.scale.y = bonesData[i].scale[1]
    // bone.scale.z = bonesData[i].scale[2]

    if (bonesData[i].parent > -1) {
      bones[bonesData[i].parent].add(bone)
    }

    bones[i] = bone
  }

  return new THREE.Skeleton(bones)
}

/**
 * Returns face vertices of the mesh
 */
export const getFaceVertices = (trisBuffer: Int16Array, vertices: Float32Array, texture: ImageData): VertexDesc[] => {
  // List of vertices of faces
  const faceVertices: VertexDesc[] = []

  // Position in mesh triangles buffer
  let i = 0

  while (trisBuffer[i]) {
    const isTriangleStrip: boolean = trisBuffer[i] >= 0
    const isTriangleFan: boolean = trisBuffer[i] < 0

    let startVert = null
    let stripCount = 0
    let len = 0

    // Number of following triangles
    const trisNum = Math.abs(trisBuffer[i])

    // This index is no longer needed,
    // we proceed to the following
    i++

    for (let j = trisNum; j > 0; j--, i += 4) {
      const vertIndex: number = trisBuffer[i]
      const vert: number = trisBuffer[i] * 3
      const light: number = trisBuffer[i + 1] // ?

      // Vertex coordinate
      const vertOrigin = new THREE.Vector3(vertices[vert + 0], vertices[vert + 1], vertices[vert + 2])

      // Vertex x and y coordinates on texture (from 0.0 to 1.0)
      const uv = new THREE.Vector2(trisBuffer[i + 2] / texture.width, 1 - trisBuffer[i + 3] / texture.height)

      const vertProps: VertexDesc = {
        index:  vertIndex,
        origin: vertOrigin,
        light,
        uv
      }

      // Triangle strip. Draw the associated group of triangles.
      // Each next vertex, beginning with the third, forms a triangle with the last and the penultimate vertex.
      //       2 ________4 ________ 6
      //       ╱╲        ╱╲        ╱╲
      //     ╱    ╲    ╱    ╲    ╱    ╲
      //   ╱________╲╱________╲╱________╲
      // 1          3         5          7
      if (isTriangleStrip) {
        if (len > 2) {
          stripCount++

          if (stripCount % 2 === 0) {
            // even
            faceVertices.push(
              faceVertices[faceVertices.length - 3], // previously first one
              faceVertices[faceVertices.length - 1] // last one
            )
          } else {
            // odd
            faceVertices.push(
              faceVertices[faceVertices.length - 1], // last one
              faceVertices[faceVertices.length - 2] // second to last
            )
          }

          faceVertices.push(vertProps) // new one
        } else {
          faceVertices.push(vertProps)
          len += 1
        }
      }

      // Triangle fan. Draw a connected fan-shaped group of triangles.
      // Each next vertex, beginning with the third, forms a triangle with the last and first vertex.
      //       3 ____4 ____ 5
      //       ╱╲    |    ╱╲
      //     ╱    ╲  |  ╱    ╲
      //   ╱________╲|╱________╲
      // 2          1            6
      if (isTriangleFan) {
        if (!startVert) {
          startVert = vertProps
        }

        if (len > 2) {
          faceVertices.push(startVert, faceVertices[faceVertices.length - 1])
        }

        faceVertices.push(vertProps)
        len += 1
      }
    }
  }

  return faceVertices
}

/**
 * Creates THREE.js object for render on the page
 * @param modelBuffer Source buffer of MDL file
 */
export const renderModel = (modelBuffer: ArrayBuffer) => {
  const modelData: ModelData = parseModel(modelBuffer)
  console.log(modelData)

  createSkeleton(modelData.bones)

  return modelData // temp
}
