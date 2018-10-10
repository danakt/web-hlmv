import * as fs               from 'fs'
import * as path             from 'path'
import * as structs          from '../src/structs'
import { createModelParser } from '../src/modelParser'

// Loading model for testing
const leetPath = path.resolve(__dirname, '../models/leet.mdl')
const leetBuffer: ArrayBuffer = fs.readFileSync(leetPath).buffer
const modelParser = createModelParser(leetBuffer)

test('parsing model', () => {
  // TODO
})
