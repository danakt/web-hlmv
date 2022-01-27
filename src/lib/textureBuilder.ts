import * as structs from '../const/structs';
import { NF_MASKED, PALETTE_SIZE, PALETTE_ALPHA_INDEX, RGB_SIZE, RGBA_SIZE } from '../const/constants';

/**
 * Build texture data from buffer
 * @param buffer The model buffer
 * @param texture Texture description
 * @returns Uint8ClampedArray with unpacked RGBA data of a texture
 */
export const buildTexture = (buffer: ArrayBuffer, texture: structs.Texture): Uint8ClampedArray => {
  const textureArea: number = texture.width * texture.height;
  const isTextureMasked: number = texture.flags & NF_MASKED;

  const textureData = new Uint8Array(buffer, texture.index, textureArea);

  // Palette of colors
  const palette = new Uint8Array(buffer, texture.index + textureArea, PALETTE_SIZE);

  // RGB color which will be replaced with transparency
  const alphaColor: Uint8Array = palette.slice(PALETTE_ALPHA_INDEX, PALETTE_ALPHA_INDEX + RGB_SIZE);

  // Create new image buffer
  const imageBuffer = new Uint8ClampedArray(textureArea * RGBA_SIZE);

  // Parsing indexed color: every item in texture data is index of color in
  // colors palette
  for (let i = 0; i < textureData.length; i++) {
    const item = textureData[i];

    const paletteOffset = item * RGB_SIZE;
    const pixelOffset = i * RGBA_SIZE;

    // Checks is alpha color
    const isAlphaColor =
      palette[paletteOffset + 0] === alphaColor[0] &&
      palette[paletteOffset + 1] === alphaColor[1] &&
      palette[paletteOffset + 2] === alphaColor[2];

    if (isTextureMasked && isAlphaColor) {
      // This modifies the model's data. Sets the mask color to black.
      // This is also done by Jed's model viewer (export texture has black)
      imageBuffer[pixelOffset + 0] = 0; // red
      imageBuffer[pixelOffset + 1] = 0; // green
      imageBuffer[pixelOffset + 2] = 0; // blue
      imageBuffer[pixelOffset + 3] = 0; // alpha
    } else {
      // Just applying to texture image data
      imageBuffer[pixelOffset + 0] = palette[paletteOffset + 0]; // red
      imageBuffer[pixelOffset + 1] = palette[paletteOffset + 1]; // green
      imageBuffer[pixelOffset + 2] = palette[paletteOffset + 2]; // blue
      imageBuffer[pixelOffset + 3] = 255; // alpha
    }
  }

  return imageBuffer;
};
