import { StructResult, int, float, string, array, vec3 } from './dataTypes'
import { MAX_PER_BONE_CONTROLLERS }                      from './constants'

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
  value:          array(MAX_PER_BONE_CONTROLLERS, float),
  /** Scale for delta DoF values */
  scale:          array(MAX_PER_BONE_CONTROLLERS, float)
}

export type Bone = StructResult<typeof bone>

/**
 * Bone controllers
 */
export const bonecontroller = {
  bone:  int,
  type:  int,
  start: float,
  end:   float,
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
 * Sequence description
 */
export const seqdesc = {
  /** Sequence label */
  label: string(32),

  /** Frames per second */
  fps:   float,
  /** Looping/non-looping flags */
  flags: int,

  activity:  int,
  actweight: int,

  numevents:  int,
  eventindex: int,

  /** Number of frames per sequence */
  numframes: int,

  /** Number of foot pivots */
  numpivots:  int,
  pivotindex: int,

  motiontype:         int,
  motionbone:         int,
  linearmovement:     vec3,
  automoveposindex:   int,
  automoveangleindex: int,

  /** Per sequence bounding box */
  bbmin: vec3,
  bbmax: vec3,

  numblends: int,
  /** "anim" pointer relative to start of sequence group data */
  animindex: int,

  // [blend][bone][X, Y, Z, XR, YR, ZR]
  /** X, Y, Z, XR, YR, ZR */
  blendtype:   array(2, int),
  /** Starting value */
  blendstart:  array(2, float),
  /** Ending value */
  blendend:    array(2, float),
  blendparent: int,

  /** Sequence group for demand loading */
  seqgroup: int,

  /** Transition node at entry */
  entrynode: int,
  /** Transition node at exit */
  exitnode:  int,
  /** Transition rules */
  nodeflags: int,

  /** Auto advancing sequences */
  nextseq: int
}

export type SequenceDesc = StructResult<typeof seqdesc>

/**
 * Demand loaded sequence groups
 */
export const seqgroup = {
  /** Textual name */
  label:   string(32),
  /** File name */
  name:    string(64),
  /** Was "cache" - index pointer */
  unused1: int,
  /** Was "data" - hack for group 0 */
  unused2: int
}

export type SequenceGroup = StructResult<typeof seqgroup>

/**
 * Body part index
 */
export const bodypart = {
  name:       string(64),
  nummodels:  int,
  base:       int,
  /** Index into models array */
  modelindex: int
}

export type BodyPart = StructResult<typeof bodypart>

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
