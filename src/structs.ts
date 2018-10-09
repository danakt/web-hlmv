import { StructResult, int32, float32, string, array } from './dataTypes'

/**
 * Head of mdl-file
 */
export const header = {
  /** Model format ID */
  id:          int32,
  /** Format version number */
  version:     int32,
  /** The internal name of the model */
  name:        string(64),
  /** Data size of MDL file in bytes */
  length:      int32,
  /** Position of player viewpoint relative to model origin */
  eyeposition: array(3, float32),
  /** Corner of model hull box with the least X/Y/Z values */
  max:         array(3, float32),
  /** Opposite corner of model hull box */
  min:         array(3, float32),
  /** Min position of view bounding box */
  bbmin:       array(3, float32),
  /** Max position of view bounding box */
  bbmax:       array(3, float32),
  /**
   * Binary flags in little-endian order.
   * ex (00000001, 00000000, 00000000, 11000000) means flags for position
   * 0, 30, and 31 are set. Set model flags section for more information
   */
  flags:       int32,
  // After this point, the header contains many references to offsets
  // within the MDL file and the number of items at those offsets.
  // Offsets are from the very beginning of the file.
  // Note that indexes/counts are not always paired and ordered consistently.

  /** Number of bones */
  numbones:            int32,
  /** Offset of first data section */
  boneindex:           int32,
  /** Number of bone controllers */
  numbonecontrollers:  int32,
  /** Offset of bone controllers */
  bonecontrollerindex: int32,
  /** Number of complex bounding boxes */
  numhitboxes:         int32,
  /** Offset of hitboxes */
  hitboxindex:         int32,
  /** Number of sequences */
  numseq:              int32,
  /** Offset of sequences */
  seqindex:            int32,
  /** Number of demand loaded sequences */
  numseqgroups:        int32,
  /** Offset of demand loaded sequences */
  seqgroupindex:       int32,
  /** Number of raw textures */
  numtextures:         int32,
  /** Offset of raw textures */
  textureindex:        int32,
  /** Offset of textures data */
  texturedataindex:    int32,
  /** Number of replaceable textures */
  numskinref:          int32,
  numskinfamilies:     int32,
  skinindex:           int32,
  /** Number of body parts */
  numbodyparts:        int32,
  /** Index of body parts */
  bodypartindex:       int32,
  /** Number queryable attachable points */
  numattachments:      int32,
  attachmentindex:     int32,
  // This seems to be obsolete.
  // Probably replaced by events that reference external sounds?
  soundtable:          int32,
  soundindex:          int32,
  soundgroups:         int32,
  soundgroupindex:     int32,
  /** Animation node to animation node transition graph */
  numtransitions:      int32,
  transitionindex:     int32
}

export type Header = StructResult<typeof header>
