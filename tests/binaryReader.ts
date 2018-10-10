import * as fs        from 'fs'
import * as path      from 'path'
import * as structs   from '../src/structs'
import { readStruct } from '../src/BinaryReader'

// Loading model for testing
const leetPath = path.resolve(__dirname, '../models/leet.mdl')
const leetBuffer: ArrayBuffer = fs.readFileSync(leetPath).buffer

test('parsing some data in binary file', () => {
  const dataView = new DataView(leetBuffer)
  const header = readStruct(dataView, structs.header)

  expect(header).toEqual({
    id:                  1414743113,
    version:             10,
    name:                'leet\\leet.mdl',
    length:              2401992,
    eyeposition:         [0, 0, 0],
    max:                 [0, 0, 0],
    min:                 [0, 0, 0],
    bbmin:               [0, 0, 0],
    bbmax:               [0, 0, 0],
    flags:               0,
    numbones:            55,
    boneindex:           244,
    numbonecontrollers:  1,
    bonecontrollerindex: 6404,
    numhitboxes:         21,
    hitboxindex:         6604,
    numseq:              111,
    seqindex:            2072508,
    numseqgroups:        1,
    seqgroupindex:       2094628,
    numtextures:         3,
    textureindex:        2116816,
    texturedataindex:    2117064,
    numskinref:          3,
    numskinfamilies:     1,
    skinindex:           2117056,
    numbodyparts:        2,
    bodypartindex:       2094732,
    numattachments:      2,
    attachmentindex:     6428,
    soundtable:          0,
    soundindex:          0,
    soundgroups:         0,
    soundgroupindex:     0,
    numtransitions:      0,
    transitionindex:     2094732
  })
})
