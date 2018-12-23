import { vec3, quat, mat4 } from 'gl-matrix'
import * as structs         from '../const/structs'
import * as MultiArrayView  from 'multi-array-view'
import { ANIM_VALUE }       from '../const/constants'

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
 * Calculates bone angle
 */
const calcBoneAngles = (
  frame: number,
  bone: structs.Bone,
  animOffset: Uint8Array,
  animValues: MultiArrayView<number>,
  boneIndex: number
): [vec3, vec3] => {
  let angle1 = vec3.create()
  let angle2 = vec3.create()

  for (let axis = 0; axis < 3; axis++) {
    if (animOffset[axis + 3] === 0) {
      // Default angles
      const angle = bone.value[axis + 3]

      angle1[axis] = angle
      angle2[axis] = angle
    } else {
      // Animation
      let i = 0
      let f = frame

      while (animValues.get(boneIndex, axis, i, ANIM_VALUE.TOTAL) <= f) {
        f -= animValues.get(boneIndex, axis, i, ANIM_VALUE.TOTAL)
        i += animValues.get(boneIndex, axis, i, ANIM_VALUE.TOTAL) + 1
      }

      // Bah, missing blend!
      if (animValues.get(boneIndex, axis, i, ANIM_VALUE.VALID) > f) {
        angle1[axis] = animValues.get(boneIndex, axis, f + 1, ANIM_VALUE.VALUE)

        if (animValues.get(boneIndex, axis, i, ANIM_VALUE.VALID) > f + 1) {
          angle2[axis] = animValues.get(boneIndex, axis, f + 2, ANIM_VALUE.VALUE)
        } else {
          if (animValues.get(boneIndex, axis, i, ANIM_VALUE.TOTAL) > f + 1) {
            angle2[axis] = angle1[axis]
          } else {
            angle2[axis] = animValues.get(boneIndex, axis, animValues.get(boneIndex, axis, i, ANIM_VALUE.VALID) + 2, 0)
          }
        }
      } else {
        angle1[axis] = animValues.get(
          boneIndex,
          axis,
          animValues.get(boneIndex, axis, i, ANIM_VALUE.VALID),
          ANIM_VALUE.VALUE
        )

        if (animValues.get(boneIndex, axis, i, ANIM_VALUE.TOTAL) > f + 1) {
          angle2[axis] = angle1[axis]
        } else {
          angle2[axis] = animValues.get(
            boneIndex,
            axis,
            animValues.get(boneIndex, axis, i, ANIM_VALUE.VALID) + 2,
            ANIM_VALUE.VALUE
          )
        }
      }

      angle1[axis] = bone.value[axis + 3] + angle1[axis] * bone.scale[axis + 3]
      angle2[axis] = bone.value[axis + 3] + angle2[axis] * bone.scale[axis + 3]
    }
  }

  return [angle1, angle2]
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
  frame: number,
  s: number
): quat[] => {
  // List of bone quaternions
  const quaternions = []

  for (let i = 0; i < bones.length; i++) {
    let angle2: vec3
    let angle1: vec3
    ;[angle1, angle2] = calcBoneAngles(frame, bones[i], animations[i].offset, animationValues, i)

    if (!vec3.equals(angle1, angle2)) {
      const q1 = anglesToQuaternion(angle1)
      const q2 = anglesToQuaternion(angle2)

      quaternions.push(quat.slerp(quat.create(), q1, q2, s))
    } else {
      quaternions.push(anglesToQuaternion(angle1))
    }
  }

  return quaternions
}

/**
 * Returns bone positions
 */
export const getBonePositions = (bones: structs.Bone[]): vec3[] => {
  // List of bone positions
  const positions: vec3[] = bones.map(bone => vec3.fromValues(bone.value[0], bone.value[1], bone.value[2]))

  // for (const axis of [MOTION_X, MOTION_Y, MOTION_Z]) {
  //   if (sequence.motiontype & axis) {
  //     positions[sequence.motionbone][1] = 0
  //   }
  // }

  return positions
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
