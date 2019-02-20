import { StructResult, int, float, string, array, vec3, ushort } from '../lib/dataTypes'
import { MAX_PER_BONE_CONTROLLERS }                              from './constants'

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
  eyePosition: vec3,
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
  numBones:            int,
  /** Offset of first data section */
  boneIndex:           int,
  /** Number of bone controllers */
  numBoneControllers:  int,
  /** Offset of bone controllers */
  boneControllerIndex: int,
  /** Number of complex bounding boxes */
  numHitboxes:         int,
  /** Offset of hit boxes */
  hitBoxIndex:         int,
  /** Number of sequences */
  numSeq:              int,
  /** Offset of sequences */
  seqIndex:            int,
  /** Number of demand loaded sequences */
  numSeqGroups:        int,
  /** Offset of demand loaded sequences */
  seqGroupIndex:       int,
  /** Number of raw textures */
  numTextures:         int,
  /** Offset of raw textures */
  textureIndex:        int,
  /** Offset of textures data */
  textureDataIndex:    int,
  /** Number of replaceable textures */
  numSkinRef:          int,
  numSkinFamilies:     int,
  skinIndex:           int,
  /** Number of body parts */
  numBodyParts:        int,
  /** Index of body parts */
  bodyPartIndex:       int,
  /** Number queryable attachable points */
  numAttachments:      int,
  attachmentIndex:     int,
  // This seems to be obsolete.
  // Probably replaced by events that reference external sounds?
  soundTable:          int,
  soundIndex:          int,
  soundGroups:         int,
  soundGroupIndex:     int,
  /** Animation node to animation node transition graph */
  numTransitions:      int,
  transitionIndex:     int
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
  boneController: array(MAX_PER_BONE_CONTROLLERS, int),
  /** Default DoF values */
  value:          array(MAX_PER_BONE_CONTROLLERS, float),
  /** Scale for delta DoF values */
  scale:          array(MAX_PER_BONE_CONTROLLERS, float)
}

export type Bone = StructResult<typeof bone>

/**
 * Bone controllers
 */
export const boneController = {
  bone:  int,
  type:  int,
  start: float,
  end:   float,
  rest:  int,
  index: int
}

export type BoneController = StructResult<typeof boneController>

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
export const boundingBox = {
  bone:  int,
  /** Intersection group */
  group: int,
  /** Bounding box */
  bbmin: vec3,
  bbmax: vec3
}

export type BoundingBox = StructResult<typeof boundingBox>

/**
 * Sequence description
 */
export const seqDesc = {
  /** Sequence label */
  label: string(32),

  /** Frames per second */
  fps:   float,
  /** Looping/non-looping flags */
  flags: int,

  activity:  int,
  actWeight: int,

  numEvents:  int,
  eventIndex: int,

  /** Number of frames per sequence */
  numFrames: int,

  /** Number of foot pivots */
  numPivots:  int,
  pivotIndex: int,

  motionType:         int,
  motionBone:         int,
  linearMovement:     vec3,
  autoMovePosIndex:   int,
  autoMoveAngleIndex: int,

  /** Per sequence bounding box */
  bbmin: vec3,
  bbmax: vec3,

  numBlends: int,
  /** "anim" pointer relative to start of sequence group data */
  animIndex: int,

  // [blend][bone][X, Y, Z, XR, YR, ZR]
  /** X, Y, Z, XR, YR, ZR */
  blendType:   array(2, int),
  /** Starting value */
  blendStart:  array(2, float),
  /** Ending value */
  blendEnd:    array(2, float),
  blendParent: int,

  /** Sequence group for demand loading */
  seqGroup: int,

  /** Transition node at entry */
  entryNode: int,
  /** Transition node at exit */
  exitNode:  int,
  /** Transition rules */
  nodeFlags: int,

  /** Auto advancing sequences */
  nextSeq: int
}

export type SequenceDesc = StructResult<typeof seqDesc>

/**
 * Demand loaded sequence groups
 */
export const seqGroup = {
  /** Textual name */
  label:   string(32),
  /** File name */
  name:    string(64),
  /** Was "cache" - index pointer */
  unused1: int,
  /** Was "data" - hack for group 0 */
  unused2: int
}

export type SequenceGroup = StructResult<typeof seqGroup>

/**
 * Body part index
 */
export const bodyPart = {
  name:       string(64),
  numModels:  int,
  base:       int,
  /** Index into models array */
  modelIndex: int
}

export type BodyPart = StructResult<typeof bodyPart>

/**
 * Texture info
 */
export const texture = {
  /** Texture name */
  name:   string(64),
  /** Flags */
  flags:  int,
  /** Texture width */
  width:  int,
  /** Texture height */
  height: int,
  /** Texture data offset */
  index:  int
}

export type Texture = StructResult<typeof texture>

/**
 * Sub models
 */
export const subModel = {
  name: string(64),

  type: int,

  boundingRadius: float,

  numMesh:   int,
  meshIndex: int,

  /** Number of unique vertices */
  numVerts:      int,
  /** Vertex bone info */
  vertInfoIndex: int,
  /** Vertex vec3 */
  vertIndex:     int,
  /** Number of unique surface normals */
  numNorms:      int,
  /** Normal bone info */
  normInfoIndex: int,
  /** Normal vec3 */
  normIndex:     int,

  /** Deformation groups */
  numGroups:  int,
  groupIndex: int
}

export type SubModel = StructResult<typeof subModel>

/**
 * Mesh info
 */
export const mesh = {
  numTris:   int,
  triIndex:  int,
  skinRef:   int,
  /** Per mesh normals */
  numNorms:  int,
  /** Normal vec3_t */
  normIndex: int
}

export type Mesh = StructResult<typeof mesh>

/**
 * Animation description
 */
export const animation = {
  offset: array(6, ushort)
}

export type Animation = StructResult<typeof animation>
