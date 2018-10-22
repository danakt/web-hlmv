import * as fs           from 'fs'
import * as path         from 'path'
import * as structs      from '../const/structs'
import * as FastDataView from 'fast-dataview'
import * as ModelParser  from '../lib/modelParser'

// Loading model for testing
const leetPath = path.resolve(__dirname, '../mdl/leet.mdl')
const leetBuffer: ArrayBuffer = fs.readFileSync(leetPath).buffer

const dataView = new FastDataView(leetBuffer)

let header: structs.Header
let sequences: structs.SequenceDesc[]
let animations: structs.Animation[][]
let bodyParts: structs.BodyPart[]
let subModels: structs.SubModel[][]
let meshes: structs.Mesh[][][]

describe('parsing model parts', () => {
  test('parse header', () => {
    header = ModelParser.parseHeader(dataView)
  })

  test('parse bones', () => {
    ModelParser.parseBones(dataView, header.boneindex, header.numbones)
  })

  test('should parse bone controllers', () => {
    ModelParser.parseBoneControllers(dataView, header.bonecontrollerindex, header.numbonecontrollers)
  })

  test('should parse attachments', () => {
    ModelParser.parseAttachments(dataView, header.attachmentindex, header.numattachments)
  })

  test('should parse hitboxes', () => {
    ModelParser.parseHitboxes(dataView, header.hitboxindex, header.numhitboxes)
  })

  test('should parse sequences', () => {
    sequences = ModelParser.parseSequences(dataView, header.seqindex, header.numseq)
  })

  test('should parse sequence groups', () => {
    ModelParser.parseSequenceGroups(dataView, header.seqgroupindex, header.numseqgroups)
  })

  test('should parse bodyparts', () => {
    bodyParts = ModelParser.parseBodyParts(dataView, header.bodypartindex, header.numbodyparts)
  })

  test('should parse textures', () => {
    ModelParser.parseTextures(dataView, header.textureindex, header.numtextures)
  })

  test('should parse skin references', () => {
    ModelParser.parseSkinRef(dataView.buffer, header.skinindex, header.numskinref)
  })

  test('should parse submodels', () => {
    subModels = ModelParser.parseSubModel(dataView, bodyParts)
  })

  test('should parse meshes', () => {
    meshes = ModelParser.parseMeshes(dataView, subModels)
  })

  test('should parse vertices', () => {
    ModelParser.parseVertices(dataView.buffer, subModels)
  })

  test('should parse bones vertices', () => {
    ModelParser.parseVertBoneBuffer(dataView.buffer, subModels)
  })

  test('should parse triangles', () => {
    ModelParser.parseTriangles(dataView.buffer, meshes, header.length)
  })

  test('should parse animations', () => {
    animations = ModelParser.parseAnimations(dataView, sequences, header.numbones)
  })

  test('should parse animation values', () => {
    ModelParser.parseAnimValues(dataView, sequences, animations, header.numbones)
  })
})
