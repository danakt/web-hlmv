import * as fs           from 'fs'
import * as path         from 'path'
import * as png          from 'fast-png'
import { parseModel }    from '../lib/modelParser'
import { buildTexture }  from '../lib/modelRenderer'
import { MockImageData } from './tools'

// Mock of ImageData
Object.defineProperty(global, 'ImageData', { value: MockImageData })

const leetPath = path.resolve(__dirname, '../models/leet.mdl')
const leetBuffer: ArrayBuffer = fs.readFileSync(leetPath).buffer
const modelData = parseModel(leetBuffer)

describe('test building functions', () => {
  test('just building texture without errors', () => {
    const texture = modelData.textures[0]
    buildTexture(leetBuffer, texture)
  })

  test('building valid texture', () => {
    const texture = modelData.textures[0]
    const buildedSkin = png.encode(buildTexture(leetBuffer, texture))
    const leetSkin = fs.readFileSync('./mock/skin.png')

    expect(buildedSkin).toEqual(Uint8Array.from(leetSkin))
  })
})
