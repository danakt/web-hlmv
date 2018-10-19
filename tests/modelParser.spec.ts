import * as fs           from 'fs'
import * as path         from 'path'
import * as FastDataView from 'fast-dataview'
import * as ModelParser  from '../lib/modelParser'

// Loading model for testing
const leetPath = path.resolve(__dirname, '../models/leet.mdl')
const leetBuffer: ArrayBuffer = fs.readFileSync(leetPath).buffer

const ratamahattaPath = path.resolve(__dirname, '../models/ratamahatta.md2')
const ratamahattaBuffer: ArrayBuffer = fs.readFileSync(ratamahattaPath).buffer

const dataView = new FastDataView(leetBuffer)
const header = ModelParser.parseHeader(dataView)

describe('parsing model parts', () => {
  test('should parse header', () => {
    const header = ModelParser.parseHeader(dataView)
    expect(header).toMatchSnapshot('leet header')
  })

  test('should parse bones', () => {
    const bones = ModelParser.parseBones(dataView, header.boneindex, header.numbones)
    expect(bones).toMatchSnapshot('leet bones')
  })

  test('should parse bone controllers', () => {
    const boneControllers = ModelParser.parseBoneControllers(
      dataView,
      header.bonecontrollerindex,
      header.numbonecontrollers
    )
    expect(boneControllers).toMatchSnapshot('leet bone controllers')
  })

  test('should parse attachments', () => {
    const attachments = ModelParser.parseAttachments(dataView, header.attachmentindex, header.numattachments)
    expect(attachments).toMatchSnapshot('leet attachments')
  })

  test('should parse hitboxes', () => {
    const hitBoxes = ModelParser.parseHitboxes(dataView, header.hitboxindex, header.numhitboxes)
    expect(hitBoxes).toMatchSnapshot('leet hitboxes')
  })

  test('should parse sequences', () => {
    const sequences = ModelParser.parseSequences(dataView, header.seqindex, header.numseq)
    expect(sequences).toMatchSnapshot('leet sequences')
  })

  test('should parse sequence groups', () => {
    const sequenceGroups = ModelParser.parseSequenceGroups(dataView, header.seqgroupindex, header.numseqgroups)
    expect(sequenceGroups).toMatchSnapshot('leet sequence groups')
  })

  test('should parse bodyparts', () => {
    const bodyParts = ModelParser.parseBodyParts(dataView, header.bodypartindex, header.numbodyparts)
    expect(bodyParts).toMatchSnapshot('leet body parts')
  })

  test('should parse textures', () => {
    const textures = ModelParser.parseTextures(dataView, header.textureindex, header.numtextures)
    expect(textures).toMatchSnapshot('leet textures info')
  })

  test('should parse skin references', () => {
    const skinRef = ModelParser.parseSkinRef(dataView, header.skinindex, header.numskinref)
    expect(skinRef).toMatchSnapshot('leet skin references')
  })

  test('should parse animation values', () => {
    const sequences = ModelParser.parseSequences(dataView, header.seqindex, header.numseq)
    const animations = ModelParser.parseAnimations(dataView, sequences, header.numbones)

    const animValues = ModelParser.parseAnimValues(dataView, sequences, animations, header.numbones)
    const slicedAnimValues = (animValues.array as Int16Array).slice(0, 1000)

    expect(slicedAnimValues).toMatchSnapshot('leet animation values from 0 to 1000')
  })
})

describe('parsing whole model', () => {
  test('just parsing without errors', () => {
    expect(() => {
      ModelParser.parseModel(leetBuffer)
    }).not.toThrowError()
  })

  xtest('equaling parsed data with valid data', () => {
    // const modelData: ModelParser.ModelData = ModelParser.parseModel(leetBuffer)
    // expect(modelData).toEqual(leetData)
  })

  test('should detect invalid version of model', () => {
    expect(() => {
      ModelParser.parseModel(ratamahattaBuffer)
    }).toThrowError('Unsupported version of the MDL file')
  })
})
