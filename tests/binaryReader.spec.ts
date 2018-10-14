import * as fs                            from 'fs'
import * as path                          from 'path'
import * as structs                       from '../const/structs'
import { readStruct, readStructMultiple } from '../lib/BinaryReader'
import { getPerformance }                 from './tools'
import { leetData }                       from '../mock'

// Loading model for testing
const leetPath = path.resolve(__dirname, '../models/leet.mdl')
const leetBuffer: ArrayBuffer = fs.readFileSync(leetPath).buffer

test('parsing some struct in binary file', () => {
  const dataView = new DataView(leetBuffer)
  const header = readStruct(dataView, structs.header)
  expect(header).toEqual(leetData.header)
})

test('parsing multiple structs in binary file', () => {
  const dataView = new DataView(leetBuffer)
  const header = readStruct(dataView, structs.header)
  const texturesInfo = readStructMultiple(dataView, structs.texture, header.textureindex, header.numtextures)

  expect(texturesInfo).toEqual(leetData.textures)
})

test('speed test', () => {
  const dataView = new DataView(leetBuffer)

  const perf = getPerformance(() => {
    for (let i = 0; i < 1e4; i++) {
      readStruct(dataView, structs.header)
    }
  })

  expect(perf).toBeLessThan(200)
})
