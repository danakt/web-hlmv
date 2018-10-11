import * as fs               from 'fs'
import * as path             from 'path'
import { createModelParser } from '../src/modelParser'
import * as mock             from './mock'

// Loading model for testing
const leetPath = path.resolve(__dirname, '../models/leet.mdl')
const leetBuffer: ArrayBuffer = fs.readFileSync(leetPath).buffer
const modelParser = createModelParser(leetBuffer)
const header = modelParser.parseHeader()

test('parsing header', () => {
  const header = modelParser.parseHeader()
  expect(header).toEqual(mock.leetHeder)
})

test('parsing bones', () => {
  const bones = modelParser.parseBones(header.boneindex, header.numbones)
  expect(bones).toEqual(mock.leetBones)
})

test('parsing bone controllers', () => {
  const boneControllers = modelParser.parseBoneControllers(header.bonecontrollerindex, header.numbonecontrollers)
  expect(boneControllers).toEqual(mock.leetBoneControllers)
})

test('parsing attachments', () => {
  const attachments = modelParser.parseAttachments(header.attachmentindex, header.numattachments)
  expect(attachments).toEqual(mock.leetAttachments)
})

test('parsing hitboxes', () => {
  const hitBoxes = modelParser.parseHitboxes(header.hitboxindex, header.numhitboxes)
  expect(hitBoxes).toEqual(mock.leetHitBoxes)
})

test('parsing textures', () => {
  const textures = modelParser.parseTextures(header.textureindex, header.numtextures)
  expect(textures).toEqual(mock.leetTexturesInfo)
})

test('parsing skin references', () => {
  const skinRef = modelParser.parseSkinRef(header.skinindex, header.numskinref)
  expect(skinRef).toEqual(mock.leetSkinRef)
})
