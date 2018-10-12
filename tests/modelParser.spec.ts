import * as fs               from 'fs'
import * as path             from 'path'
import { createModelParser } from '../src/modelParser'
import {
  leetHeader,
  leetBoneControllers,
  leetAttachments,
  leetTexturesInfo,
  leetSkinRef,
  leetSequenceGroups
} from '../mock/mock'
import { leetBones }     from '../mock/mock-bones'
import { leetHitBoxes }  from '../mock/mock-hitboxes'
import { leetSequences } from '../mock/mock-seq'

// Loading model for testing
const leetPath = path.resolve(__dirname, '../mock/leet.mdl')
const leetBuffer: ArrayBuffer = fs.readFileSync(leetPath).buffer

const ratamahattaPath = path.resolve(__dirname, '../mock/ratamahatta.md2')
const ratamahattaBuffer: ArrayBuffer = fs.readFileSync(ratamahattaPath).buffer

const modelParser = createModelParser(leetBuffer)
const header = modelParser.parseHeader()

test('should detect wrong version of model', () => {
  const modelParser = createModelParser(ratamahattaBuffer)

  expect(() => {
    modelParser.parseModel()
  }).toThrowError('Unsupported version of the MDL file')
})

test('should parse header', () => {
  const modelParser = createModelParser(leetBuffer)
  const header = modelParser.parseHeader()
  expect(header).toEqual(leetHeader)
})

test('should parse bones', () => {
  const bones = modelParser.parseBones(header.boneindex, header.numbones)
  expect(bones).toEqual(leetBones)
})

test('should parse bone controllers', () => {
  const boneControllers = modelParser.parseBoneControllers(header.bonecontrollerindex, header.numbonecontrollers)
  expect(boneControllers).toEqual(leetBoneControllers)
})

test('should parse attachments', () => {
  const attachments = modelParser.parseAttachments(header.attachmentindex, header.numattachments)
  expect(attachments).toEqual(leetAttachments)
})

test('should parse hitboxes', () => {
  const hitBoxes = modelParser.parseHitboxes(header.hitboxindex, header.numhitboxes)
  expect(hitBoxes).toEqual(leetHitBoxes)
})

test('should parse sequences', () => {
  const sequences = modelParser.parseSequences(header.seqindex, header.numseq)
  expect(sequences).toEqual(leetSequences)
})

test('should parse sequence groups', () => {
  const sequenceGroups = modelParser.parseSequenceGroups(header.seqgroupindex, header.numseqgroups)
  expect(sequenceGroups).toEqual(leetSequenceGroups)
})

test('should parse textures', () => {
  const textures = modelParser.parseTextures(header.textureindex, header.numtextures)
  expect(textures).toEqual(leetTexturesInfo)
})

test('should parse skin references', () => {
  const skinRef = modelParser.parseSkinRef(header.skinindex, header.numskinref)
  expect(skinRef).toEqual(leetSkinRef)
})
