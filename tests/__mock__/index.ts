import { ModelData }     from '../../lib/modelParser'
import { leetBones }     from './bones'
import { leetHitBoxes }  from './hitboxes'
import { leetSequences } from './seq'
import { subModels }     from './subModels'

/**
 * This file contains mock data of "leet.mdl"
 */
export const leetData: Partial<ModelData> = {
  header: {
    id:                  1414743113,
    version:             10,
    name:                'leet\\leet.mdl',
    length:              2401992,
    eyeposition:         new Float32Array([0, 0, 0]),
    max:                 new Float32Array([0, 0, 0]),
    min:                 new Float32Array([0, 0, 0]),
    bbmin:               new Float32Array([0, 0, 0]),
    bbmax:               new Float32Array([0, 0, 0]),
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
  },
  bones:           leetBones,
  boneControllers: [
    {
      bone:  8,
      end:   30,
      index: 4,
      rest:  0,
      start: 0,
      type:  32
    }
  ],
  attachments: [
    {
      name:    '',
      type:    0,
      bone:    27,
      org:     new Float32Array([10.854999542236328, -0.41671499609947205, 1.8706799745559692]),
      vectors: [new Float32Array([0, 0, 0]), new Float32Array([0, 0, 0]), new Float32Array([0, 0, 0])]
    },
    {
      name:    '',
      type:    0,
      bone:    12,
      org:     new Float32Array([10.854999542236328, -0.41671499609947205, 1.8706799745559692]),
      vectors: [new Float32Array([0, 0, 0]), new Float32Array([0, 0, 0]), new Float32Array([0, 0, 0])]
    }
  ],
  hitBoxes:       leetHitBoxes,
  sequences:      leetSequences,
  sequenceGroups: [
    {
      label:   'default',
      name:    '',
      unused1: 0,
      unused2: 0
    }
  ],
  bodyParts: [
    { name: 'studio', nummodels: 1, base: 1, modelindex: 2094884 },
    { name: 'backpack', nummodels: 2, base: 1, modelindex: 2094996 }
  ],
  textures: [
    {
      flags:  0,
      height: 512,
      index:  2117064,
      name:   'Arab_dmbase1.bmp',
      width:  512
    },
    {
      flags:  3,
      height: 64,
      index:  2379976,
      name:   'Chrome3.bmp',
      width:  64
    },
    {
      flags:  0,
      height: 128,
      index:  2384840,
      name:   'Backpack1.BMP',
      width:  128
    }
  ],
  skinRef: new Int16Array([0, 1, 2]),
  subModels
}
