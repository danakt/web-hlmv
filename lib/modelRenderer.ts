import * as THREE                from 'three'
import { ModelData, parseModel } from './modelParser'
import * as constants            from '../const/constants'
import * as structs              from '../const/structs'
import { readFacesData }         from './geometryBuilder'

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

  const buildedSkin = buildTexture(modelBuffer, modelData.textures[0])
  const { geometry: vertices, uv } = readFacesData(modelData.triangles[0][0][0], modelData.vertices[0][0], buildedSkin)
  geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3))
  geometry.addAttribute('uv', new THREE.BufferAttribute(uv, 2))

  // Preparing of texture
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
