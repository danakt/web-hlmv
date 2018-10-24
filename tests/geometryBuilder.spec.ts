import * as path                        from 'path'
import * as fs                          from 'fs'
import { parseModel }                   from '../lib/modelParser'
import { readFacesData, countVertices } from '../lib/geometryBuilder'

const leetPath = path.resolve(__dirname, '../mdl/leet.mdl')
const leetBuffer: ArrayBuffer = fs.readFileSync(leetPath).buffer
const leetModelData = parseModel(leetBuffer)

const triangles = leetModelData.triangles[0][0][0]
const vertices = leetModelData.vertices[0][0]
const texture = leetModelData.textures[0]

describe('test geometry building', () => {
  test('speed of geometry building', () => {
    readFacesData(triangles, vertices, texture)
  })

  test('should build the proper number of vertices', () => {
    expect(countVertices(leetModelData.triangles[0][0][0])).toBe(2220)
    expect(countVertices(leetModelData.triangles[0][0][1])).toBe(36)
    expect(countVertices(leetModelData.triangles[1][1][0])).toBe(132)
  })

  test('should build geometry buffer', () => {
    const { geometry } = readFacesData(triangles, vertices, texture)
    expect(geometry).toMatchSnapshot('geometry buffer')
  })

  test('should building uv map', () => {
    const { uv } = readFacesData(triangles, vertices, texture)
    expect(uv).toMatchSnapshot('uv buffer')
  })
})
