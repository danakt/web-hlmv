import * as structs                       from '../const/structs'
import { VERSION }                        from '../const/constants'
import { readStruct, readStructMultiple } from './binaryReader'
// eslint-disable-next-line no-unused-vars
import { Struct, StructResult }           from './dataTypes'

/**
 * Creates API for parsing data of MDL file. A MDL file is a binary buffer
 * divided in two part: header and data. Information about the data and their
 * position is in the header
 * @param buffer The MDL-file buffer
 * @returns {ModelDataParser}
 */
export const createModelDataParser = (modelBuffer: ArrayBuffer) => {
  // Create the DataView object from buffer of a MDL file for parsing
  const dataView = new DataView(modelBuffer)

  /**
   * Creates multiple reader
   */
  const createMultipleParser = <T, S extends Struct<T>>(struct: S) => (
    offsetIndex: number,
    number: number
  ): StructResult<S>[] => readStructMultiple(dataView, struct, offsetIndex, number)

  return {
    /** Parses header of the MDL file */
    parseHeader: (): structs.Header => readStruct(dataView, structs.header),

    /** Parses bones */
    parseBones: createMultipleParser(structs.bone),

    /** Parses bone controllers */
    parseBoneControllers: createMultipleParser(structs.bonecontroller),

    /** Parses attachments */
    parseAttachments: createMultipleParser(structs.attachment),

    /** Parses bounding boxes */
    parseHitboxes: createMultipleParser(structs.bbox),

    /** Parses sequences */
    parseSequences: createMultipleParser(structs.seqdesc),

    /** Parses sequence groups */
    parseSequenceGroups: createMultipleParser(structs.seqgroup),

    /** Parses body parts */
    parseBodyParts: createMultipleParser(structs.bodypart),

    // TODO
    // parseTransitions: (transitionIndex: number, numTransitions: number) =>
    //   new Int32Array(dataView.buffer, transitionIndex, numTransitions * int32.byteLength),

    /** Parses textures info */
    parseTextures: createMultipleParser(structs.texture),

    /** Parses skin references */
    parseSkinRef: (skinRefOffset: number, numSkinRef: number) =>
      new Int16Array(dataView.buffer, skinRefOffset, numSkinRef)

    // /** Parses textures info */
    // parseSkins: (skinOffset: number, offsetNum: number): structs.Texture[] =>
    //   readStructMultiple(dataView, structs.texture, skinOffset, offsetNum),
  }
}

/**
 * Parser API interface
 */
export type ModelDataParser = ReturnType<typeof createModelDataParser>

/**
 * Returns parsed data of the MDL file
 */
export const parseModel = (modelBuffer: ArrayBuffer) => {
  // Create API for parsing model data
  const parser = createModelDataParser(modelBuffer)

  // Reading header of the model
  const header = parser.parseHeader()

  // Checking version of MDL file
  if (header.version !== VERSION) {
    throw new Error('Unsupported version of the MDL file')
  }

  // Checking textures of the model
  // TODO: Handle model without textures
  if (!header.textureindex || !header.numtextures) {
    throw new Error('No textures in the MDL file')
  }

  return {
    header,
    bones:           parser.parseBones(header.boneindex, header.numbones),
    boneControllers: parser.parseBoneControllers(header.bonecontrollerindex, header.numbonecontrollers),
    attachments:     parser.parseAttachments(header.attachmentindex, header.numattachments),
    hitBoxes:        parser.parseHitboxes(header.hitboxindex, header.numhitboxes),
    sequences:       parser.parseSequences(header.seqindex, header.numseq),
    sequenceGroups:  parser.parseSequenceGroups(header.seqgroupindex, header.numseqgroups),
    bodyParts:       parser.parseBodyParts(header.bodypartindex, header.numbodyparts),
    // transitions
    textures:        parser.parseTextures(header.textureindex, header.numtextures),
    // skins
    skinRef:         parser.parseSkinRef(header.skinindex, header.numskinref)
    // texturedata
  }
}

/**
 * Type of model parsing result
 */
export type ModelData = ReturnType<typeof parseModel>
