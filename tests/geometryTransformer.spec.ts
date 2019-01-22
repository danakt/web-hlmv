import * as path                                  from 'path'
import * as fs                                    from 'fs'
import { parseModel }                             from '../lib/modelDataParser'
import { getBoneQuaternions, calcBoneQuaternion } from '../lib/geometryTransformer'

const leetPath = path.resolve(__dirname, '../mdl/leet.mdl')
const leetBuffer: ArrayBuffer = fs.readFileSync(leetPath).buffer
const leetModelData = parseModel(leetBuffer)

describe('test geometry transform', () => {
  test('should calculate valid quaternion of bone #0 sequence #0 frame #0', () => {
    const boneIndex = 0
    const sequenceIndex = 0
    const frame = 0
    const bone = leetModelData.bones[boneIndex]
    const animOffset = leetModelData.animations[sequenceIndex][boneIndex].offset
    const animValues = leetModelData.animValues

    expect(calcBoneQuaternion(frame, bone, animOffset, animValues, boneIndex, sequenceIndex, 0)).toEqual(
      new Float32Array([-0.004799471702426672, 0.15218494832515717, 0.018867794424295425, 0.988160252571106])
    )
  })
  ;[[0, 0], [63, 0]].forEach(([sequenceIndex, frame]) => {
    test(`should generate valid quaternions of all bones of sequence #${sequenceIndex} frame #${frame}`, () => {
      const boneQuaternions = getBoneQuaternions(
        leetModelData.bones,
        leetModelData.animations[sequenceIndex],
        leetModelData.animValues,
        sequenceIndex,
        frame
      )

      expect(boneQuaternions).toMatchSnapshot()
    })
  })
})
