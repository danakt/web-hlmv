import * as fs           from 'fs'
import * as path         from 'path'
import * as FastDataView from 'fast-dataview'
import {
  parseModel,
  // ModelData,
  parseHeader,
  parseBones,
  parseBoneControllers,
  parseAttachments,
  parseHitboxes,
  parseSequences,
  parseSequenceGroups,
  parseBodyParts,
  parseTextures,
  parseSkinRef
} from '../lib/modelParser'
import { leetData } from './__mock__'

// Loading model for testing
const leetPath = path.resolve(__dirname, '../models/leet.mdl')
const leetBuffer: ArrayBuffer = fs.readFileSync(leetPath).buffer

const ratamahattaPath = path.resolve(__dirname, '../models/ratamahatta.md2')
const ratamahattaBuffer: ArrayBuffer = fs.readFileSync(ratamahattaPath).buffer

const dataView = new FastDataView(leetBuffer)
const header = parseHeader(dataView)

describe('parsing model parts', () => {
  test('should parse header', () => {
    const header = parseHeader(dataView)
    expect(header).toEqual(leetData.header)
  })

  test('should parse bones', () => {
    const bones = parseBones(dataView, header.boneindex, header.numbones)
    expect(bones).toEqual(leetData.bones)
  })

  test('should parse bone controllers', () => {
    const boneControllers = parseBoneControllers(dataView, header.bonecontrollerindex, header.numbonecontrollers)
    expect(boneControllers).toEqual(leetData.boneControllers)
  })

  test('should parse attachments', () => {
    const attachments = parseAttachments(dataView, header.attachmentindex, header.numattachments)
    expect(attachments).toEqual(leetData.attachments)
  })

  test('should parse hitboxes', () => {
    const hitBoxes = parseHitboxes(dataView, header.hitboxindex, header.numhitboxes)
    expect(hitBoxes).toEqual(leetData.hitBoxes)
  })

  test('should parse sequences', () => {
    const sequences = parseSequences(dataView, header.seqindex, header.numseq)
    expect(sequences).toEqual(leetData.sequences)
  })

  test('should parse sequence groups', () => {
    const sequenceGroups = parseSequenceGroups(dataView, header.seqgroupindex, header.numseqgroups)
    expect(sequenceGroups).toEqual(leetData.sequenceGroups)
  })

  test('should parse bodyparts', () => {
    const bodyParts = parseBodyParts(dataView, header.bodypartindex, header.numbodyparts)
    expect(bodyParts).toEqual(leetData.bodyParts)
  })

  test('should parse textures', () => {
    const textures = parseTextures(dataView, header.textureindex, header.numtextures)
    expect(textures).toEqual(leetData.textures)
  })

  test('should parse skin references', () => {
    const skinRef = parseSkinRef(dataView, header.skinindex, header.numskinref)
    expect(skinRef).toEqual(leetData.skinRef)
  })
})

describe('parsing whole model', () => {
  test('just parsing without errors', () => {
    expect(() => {
      parseModel(leetBuffer)
    }).not.toThrowError()
  })

  //   test('equaling parsed data with valid data', () => {
  //     const modelData: ModelData = parseModel(leetBuffer)

  //     expect(modelData).toEqual(leetData)
  //   })

  test('should detect invalid version of model', () => {
    expect(() => {
      parseModel(ratamahattaBuffer)
    }).toThrowError('Unsupported version of the MDL file')
  })
})
