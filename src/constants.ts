/**
 * Supported model format version
 */
export const VERSION = 10

/**
 * Maximum number of bone controllers per bone
 */
export const MAX_PER_BONE_CONTROLLERS = 6

/**
 * Flag of texture masking
 */
export const NF_MASKED = 0x0040

/**
 * Number of colors
 */
export const PALETTE_ENTRIES = 256

/**
 * Number of channels for RGB color. Was "PALETTE_CHANNELS"
 */
export const RGB_SIZE = 3

/**
 * Number of channels for RGBA color. Was "PALETTE_CHANNELS_ALPHA"
 */
export const RGBA_SIZE = 4

/**
 * Total size of a palette, in bytes.
 */
export const PALETTE_SIZE = PALETTE_ENTRIES * RGB_SIZE

/**
 * The index in a palette where the alpha color is stored. Used for transparent textures.
 */
export const PALETTE_ALPHA_INDEX = 255 * RGB_SIZE
