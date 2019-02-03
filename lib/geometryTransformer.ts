import { vec3, quat, mat4 }               from 'gl-matrix'
import * as MultiArrayView                from 'multi-array-view'
import * as structs                       from '../const/structs'
import { ANIM_VALUE, MOTION_X, MOTION_Z } from '../const/constants'
import { ModelData }                      from './modelDataParser'

/**
 * Converts Euler angles into a quaternion
 */
export function anglesToQuaternion(angles: vec3): quat {
  const pitch = angles[0]
  const roll = angles[1]
  const yaw = angles[2]

  // FIXME: rescale the inputs to 1/2 angle
  const cy = Math.cos(yaw * 0.5)
  const sy = Math.sin(yaw * 0.5)
  const cp = Math.cos(roll * 0.5)
  const sp = Math.sin(roll * 0.5)
  const cr = Math.cos(pitch * 0.5)
  const sr = Math.sin(pitch * 0.5)

  return quat.fromValues(
    sr * cp * cy - cr * sp * sy, // X
    cr * sp * cy + sr * cp * sy, // Y
    cr * cp * sy - sr * sp * cy, // Z
    cr * cp * cy + sr * sp * sy // W
  )
}

/**
 * Returns bone quaternions
 * @param sequence
 * @param frame Frame
 * @param s Interpolation amount
 * @param bones Bones list
 */
export const getBoneQuaternions = (
  bones: structs.Bone[],
  animations: structs.Animation[],
  animationValues: MultiArrayView<number>,
  sequenceIndex: number,
  frame: number,
  s: number = 0
): quat[] => {
  const quaternions: quat[] = []

  for (let boneIndex = 0; boneIndex < bones.length; boneIndex++) {
    quaternions.push(
      calcBoneQuaternion(
        frame,
        bones[boneIndex],
        animations[boneIndex].offset,
        animationValues,
        boneIndex,
        sequenceIndex,
        s
      )
    )
  }

  return quaternions
}

/**
 * Calculates bone angle
 */
export const calcBoneQuaternion = (
  frame: number,
  bone: structs.Bone,
  animOffset: Uint16Array,
  animValues: MultiArrayView<number>,
  // TODO: Swap boneIndex and sequenceIndex
  boneIndex: number,
  sequenceIndex: number,
  s: number
): quat => {
  let angle1: vec3 = vec3.create()
  let angle2: vec3 = vec3.create()

  for (let axis = 0; axis < 3; axis++) {
    const getTotal = (index: number) => animValues.get(sequenceIndex, boneIndex, axis, index, ANIM_VALUE.TOTAL)
    const getValue = (index: number) => animValues.get(sequenceIndex, boneIndex, axis, index, ANIM_VALUE.VALUE)
    const getValid = (index: number) => animValues.get(sequenceIndex, boneIndex, axis, index, ANIM_VALUE.VALID)

    if (animOffset[axis + 3] === 0) {
      angle2[axis] = angle1[axis] = bone.value[axis + 3] // default;
    } else {
      // Animation
      let i = 0
      let k = frame

      // let loopBreaker = 1e6
      // while (getTotal(i) <= k) {
      //   k -= getTotal(i)
      //   i += getValid(i) + 1

      //   if (loopBreaker-- <= 0) {
      //     throw new Error(`Infinity loop. Bone index: ${boneIndex}`)
      //   }
      // }

      // Bah, missing blend!
      if (getValid(i) > k) {
        angle1[axis] = getValue(k + 1)

        // if (getValid(i) > k + 1) {
        //   angle2[axis] = getValue(k + 2)
        // } else {
        //   if (getTotal(i) > k + 1) {
        //     angle2[axis] = angle1[axis]
        //   } else {
        //     angle2[axis] = getValue(getValid(i) + 2)
        //   }
        // }
      } else {
        angle1[axis] = getValue(getValid(i))

        // if (getTotal(i) > k + 1) {
        //   angle2[axis] = angle1[axis]
        // } else {
        //   angle2[axis] = getValue(getValid(i) + 2)
        // }
      }

      angle1[axis] = bone.value[axis + 3] + angle1[axis] * bone.scale[axis + 3]
      angle2[axis] = bone.value[axis + 3] + angle2[axis] * bone.scale[axis + 3]
    }
  }

  if (vec3.equals(angle1, angle2)) {
    return anglesToQuaternion(angle1)
  }

  const q1 = anglesToQuaternion(angle1)
  const q2 = anglesToQuaternion(angle2)

  return quat.slerp(quat.create(), q1, q2, s)
}

/**
 * Returns bone positions
 */
export const getBonePositions = (
  bone: structs.Bone,
  boneIndex: number,
  animOffset: Uint16Array,
  animValues: MultiArrayView<number>,
  sequenceIndex: number,
  frame: number,
  s = 0 // TODO: Do something about it
): vec3 => {
  // List of bone positions
  const position: vec3 = vec3.fromValues(bone.value[0], bone.value[1], bone.value[2])

  for (let axis = 0; axis < 3; ++axis) {
    const getTotal = (index: number) => animValues.get(sequenceIndex, boneIndex, axis, index, ANIM_VALUE.TOTAL)
    const getValue = (index: number) => animValues.get(sequenceIndex, boneIndex, axis, index, ANIM_VALUE.VALUE)
    const getValid = (index: number) => animValues.get(sequenceIndex, boneIndex, axis, index, ANIM_VALUE.VALID)

    position[axis] = bone.value[axis] // default;

    if (animOffset[axis] != 0) {
      let i = 0
      let k = frame

      // find span of values that includes the frame we want
      let loopBreaker = 1e6
      while (getTotal(i) <= k) {
        k -= getTotal(i)
        i += getValid(i) + 1

        if (loopBreaker-- <= 0) {
          throw new Error(`Infinity loop. Bone index: ${boneIndex}`)
        }
      }

      // if we're inside the span
      if (getValid(i) > k) {
        // and there's more data in the span
        // if (getValid(i) > k + 1) {
        //   position[axis] += getValue(k + 1) * bone.scale[axis]
        // } else {
        //   position[axis] += getValue(k + 1) * bone.scale[axis]
        // }
      } else {
        // 			// are we at the end of the repeating values section and there's another section with data?
        // if (getTotal(i) <= k + 1) {
        //   position[axis] += (getValue(getValid(i)) * (1.0 - s) + s * getValue(getValid(i) + 2)) * bone.scale[axis]
        // } else {
        //   position[axis] += getValue(getValid(i)) * bone.scale[axis]
        // }
      }
    }
    // 	if (bone.bonecontroller[j] != -1)
    // 	{
    // 		positions[j] += BoneAdj[bone.bonecontroller[j]];
    // 	}
  }

  return position
}

/**
 * Calculates bone transforms
 */
export const calcBoneTransforms = (quaternions: quat[], positions: vec3[], bones: structs.Bone[]): mat4[] => {
  const boneTransforms: mat4[] = []

  for (let i = 0; i < bones.length; i++) {
    const boneMatrix = mat4.fromQuat(mat4.create(), quaternions[i])

    for (let j = 0; j < 3; j++) {
      // 4 — vector size, 3 + j — index in quat
      boneMatrix[4 * 3 + j] = positions[i][j]
    }

    if (bones[i].parent === -1) {
      // Root bone
      boneTransforms.push(boneMatrix)
    } else {
      boneTransforms.push(mat4.multiply(mat4.create(), boneTransforms[bones[i].parent], boneMatrix))
    }
  }

  return boneTransforms
}

export const calcRotations = (
  modelData: ModelData,
  sequenceIndex: number,
  frame: number,
  s = 0 // TODO: Do something about it
): mat4[] => {
  const boneQuaternions: quat[] = modelData.bones.map((_, boneIndex) =>
    calcBoneQuaternion(
      frame,
      modelData.bones[boneIndex],
      modelData.animations[sequenceIndex][boneIndex].offset,
      modelData.animValues,
      boneIndex,
      sequenceIndex,
      s
    )
  )

  const bonesPositions: vec3[] = modelData.bones.map(
    (bone, boneIndex): vec3 =>
      getBonePositions(
        bone,
        boneIndex,
        modelData.animations[sequenceIndex][boneIndex].offset,
        modelData.animValues,
        sequenceIndex,
        frame,
        s
      )
  )

  for (const axis of [MOTION_X, MOTION_X, MOTION_Z]) {
    if (modelData.sequences[sequenceIndex].motiontype & axis) {
      bonesPositions[modelData.sequences[sequenceIndex].motionbone][1] = 0
    }
  }

  return calcBoneTransforms(boneQuaternions, bonesPositions, modelData.bones)
}
