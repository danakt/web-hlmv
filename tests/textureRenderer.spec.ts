import * as fs                  from 'fs'
import * as path                from 'path'
import * as png                 from 'fast-png'
import { parseModel }           from '../lib/modelDataParser'
import { toMatchImageSnapshot } from 'jest-image-snapshot'
import { buildTexture }         from '../lib/textureBuilder'

// Extending jest's expect
expect.extend({ toMatchImageSnapshot })

// Mock of ImageData
Object.defineProperty(global, 'ImageData', {
  value: class MockImageData {
    constructor(public data: Uint8ClampedArray, public width: number, public height: number) {}
  }
})

const leetPath = path.resolve(__dirname, '../mdl/leet.mdl')
const leetBuffer: ArrayBuffer = fs.readFileSync(leetPath).buffer
const leetModelData = parseModel(leetBuffer)

describe('test textures building', () => {
  test('just building texture without errors', () => {
    const texture = leetModelData.textures[0]
    buildTexture(leetBuffer, texture)
  })

  test('should build valid skin texture', () => {
    const texture = leetModelData.textures[0]
    const buildedSkin: Uint8Array = png.encode({
      width:  texture.width,
      height: texture.height,
      data:   buildTexture(leetBuffer, texture)
    })

    expect(Buffer.from(buildedSkin)).toMatchImageSnapshot()
  })

  test('should build valid backpack texture', () => {
    const texture = leetModelData.textures[2]
    const buildedSkin: Uint8Array = png.encode({
      width:  texture.width,
      height: texture.height,
      data:   buildTexture(leetBuffer, texture)
    })

    expect(Buffer.from(buildedSkin)).toMatchImageSnapshot()
  })
})
