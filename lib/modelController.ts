import * as THREE         from 'three'
import { ModelData }      from './modelDataParser'
import { MeshRenderData } from './modelRenderer'

/**
 * Returns the model's animation clips
 * Path to a animation clips [bodyPartIndex][subModelIndex][meshIndex][sequenceIndex]
 */
export const prepareAnimationClips = (
  meshDataList: MeshRenderData[][][],
  modelData: ModelData
): THREE.AnimationClip[][][][] =>
  meshDataList.map(bodyPart =>
    // Body part level
    bodyPart.map(subModel =>
      // Sub model level
      subModel.map(meshData =>
        // Mesh data level
        meshData.geometryBuffers.map((sequenceBuffers, i) => {
          // Sequence level
          const sequence = modelData.sequences[i]
          const isNoLoop = false
          const frameBuffers = sequenceBuffers.map((bufferAttribute, i) => ({
            name:     i.toString(),
            vertices: bufferAttribute.array
          }))

          return THREE.AnimationClip.CreateFromMorphTargetSequence(
            sequence.label,
            frameBuffers as any, // FIXME
            sequence.fps,
            isNoLoop
          )
        })
      )
    )
  )

/**
 * Creates model controller
 */
export const createModelController = (
  meshes: THREE.Mesh[][][],
  meshesRenderData: MeshRenderData[][][],
  modelData: ModelData
) => {
  let activeSequenceIndex = 0
  let isPaused = false

  const activeActions: (THREE.AnimationAction | null)[][][] = meshes.map(bodyPart =>
    bodyPart.map(subModel => subModel.map(() => null))
  )

  // Path: [bodyPartIndex][subModelIndex][meshIndex][sequenceIndex]
  const animationClips: THREE.AnimationClip[][][][] = prepareAnimationClips(meshesRenderData, modelData)

  const animationMixers: THREE.AnimationMixer[][][] = meshes.map(bodyPart =>
    // Body part level
    bodyPart.map(subModel =>
      // Sub model level
      subModel.map(
        mesh =>
          // Mesh level
          new THREE.AnimationMixer(mesh)
      )
    )
  )

  return {
    get isPaused() {
      return isPaused
    },

    /** Returns active sequence index */
    get activeSequenceIndex() {
      return activeSequenceIndex
    },

    /**
     * Sets playback rate (animation speed)
     * @param rate
     */
    setPlaybackRate: (rate: number) => {
      animationMixers.forEach(bodyPart =>
        // Body part level
        bodyPart.forEach(subModel =>
          // Sub model level
          subModel.forEach(mixer => {
            if (rate !== 0) {
              mixer.timeScale = 1 / rate
            } else {
              mixer.timeScale = 0
            }
          })
        )
      )
    },

    /**
     * Updates delta tile
     */
    update: (deltaTime: number) => {
      animationMixers.forEach(bodyPart =>
        // Body part level
        bodyPart.forEach(subModel =>
          // Sub model level
          subModel.forEach(mixer => {
            if (mixer) {
              mixer.update(deltaTime)
            }
          })
        )
      )
    },

    /**
     * Sets animation to play
     */
    playAnimation: (sequenceIndex: number) => {
      if (isPaused && activeSequenceIndex === sequenceIndex) {
        return animationClips.forEach((bodyPart, bodyPartIndex) =>
          bodyPart.slice(0, 1).forEach((subModel, subModelIndex) =>
            subModel.forEach((_, meshIndex) => {
              const activeAction = activeActions[bodyPartIndex][subModelIndex][meshIndex]

              if (activeAction) {
                isPaused = false
                activeAction.paused = false
              }
            })
          )
        )
      }

      activeSequenceIndex = sequenceIndex
      isPaused = false

      animationClips.forEach((bodyPart, bodyPartIndex) =>
        // Body part level
        bodyPart.slice(0, 1).forEach((subModel, subModelIndex) =>
          // Sub model level
          subModel.forEach((_, meshIndex) => {
            // Mesh level
            const animationClip: THREE.AnimationClip | null
              = animationClips[bodyPartIndex][subModelIndex][meshIndex][sequenceIndex]

            // TODO: Error message
            if (animationClip == null) {
              return
            }

            // Active action
            const activeAction = activeActions[bodyPartIndex][subModelIndex][meshIndex]
            const setActiveAction = (action: THREE.AnimationAction | null) =>
              (activeActions[bodyPartIndex][subModelIndex][meshIndex] = action)

            // Animation mixer
            const mixer: THREE.AnimationMixer = animationMixers[bodyPartIndex][subModelIndex][meshIndex]
            // Current mesh
            const mesh: THREE.Mesh = meshes[bodyPartIndex][subModelIndex][meshIndex]

            // Mesh geometry
            const geometry = mesh.geometry as THREE.BufferGeometry
            // Mesh render data
            const meshRenderData: MeshRenderData = meshesRenderData[bodyPartIndex][subModelIndex][meshIndex]

            // Update mesh morph targets
            geometry.morphAttributes.position = meshRenderData.geometryBuffers[sequenceIndex]
            mesh.updateMorphTargets()

            if (activeAction) {
              activeAction.stop()
              setActiveAction(null)
            }

            const action: THREE.AnimationAction = mixer.clipAction(animationClip, mesh)

            if (action) {
              action.play()

              setActiveAction(action)
            }
          })
        )
      )
    },

    /** Sets pause to animation */
    pauseAnimation() {
      animationClips.forEach((bodyPart, bodyPartIndex) =>
        bodyPart.slice(0, 1).forEach((subModel, subModelIndex) =>
          subModel.forEach((_, meshIndex) => {
            const activeAction = activeActions[bodyPartIndex][subModelIndex][meshIndex]

            if (activeAction) {
              isPaused = true
              activeAction.paused = true
            }
          })
        )
      )
    }
  }
}

export type ModelController = ReturnType<typeof createModelController>
