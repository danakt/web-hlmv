import * as fs                  from 'fs'
import * as path                from 'path'
import * as png                 from 'fast-png'
import { parseModel }           from '../lib/modelParser'
import * as ModelRenderer       from '../lib/modelRenderer'
import { MockImageData }        from './tools'
import { toMatchImageSnapshot } from 'jest-image-snapshot'

// Extending jest's expect
expect.extend({ toMatchImageSnapshot })

// Mock of ImageData
Object.defineProperty(global, 'ImageData', { value: MockImageData })

const leetPath = path.resolve(__dirname, '../models/leet.mdl')
const leetBuffer: ArrayBuffer = fs.readFileSync(leetPath).buffer
const leetModelData = parseModel(leetBuffer)

describe('test building functions', () => {
  describe('test textures building', () => {
    test('just building texture without errors', () => {
      const texture = leetModelData.textures[0]
      ModelRenderer.buildTexture(leetBuffer, texture)
    })

    test('should build valid skin texture', () => {
      const texture = leetModelData.textures[0]
      const buildedSkin: Uint8Array = png.encode(ModelRenderer.buildTexture(leetBuffer, texture))

      expect(Buffer.from(buildedSkin)).toMatchImageSnapshot()
    })

    test('should build valid backpack texture', () => {
      const texture = leetModelData.textures[2]
      const buildedSkin: Uint8Array = png.encode(ModelRenderer.buildTexture(leetBuffer, texture))

      expect(Buffer.from(buildedSkin)).toMatchImageSnapshot()
    })
  })

  describe('test geometry building', () => {
    const triangles = leetModelData.triangles[0][0][0]
    const vertices = leetModelData.vertices[0][0]
    const textureImageData = ModelRenderer.buildTexture(leetBuffer, leetModelData.textures[0])

    test('speed of geometry building', () => {
      ModelRenderer.getFaceVertices(triangles, vertices, textureImageData)
    })

    test('should build the proper number of vertices', () => {
      expect(ModelRenderer.countVertices(leetModelData.triangles[0][0][0])).toBe(2220)
      expect(ModelRenderer.countVertices(leetModelData.triangles[0][0][1])).toBe(36)
      expect(ModelRenderer.countVertices(leetModelData.triangles[1][1][0])).toBe(132)
    })

    test('should build geometry buffer', () => {
      const { geometry } = ModelRenderer.getFaceVertices(triangles, vertices, textureImageData)
      expect(geometry).toMatchSnapshot('geometry buffer')
    })

    test('should building uv map', () => {
      const { uv } = ModelRenderer.getFaceVertices(triangles, vertices, textureImageData)
      expect(uv).toMatchSnapshot('uv buffer')
    })
  })
})
