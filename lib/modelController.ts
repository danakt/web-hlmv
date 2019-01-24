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
  let activeAction: THREE.AnimationAction | null = null

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
      animationClips.forEach((bodyPart, bodyPartIndex) =>
        // Body part level
        bodyPart.forEach((subModel, subModelIndex) =>
          // Sub model level
          subModel.forEach((mesh, meshIndex) =>
            // Mesh level
            mesh.forEach((animationClip, sequenceIndex) => {
              // Animation clip level

              // TODO: Error message
              if (animationClip == null) {
                return
              }

              // Update geometry
              const geometry = meshes[bodyPartIndex][subModelIndex][meshIndex].geometry as THREE.BufferGeometry
              geometry.morphAttributes.position
                = meshesRenderData[bodyPartIndex][subModelIndex][meshIndex].geometryBuffers

              // Update mesh morph targets
              meshes[bodyPartIndex][subModelIndex][meshIndex].updateMorphTargets()

              if (activeAction) {
                activeAction.stop()
                activeAction = null
              }

              const action: THREE.AnimationAction = animationMixers[bodyPartIndex][subModelIndex][meshIndex].clipAction(
                animationClips[bodyPartIndex][subModelIndex][meshIndex][sequenceIndex],
                meshes[bodyPartIndex][subModelIndex][meshIndex]
              )

              // if (action) {
              activeAction = action.play()
              // }

              activeSequenceIndex = sequenceIndex
            })
          )
        )
      )
    }
  }
}

export type ModelController = ReturnType<typeof createModelController>
