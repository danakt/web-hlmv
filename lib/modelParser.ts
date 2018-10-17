import * as FastDataView                  from 'fast-dataview'
import * as structs                       from '../const/structs'
import { VERSION }                        from '../const/constants'
import { readStruct, readStructMultiple } from './binaryReader'
// eslint-disable-next-line no-unused-vars
import { Struct, StructResult }           from './dataTypes'

/**
 * Creates multiple reader
 */
const createMultipleParser = <T, S extends Struct<T>>(struct: S) => (
  dataView: DataView,
  offsetIndex: number,
  number: number
): StructResult<S>[] => readStructMultiple(dataView, struct, offsetIndex, number)

/** Parses header of the MDL file */
export const parseHeader = (dataView: DataView): structs.Header => readStruct(dataView, structs.header)

/** Parses bones */
export const parseBones = createMultipleParser(structs.bone)

/** Parses bone controllers */
export const parseBoneControllers = createMultipleParser(structs.bonecontroller)

/** Parses attachments */
export const parseAttachments = createMultipleParser(structs.attachment)

/** Parses bounding boxes */
export const parseHitboxes = createMultipleParser(structs.bbox)

/** Parses sequences */
export const parseSequences = createMultipleParser(structs.seqdesc)

/** Parses sequence groups */
export const parseSequenceGroups = createMultipleParser(structs.seqgroup)

/** Parses body parts */
export const parseBodyParts = createMultipleParser(structs.bodypart)

// TODO
// export const parseTransitions = (dataView: DataView, transitionIndex: number, numTransitions: number) =>
//   new Int32Array(dataView.buffer, transitionIndex, numTransitions * int32.byteLength),

/** Parses textures info */
export const parseTextures = createMultipleParser(structs.texture)

/** Parses skin references */
export const parseSkinRef = (dataView: DataView, skinRefOffset: number, numSkinRef: number) =>
  new Int16Array(dataView.buffer, skinRefOffset, numSkinRef)

/** Parses sub model */
export const parseSubModel = createMultipleParser(structs.subModel)

/** Parses meshes */
export const parseMeshes = createMultipleParser(structs.mesh)

/**
 * Returns parsed data of MDL file. A MDL file is a binary buffer divided in
 * two part: header and data. Information about the data and their position is
 * in the header.
 * @param modelBuffer The MDL file buffer
 * @returns {ModelDataParser}
 */
export const parseModel = (modelBuffer: ArrayBuffer) => {
  // Create the DataView object from buffer of a MDL file for parsing
  const dataView = new FastDataView(modelBuffer)

  // Reading header of the model
  const header = parseHeader(dataView)

  // Checking version of MDL file
  if (header.version !== VERSION) {
    throw new Error('Unsupported version of the MDL file')
  }

  // Checking textures of the model
  // TODO: Handle model without textures
  if (!header.textureindex || !header.numtextures) {
    throw new Error('No textures in the MDL file')
  }

  /**
   * The data that will be used to obtain another data
   */
  const bodyParts: structs.BodyPart[] = parseBodyParts(dataView, header.bodypartindex, header.numbodyparts)
  const subModels: structs.SubModel[][] = bodyParts.map(bodyPart =>
    parseSubModel(dataView, bodyPart.modelindex, bodyPart.nummodels)
  )
  const meshes = subModels.map(bodyPart =>
    bodyPart.map(subModel => parseMeshes(dataView, subModel.meshindex, subModel.nummesh))
  )

  return {
    /** Header */
    header,

    // Main data

    /** Bones info */
    bones:           parseBones(dataView, header.boneindex, header.numbones),
    /** Bone controllers */
    boneControllers: parseBoneControllers(dataView, header.bonecontrollerindex, header.numbonecontrollers),
    /** Model attachments */
    attachments:     parseAttachments(dataView, header.attachmentindex, header.numattachments),
    /** Model hitboxes */
    hitBoxes:        parseHitboxes(dataView, header.hitboxindex, header.numhitboxes),
    /** Model sequences info */
    sequences:       parseSequences(dataView, header.seqindex, header.numseq),
    /** Sequences groups */
    sequenceGroups:  parseSequenceGroups(dataView, header.seqgroupindex, header.numseqgroups),
    /** Body parts info */
    bodyParts,
    /** Textures info */
    textures:        parseTextures(dataView, header.textureindex, header.numtextures),
    /** Skins references */
    skinRef:         parseSkinRef(dataView, header.skinindex, header.numskinref),

    // Sub data

    /** Submodels info */
    subModels,
    /** Meshes info. Path: meshes[bodyPartIndex][subModelIndex][meshIndex] */
    meshes,
    /** Submodels vertices. Path: vertices[bodyPartIndex][subModelIndex] */
    vertices: subModels.map(bodyPart =>
      bodyPart.map(subModel => new Float32Array(modelBuffer, subModel.vertindex, subModel.numverts * 3))
    ),
    /** Bones vertices buffer. Path: vertBoneBuffer[bodyPartIndex][subModelIndex] */
    vertBoneBuffer: subModels.map(bodyPart =>
      bodyPart.map(subModel => new Uint8Array(modelBuffer, subModel.vertinfoindex, subModel.numverts))
    ),
    /** Mesh triangles. Path: meshes[bodyPartIndex][subModelIndex][meshIndex] */
    triangles: meshes.map(bodyPart =>
      bodyPart.map(subModel =>
        subModel.map(
          mesh => new Int16Array(modelBuffer, mesh.triindex, Math.floor((header.length - mesh.triindex) / 2))
        )
      )
    )
  }
}

/**
 * Type of model parsing result
 */
export type ModelData = ReturnType<typeof parseModel>
