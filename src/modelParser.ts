import * as structs                       from './structs'
import { VERSION }                        from './constants'
import { readStruct, readStructMultiple } from './binaryReader'

/**
 * Creates API for parsing MDL file. A MDL file is a binary buffer divided in
 * two part: header and data. Information about the data and their position is
 * in the header.
 * @param buffer The MDL-file buffer
 * @returns {ModelParser}
 */
export const createModelParser = (modelBuffer: ArrayBuffer) => {
  // Create the DataView object from buffer of a MDL file for parsing
  const dataView = new DataView(modelBuffer)

  return {
    /**
     * Parses header of the MDL file
     */
    parseHeader: (): structs.Header => readStruct(dataView, structs.header),

    /**
     * Parses textures info
     * @param texturesOffset Offset of textures info
     * @param texturesNum Number of textures
     */
    parseTextures: (texturesOffset: number, texturesNum: number): structs.Texture[] =>
      readStructMultiple(dataView, structs.texture, texturesOffset, texturesNum),

    /**
     * Parses skin references
     * @param skinRefOffset Offset of skin references
     * @param numSkinRef Number of skin references
     */
    parseSkinRef: (skinRefOffset: number, numSkinRef: number) =>
      new Int16Array(dataView.buffer, skinRefOffset, numSkinRef),

    /**
     * Parses bones
     * @param boneIndex Offset of start bones data
     * @param numBones Number of bones
     */
    parseBones: (boneIndex: number, numBones: number): structs.Bone[] =>
      readStructMultiple(dataView, structs.bone, boneIndex, numBones),

    /**
     * Parses bone controllers
     * @param boneControllerIndex Offset of start bone controllers
     * @param numBoneControllers Number of bone controllers
     */
    parseBoneControllers: (boneControllerIndex: number, numBoneControllers: number): structs.BoneController[] =>
      readStructMultiple(dataView, structs.bonecontroller, boneControllerIndex, numBoneControllers),

    /**
     * Parses attachments
     * @param attachmentOffset Offset of attachments in buffer
     * @param numAttachments Number of attachments
     */
    parseAttachments: (attachmentOffset: number, numAttachments: number): structs.Attachment[] =>
      readStructMultiple(dataView, structs.attachment, attachmentOffset, numAttachments),

    /**
     * Parses bounding boxes
     * @param bboxOffset Offset of hitboxes
     * @param numBboxes Number of hitboxes
     */
    parseHitboxes: (bboxOffset: number, numBboxes: number): structs.BoundingBox[] =>
      readStructMultiple(dataView, structs.bbox, bboxOffset, numBboxes),

    /**
     * Parses sequences
     * @param seqIndex Offset of sequences
     * @param numSeq Number of sequences
     */
    parseSequences: (seqIndex: number, numSeq: number): structs.SequenceDesc[] =>
      readStructMultiple(dataView, structs.seqdesc, seqIndex, numSeq),

    /**
     * Returns parsed data of the MDL file
     */
    parseModel() {
      // Reading header of the model
      const header = readStruct(dataView, structs.header)

      // Checking version of MDL file
      if (header.version !== VERSION) {
        throw new Error('Unsupported version of the MDL file')
      }

      // Checking textures of the model
      // TODO: Handle model without textures
      if (!header.textureindex || !header.numtextures) {
        throw new Error('No textures in the MDL file')
      }

      // console.log(
      //   Object.keys(header)
      //     .filter(key => key.includes('index'))
      //     .map(key => [key, header[key as keyof typeof header]])
      //     .filter(entry => !!entry[1])
      //     .sort((a, b) => (a[1] > b[1] ? 1 : -1))
      // )

      return {
        bones:           this.parseBones(header.boneindex, header.numbones),
        boneControllers: this.parseBoneControllers(header.bonecontrollerindex, header.numbonecontrollers),
        attachments:     this.parseAttachments(header.attachmentindex, header.numattachments),
        hitBoxes:        this.parseHitboxes(header.hitboxindex, header.numhitboxes),
        sequences:       this.parseSequences(header.seqindex, header.numseq),

        textures: this.parseTextures(header.textureindex, header.numtextures),
        skinRef:  this.parseSkinRef(header.skinindex, header.numskinref)
      }
    }
  }
}

/** Parser API interface */
export type ModelParser = ReturnType<typeof createModelParser>

// ["boneindex", 244]
// ["bonecontrollerindex", 6404]
// ["attachmentindex", 6428]
// ["hitboxindex", 6604]

// ["seqindex", 2072508]
// ["seqgroupindex", 2094628]
// ["bodypartindex", 2094732]
// ["transitionindex", 2094732]
// ["textureindex", 2116816]
// ["skinindex", 2117056]
// ["texturedataindex", 2117064]
