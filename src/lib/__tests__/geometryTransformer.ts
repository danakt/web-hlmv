import * as path from 'path';
import * as fs from 'fs';
import { parseModel } from '../modelDataParser';
import { calcBoneQuaternion, calcRotations } from '../geometryTransformer';

const leetPath = path.resolve(__dirname, '../../__mock__/leet.mdl');
const leetBuffer: ArrayBuffer = fs.readFileSync(leetPath).buffer;
const leetModelData = parseModel(leetBuffer);

[
  [0, 0, 0],
  [15, 2, 23],
  [6, 55, 10]
].forEach(([boneIndex, sequenceIndex, frame]) => {
  test(`should calculate valid quaternion of bone #${boneIndex} sequence #${sequenceIndex} frame #${frame}`, () => {
    const bone = leetModelData.bones[boneIndex];
    const animOffset = leetModelData.animations[sequenceIndex][boneIndex].offset;
    const animValues = leetModelData.animValues;

    expect(calcBoneQuaternion(frame, bone, animOffset, animValues, boneIndex, sequenceIndex, 0)).toMatchSnapshot();
  });
});

[
  [0, 0],
  [2, 23],
  [55, 10]
].forEach(([sequenceIndex, frame]) => {
  test(`should calculate rotations of a #${sequenceIndex} sequence of #${frame} frame`, () => {
    expect(calcRotations(leetModelData, sequenceIndex, frame)).toMatchSnapshot();
  });
});
