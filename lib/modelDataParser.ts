import * as FastDataView                                from 'fast-dataview'
import * as MultiArrayView                              from 'multi-array-view'
import * as structs                                     from '../const/structs'
import { MAX_SRCBONES, AXLES_NUM, ANIM_VALUE, VERSION } from '../const/constants'
import * as BinaryReader                                from './binaryReader'
import { Struct, StructResult, short, ubyte }           from './dataTypes'

/**
 * Creates multiple reader
 * @internal
 */
const createMultipleParser = <S extends Struct>(struct: S) => (
  dataView: DataView,
  offsetIndex: number,
  number: number
): StructResult<S>[] => BinaryReader.readStructMultiple(dataView, struct, offsetIndex, number)

/** Parses header of the MDL file */
export const parseHeader = (dataView: DataView): structs.Header => BinaryReader.readStruct(dataView, structs.header)

/** Parses bones */
export const parseBones = createMultipleParser(structs.bone)

/** Parses bone controllers */
export const parseBoneControllers = createMultipleParser(structs.boneController)

/** Parses attachments */
export const parseAttachments = createMultipleParser(structs.attachment)

/** Parses bounding boxes */
export const parseHitboxes = createMultipleParser(structs.boundingBox)

/** Parses sequences */
export const parseSequences = createMultipleParser(structs.seqDesc)

/** Parses sequence groups */
export const parseSequenceGroups = createMultipleParser(structs.seqGroup)

/** Parses body parts */
export const parseBodyParts = createMultipleParser(structs.bodyPart)

/** Parses textures info */
export const parseTextures = createMultipleParser(structs.texture)

/** Parses skin references */
export const parseSkinRef = (buffer: ArrayBuffer, skinRefOffset: number, numSkinRef: number) =>
  new Int16Array(buffer, skinRefOffset, numSkinRef)

/**
 * Parses sub model
 * @todo make shorter
 */
export const parseSubModel = (dataView: DataView, bodyParts: structs.BodyPart[]): structs.SubModel[][] =>
  bodyParts.map(bodyPart =>
    BinaryReader.readStructMultiple(dataView, structs.subModel, bodyPart.modelIndex, bodyPart.numModels)
  )

/**
 * Parses meshes
 * @todo make shorter
 */
export const parseMeshes = (dataView: DataView, subModels: structs.SubModel[][]): structs.Mesh[][][] =>
  subModels.map(bodyPart =>
    bodyPart.map(subModel =>
      BinaryReader.readStructMultiple(dataView, structs.mesh, subModel.meshIndex, subModel.numMesh)
    )
  )

/**
 * Parses submodels vertices.
 * Path: vertices[bodyPartIndex][subModelIndex]
 */
export const parseVertices = (buffer: ArrayBuffer, subModels: structs.SubModel[][]): Float32Array[][] => {
  return subModels.map(bodyPart =>
    bodyPart.map(subModel => new Float32Array(buffer, subModel.vertIndex, subModel.numVerts * 3))
  )
}

/**
 * Parses ones vertices buffer.
 * Path: vertBoneBuffer[bodyPartIndex][subModelIndex]
 */
export const parseVertBoneBuffer = (buffer: ArrayBuffer, subModels: structs.SubModel[][]): Uint8Array[][] =>
  subModels.map(bodyPart => bodyPart.map(subModel => new Uint8Array(buffer, subModel.vertInfoIndex, subModel.numVerts)))

/**
 * Parses meshes triangles.
 * Path: meshes[bodyPartIndex][subModelIndex][meshIndex]
 */
export const parseTriangles = (
  buffer: ArrayBuffer,
  meshes: structs.Mesh[][][],
  headerLength: number
): Int16Array[][][] =>
  meshes.map(bodyPart =>
    bodyPart.map(subModel =>
      subModel.map(mesh => new Int16Array(buffer, mesh.triIndex, Math.floor((headerLength - mesh.triIndex) / 2)))
    )
  )

/**
 * Parses bone animations
 * @todo make shorter
 */
export const parseAnimations = (
  dataView: DataView,
  sequences: structs.SequenceDesc[],
  numBones: number
): structs.Animation[][] =>
  sequences.map(sequence => BinaryReader.readStructMultiple(dataView, structs.animation, sequence.animIndex, numBones))

/**
 * Parses animation values
 */
export const parseAnimValues = (
  dataView: DataView,
  sequences: structs.SequenceDesc[],
  animations: structs.Animation[][],
  numBones: number
): MultiArrayView<number> => {
  const animStructLength = BinaryReader.getStructLength(structs.animation)

  // Create frames values array
  const animValues = MultiArrayView.create([sequences.length, numBones, AXLES_NUM, MAX_SRCBONES, 3], Int16Array)

  for (let i = 0; i < sequences.length; i++) {
    for (let j = 0; j < numBones; j++) {
      const animationIndex = /* seqGroup.data + */ sequences[i].animIndex + j * animStructLength

      for (let axis = 0; axis < AXLES_NUM; axis++) {
        for (let v = 0; v < MAX_SRCBONES; v++) {
          const offset = animationIndex + animations[i][j].offset[axis + AXLES_NUM] + v * short.byteLength

          // Using the "method" instead of applying a structure is an optimization of reading
          const value = short.getValue(dataView, offset)
          const valid = ubyte.getValue(dataView, offset)
          const total = ubyte.getValue(dataView, offset + ubyte.byteLength)

          animValues.set(value, i, j, axis, v, ANIM_VALUE.VALUE)
          animValues.set(valid, i, j, axis, v, ANIM_VALUE.VALID)
          animValues.set(total, i, j, axis, v, ANIM_VALUE.TOTAL)
        }
      }
    }
  }

  return animValues
}

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
  if (!header.textureIndex || !header.numTextures) {
    throw new Error('No textures in the MDL file')
  }

  /// The data below will be used to obtain another data

  // Body parts info
  const bodyParts: structs.BodyPart[] = parseBodyParts(dataView, header.bodyPartIndex, header.numBodyParts)
  // Submodels info
  const subModels: structs.SubModel[][] = parseSubModel(dataView, bodyParts)
  // Meshes info
  const meshes = parseMeshes(dataView, subModels)

  //  Model sequences info
  const sequences = parseSequences(dataView, header.seqIndex, header.numSeq)
  // Bones animations
  const animations = parseAnimations(dataView, sequences, header.numBones)
  // Animation frames
  const animValues = parseAnimValues(dataView, sequences, animations, header.numBones)

  const modelData = {
    /** The header of the MDL file */
    header,

    // Main data that was obtained directly from the MDL file header

    /** Bones info */
    bones:           parseBones(dataView, header.boneIndex, header.numBones),
    /** Bone controllers */
    boneControllers: parseBoneControllers(dataView, header.boneControllerIndex, header.numBoneControllers),
    /** Model attachments */
    attachments:     parseAttachments(dataView, header.attachmentIndex, header.numAttachments),
    /** Model hitboxes */
    hitBoxes:        parseHitboxes(dataView, header.hitBoxIndex, header.numHitboxes),
    /** Model sequences info */
    sequences,
    /** Sequences groups */
    sequenceGroups:  parseSequenceGroups(dataView, header.seqGroupIndex, header.numSeqGroups),
    /** Body parts info */
    bodyParts,
    /** Textures info */
    textures:        parseTextures(dataView, header.textureIndex, header.numTextures),
    /** Skins references */
    skinRef:         parseSkinRef(dataView.buffer, header.skinIndex, header.numSkinRef),

    // Sub models data. This data was obtained by parsing data from body parts

    /** Submodels info */
    subModels,
    /** Meshes info. Path: meshes[bodyPartIndex][subModelIndex][meshIndex] */
    meshes,
    /** Submodels vertices. Path: vertices[bodyPartIndex][subModelIndex] */
    vertices:       parseVertices(dataView.buffer, subModels),
    /** Bones vertices buffer. Path: vertBoneBuffer[bodyPartIndex][subModelIndex] */
    vertBoneBuffer: parseVertBoneBuffer(dataView.buffer, subModels),
    /** Mesh triangles. Path: meshes[bodyPartIndex][subModelIndex][meshIndex] */
    triangles:      parseTriangles(dataView.buffer, meshes, header.length),

    // Sequences data

    /** Bones animations */
    animations,
    /** Animation frames */
    animValues
  }

  return modelData
}

/**
 * Type of model parsing result
 */
export type ModelData = ReturnType<typeof parseModel>
