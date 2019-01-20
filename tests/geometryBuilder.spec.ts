import * as path                                               from 'path'
import * as fs                                                 from 'fs'
import { parseModel }                                          from '../lib/modelDataParser'
import { readFacesData, countVertices, getTriangleSeriesType } from '../lib/geometryBuilder'
import { TRIANGLE_FAN, TRIANGLE_STRIP }                        from '../const/constants'

const leetPath = path.resolve(__dirname, '../mdl/leet.mdl')
const leetBuffer: ArrayBuffer = fs.readFileSync(leetPath).buffer
const leetModelData = parseModel(leetBuffer)

const meshDataPath = [[0, 0, 0], [0, 0, 1], [1, 1, 0]]

describe('test geometry building', () => {
  test('detect triangles series type', () => {
    expect(getTriangleSeriesType(-1)).toBe(TRIANGLE_FAN)
    expect(getTriangleSeriesType(1)).toBe(TRIANGLE_STRIP)
  })

  test('speed of geometry building', () => {
    for (const [a, b, c] of meshDataPath) {
      readFacesData(leetModelData.triangles[a][b][c], leetModelData.vertices[a][b], leetModelData.textures[a])
    }
  })

  test('should build the proper number of vertices', () => {
    expect(countVertices(leetModelData.triangles[0][0][0])).toBe(2220)
    expect(countVertices(leetModelData.triangles[0][0][1])).toBe(36)
    expect(countVertices(leetModelData.triangles[1][1][0])).toBe(132)
  })

  test('should build geometry buffer', () => {
    for (const [a, b, c] of meshDataPath) {
      expect(
        readFacesData(leetModelData.triangles[a][b][c], leetModelData.vertices[a][b], leetModelData.textures[a])
          .vertices
      ).toMatchSnapshot(`geometry buffer`)
    }
  })

  test('should building uv map', () => {
    for (const [a, b, c] of meshDataPath) {
      expect(
        readFacesData(leetModelData.triangles[a][b][c], leetModelData.vertices[a][b], leetModelData.textures[a]).uv
      ).toMatchSnapshot('uv buffer')
    }
  })
})
