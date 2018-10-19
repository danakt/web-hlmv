import * as fs           from 'fs'
import * as path         from 'path'
import * as FastDataView from 'fast-dataview'
import * as structs      from '../const/structs'
import * as ModelParser  from '../lib/modelParser'

// Loading model for testing
const leetPath = path.resolve(__dirname, '../models/leet.mdl')
const leetBuffer: ArrayBuffer = fs.readFileSync(leetPath).buffer

const dataView = new FastDataView(leetBuffer)

let header: structs.Header
let sequences: structs.SequenceDesc[]
let animations: structs.Animation[][]

describe('benchmarks', () => {
  test('should parse header', () => {
    header = ModelParser.parseHeader(dataView)
  })

  test('parsing bones', () => {
    ModelParser.parseBones(dataView, header.boneindex, header.numbones)
  })

  test('parsing bone controllers', () => {
    ModelParser.parseBoneControllers(dataView, header.bonecontrollerindex, header.numbonecontrollers)
  })

  test('parsing attachments', () => {
    ModelParser.parseAttachments(dataView, header.attachmentindex, header.numattachments)
  })

  test('parsing hitboxes', () => {
    ModelParser.parseHitboxes(dataView, header.hitboxindex, header.numhitboxes)
  })

  test('parsing sequences', () => {
    sequences = ModelParser.parseSequences(dataView, header.seqindex, header.numseq)
  })

  test('parsing sequence groups', () => {
    ModelParser.parseSequenceGroups(dataView, header.seqgroupindex, header.numseqgroups)
  })

  test('parsing bodyparts', () => {
    ModelParser.parseBodyParts(dataView, header.bodypartindex, header.numbodyparts)
  })

  test('parsing textures', () => {
    ModelParser.parseTextures(dataView, header.textureindex, header.numtextures)
  })

  test('parsing skin references', () => {
    ModelParser.parseSkinRef(dataView, header.skinindex, header.numskinref)
  })

  test('parsing animations', () => {
    animations = ModelParser.parseAnimations(dataView, sequences, header.numbones)
  })

  test('parsing animation values', () => {
    ModelParser.parseAnimValues(dataView, sequences, animations, header.numbones)
  })
})
