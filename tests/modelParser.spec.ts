import * as fs                            from 'fs'
import * as path                          from 'path'
import { createModelParser, parseHeader } from '../src/modelParser'
import { leetHeder }                      from './mock'

// Loading model for testing
const leetPath = path.resolve(__dirname, '../models/leet.mdl')
const leetBuffer: ArrayBuffer = fs.readFileSync(leetPath).buffer
const dataView = new DataView(leetBuffer)
const modelParser = createModelParser(leetBuffer)

test('parsing header', () => {
  const header = parseHeader(dataView)
  expect(header).toEqual(leetHeder)
})
