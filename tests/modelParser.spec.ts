import * as fs                                          from 'fs'
import * as path                                        from 'path'
import { createModelDataParser, parseModel, ModelData } from '../lib/modelParser'
import { leetData }                                     from '../mock'

// Loading model for testing
const leetPath = path.resolve(__dirname, '../models/leet.mdl')
const leetBuffer: ArrayBuffer = fs.readFileSync(leetPath).buffer

const ratamahattaPath = path.resolve(__dirname, '../models/ratamahatta.md2')
const ratamahattaBuffer: ArrayBuffer = fs.readFileSync(ratamahattaPath).buffer

const modelParser = createModelDataParser(leetBuffer)
const header = modelParser.parseHeader()

describe('parsing model parts', () => {
  test('should parse header', () => {
    const header = modelParser.parseHeader()
    expect(header).toEqual(leetData.header)
  })

  test('should parse bones', () => {
    const bones = modelParser.parseBones(header.boneindex, header.numbones)
    expect(bones).toEqual(leetData.bones)
  })

  test('should parse bone controllers', () => {
    const boneControllers = modelParser.parseBoneControllers(header.bonecontrollerindex, header.numbonecontrollers)
    expect(boneControllers).toEqual(leetData.boneControllers)
  })

  test('should parse attachments', () => {
    const attachments = modelParser.parseAttachments(header.attachmentindex, header.numattachments)
    expect(attachments).toEqual(leetData.attachments)
  })

  test('should parse hitboxes', () => {
    const hitBoxes = modelParser.parseHitboxes(header.hitboxindex, header.numhitboxes)
    expect(hitBoxes).toEqual(leetData.hitBoxes)
  })

  test('should parse sequences', () => {
    const sequences = modelParser.parseSequences(header.seqindex, header.numseq)
    expect(sequences).toEqual(leetData.sequences)
  })

  test('should parse sequence groups', () => {
    const sequenceGroups = modelParser.parseSequenceGroups(header.seqgroupindex, header.numseqgroups)
    expect(sequenceGroups).toEqual(leetData.sequenceGroups)
  })

  test('should parse bodyparts', () => {
    const bodyParts = modelParser.parseBodyParts(header.bodypartindex, header.numbodyparts)
    expect(bodyParts).toEqual(leetData.bodyParts)
  })

  test('should parse textures', () => {
    const textures = modelParser.parseTextures(header.textureindex, header.numtextures)
    expect(textures).toEqual(leetData.textures)
  })

  test('should parse skin references', () => {
    const skinRef = modelParser.parseSkinRef(header.skinindex, header.numskinref)
    expect(skinRef).toEqual(leetData.skinRef)
  })
})

describe('whole model parsing', () => {
  test('just parsing without errors', () => {
    expect(() => {
      parseModel(leetBuffer)
    }).not.toThrowError()
  })

  test('equaling parsed data with valid data', () => {
    const modelData: ModelData = parseModel(leetBuffer)

    expect(modelData).toEqual(leetData)
  })

  test('should detect invalid version of model', () => {
    expect(() => {
      parseModel(ratamahattaBuffer)
    }).toThrowError('Unsupported version of the MDL file')
  })
})
