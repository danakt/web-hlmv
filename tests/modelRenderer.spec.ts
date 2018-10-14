import * as fs                  from 'fs'
import * as path                from 'path'
import * as png                 from 'fast-png'
import { parseModel }           from '../lib/modelParser'
import { buildTexture }         from '../lib/modelRenderer'
import { MockImageData }        from './tools'
import { toMatchImageSnapshot } from 'jest-image-snapshot'

// Extending jest's expect
expect.extend({ toMatchImageSnapshot })

// Mock of ImageData
Object.defineProperty(global, 'ImageData', { value: MockImageData })

const leetPath = path.resolve(__dirname, '../models/leet.mdl')
const leetBuffer: ArrayBuffer = fs.readFileSync(leetPath).buffer
const modelData = parseModel(leetBuffer)

describe('test building functions', () => {
  describe('test textures building', () => {
    test('just building texture without errors', () => {
      const texture = modelData.textures[0]
      buildTexture(leetBuffer, texture)
    })

    test('should build valid skin texture', () => {
      const texture = modelData.textures[0]
      const buildedSkin: Uint8Array = png.encode(buildTexture(leetBuffer, texture))

      expect(Buffer.from(buildedSkin)).toMatchImageSnapshot()
    })

    test('should build valid backpack texture', () => {
      const texture = modelData.textures[2]
      const buildedSkin: Uint8Array = png.encode(buildTexture(leetBuffer, texture))

      expect(Buffer.from(buildedSkin)).toMatchImageSnapshot()
    })
  })
})
