import * as fs                                                                            from 'fs'
import * as path                                                                          from 'path'
import { createModelParser }                                                              from '../src/modelParser'
import { leetHeder, leetBoneControllers, leetAttachments, leetTexturesInfo, leetSkinRef } from '../mock/mock'
import { leetBones }                                                                      from '../mock/mock-bones'
import { leetHitBoxes }                                                                   from '../mock/mock-hitboxes'
import { leetSequences }                                                                  from '../mock/mock-seq'

// Loading model for testing
const leetPath = path.resolve(__dirname, '../mock/leet.mdl')
const leetBuffer: ArrayBuffer = fs.readFileSync(leetPath).buffer
const modelParser = createModelParser(leetBuffer)
const header = modelParser.parseHeader()

test('parsing header', () => {
  const header = modelParser.parseHeader()
  expect(header).toEqual(leetHeder)
})

test('parsing bones', () => {
  const bones = modelParser.parseBones(header.boneindex, header.numbones)
  expect(bones).toEqual(leetBones)
})

test('parsing bone controllers', () => {
  const boneControllers = modelParser.parseBoneControllers(header.bonecontrollerindex, header.numbonecontrollers)
  expect(boneControllers).toEqual(leetBoneControllers)
})

test('parsing attachments', () => {
  const attachments = modelParser.parseAttachments(header.attachmentindex, header.numattachments)
  expect(attachments).toEqual(leetAttachments)
})

test('parsing hitboxes', () => {
  const hitBoxes = modelParser.parseHitboxes(header.hitboxindex, header.numhitboxes)
  expect(hitBoxes).toEqual(leetHitBoxes)
})

test('parsing sequences', () => {
  const sequences = modelParser.parseSequences(header.seqindex, header.numseq)
  expect(sequences).toEqual(leetSequences)
})

test('parsing textures', () => {
  const textures = modelParser.parseTextures(header.textureindex, header.numtextures)
  expect(textures).toEqual(leetTexturesInfo)
})

test('parsing skin references', () => {
  const skinRef = modelParser.parseSkinRef(header.skinindex, header.numskinref)
  expect(skinRef).toEqual(leetSkinRef)
})
