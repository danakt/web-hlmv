import * as fs            from 'fs'
import * as path          from 'path'
import * as structs       from '../src/structs'
import { readStruct }     from '../src/BinaryReader'
import { getPerformance } from './tools'
import { leetHeder }      from './mock'

// Loading model for testing
const leetPath = path.resolve(__dirname, '../models/leet.mdl')
const leetBuffer: ArrayBuffer = fs.readFileSync(leetPath).buffer

test('parsing some data in binary file', () => {
  const dataView = new DataView(leetBuffer)
  const header = readStruct(dataView, structs.header)
  expect(header).toEqual(leetHeder)
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
