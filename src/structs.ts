import { StructResult, int, float32, string, array, uint32, vec3 } from './dataTypes'
import { MAX_PER_BONE_CONTROLLERS }                                from './constants'

/**
 * Head of mdl-file
 */
export const header = {
  /** Model format ID */
  id:          int,
  /** Format version number */
  version:     int,
  /** The internal name of the model */
  name:        string(64),
  /** Data size of MDL file in bytes */
  length:      int,
  /** Position of player viewpoint relative to model origin */
  eyeposition: vec3,
  /** Corner of model hull box with the least X/Y/Z values */
  max:         vec3,
  /** Opposite corner of model hull box */
  min:         vec3,
  /** Min position of view bounding box */
  bbmin:       vec3,
  /** Max position of view bounding box */
  bbmax:       vec3,
  /**
   * Binary flags in little-endian order.
   * ex (00000001, 00000000, 00000000, 11000000) means flags for position
   * 0, 30, and 31 are set. Set model flags section for more information
   */
  flags:       int,
  // After this point, the header contains many references to offsets
  // within the MDL file and the number of items at those offsets.
  // Offsets are from the very beginning of the file.
  // Note that indexes/counts are not always paired and ordered consistently.

  /** Number of bones */
  numbones:            int,
  /** Offset of first data section */
  boneindex:           int,
  /** Number of bone controllers */
  numbonecontrollers:  int,
  /** Offset of bone controllers */
  bonecontrollerindex: int,
  /** Number of complex bounding boxes */
  numhitboxes:         int,
  /** Offset of hitboxes */
  hitboxindex:         int,
  /** Number of sequences */
  numseq:              int,
  /** Offset of sequences */
  seqindex:            int,
  /** Number of demand loaded sequences */
  numseqgroups:        int,
  /** Offset of demand loaded sequences */
  seqgroupindex:       int,
  /** Number of raw textures */
  numtextures:         int,
  /** Offset of raw textures */
  textureindex:        int,
  /** Offset of textures data */
  texturedataindex:    int,
  /** Number of replaceable textures */
  numskinref:          int,
  numskinfamilies:     int,
  skinindex:           int,
  /** Number of body parts */
  numbodyparts:        int,
  /** Index of body parts */
  bodypartindex:       int,
  /** Number queryable attachable points */
  numattachments:      int,
  attachmentindex:     int,
  // This seems to be obsolete.
  // Probably replaced by events that reference external sounds?
  soundtable:          int,
  soundindex:          int,
  soundgroups:         int,
  soundgroupindex:     int,
  /** Animation node to animation node transition graph */
  numtransitions:      int,
  transitionindex:     int
}

export type Header = StructResult<typeof header>

/**
 * Bone description
 */
export const bone = {
  /** Bone name for symbolic links */
  name:           string(32),
  /** Parent bone */
  parent:         int,
  /** ?? */
  flags:          int,
  /** Bone controller index, -1 == none */
  bonecontroller: array(MAX_PER_BONE_CONTROLLERS, int),
  /** Default DoF values */
  value:          array(MAX_PER_BONE_CONTROLLERS, float32),
  /** Scale for delta DoF values */
  scale:          array(MAX_PER_BONE_CONTROLLERS, float32)
}

export type Bone = StructResult<typeof bone>

/**
 * Bone controllers
 */
export const bonecontroller = {
  bone:  int,
  type:  int,
  start: float32,
  end:   float32,
  rest:  int,
  index: int
}

export type BoneController = StructResult<typeof bonecontroller>

/**
 * Attachment
 */
export const attachment = {
  name:    string(32),
  type:    int,
  bone:    int,
  /** Attachment point */
  org:     vec3,
  vectors: array(3, vec3)
}

export type Attachment = StructResult<typeof attachment>

/**
 * Bounding boxes
 */
export const bbox = {
  bone:  int,
  /** Intersection group */
  group: int,
  /** Bounding box */
  bbmin: vec3,
  bbmax: vec3
}

export type BoundingBox = StructResult<typeof bbox>

/**
 * Texture info
 */
export const texture = {
  /** Texture name */
  name:   string(64),
  /** Flags */
  flags:  uint32,
  /** Texture width */
  width:  uint32,
  /** Texture height */
  height: uint32,
  /** Texture data offset */
  index:  uint32
}

export type Texture = StructResult<typeof texture>
