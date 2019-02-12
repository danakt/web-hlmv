import * as THREE         from 'three'
import { ModelData }      from './modelDataParser'
import { MeshRenderData } from './modelRenderer'

/**
 * Returns the mesh's animation clips
 */
export const prepareAnimationClips = (meshData: MeshRenderData, modelData: ModelData): THREE.AnimationClip[] =>
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

/**
 * Creates mesh controller
 */
export const createMeshController = (
  mesh: THREE.Mesh,
  meshRenderData: MeshRenderData,
  modelData: ModelData,
  isDefaultVisible: boolean = false
) => {
  // Set default visibility of the mesh
  mesh.visible = isDefaultVisible

  let activeAction: THREE.AnimationAction | undefined
  let previousAction: THREE.AnimationAction | undefined

  const framesSum = modelData.sequences.reduce((acc, item) => acc + item.numFrames, 0)
  mesh.morphTargetInfluences = Array(framesSum).fill(0)

  const animationClips: THREE.AnimationClip[] = prepareAnimationClips(meshRenderData, modelData)
  const mixer = new THREE.AnimationMixer(mesh)
  const actions = animationClips.map(actionClip => mixer.clipAction(actionClip, mesh))

  const meshModelController = {
    /**
     * Sets playback rate (animation speed)
     * @param rate
     */
    setPlaybackRate: (rate: number) => {
      mixer.timeScale = rate !== 0 ? 1 / rate : 0
    },

    /**
     * Sets visibility of the mesh
     */
    setVisibility: (isVisible: boolean) => {
      mesh.visible = isVisible
    },

    /**
     * Updates delta tile
     */
    update: (deltaTime: number) => mixer.update(deltaTime),

    /**
     * Sets animation to play
     */
    setAnimation: (sequenceIndex: number, duration = 0.2) => {
      previousAction = activeAction
      activeAction = actions[sequenceIndex]

      if (previousAction) {
        previousAction.stop()
      }

      // Update mesh morph targets
      const geometry = mesh.geometry
      if (geometry instanceof THREE.BufferGeometry) {
        // mesh.updateMorphTargets()

        geometry.morphAttributes.position = meshRenderData.geometryBuffers[sequenceIndex]
      }

      activeAction.reset().play()
    }
  }

  return meshModelController
}

/**
 * The model state
 */
export type ModelState = {
  isPaused: boolean
  activeSequenceIndex: number
  showedSubModels: number[]
  frame: number
  playbackRate: number
}

/**
 * Creates model controller.
 * @todo refactor this shit
 */
export const createModelController = (
  meshes: THREE.Mesh[][][],
  meshesRenderData: MeshRenderData[][][],
  modelData: ModelData,
  initialSequence: number = 0
) => {
  let playbackRate = 1

  // Active sequence
  let activeSequenceIndex: number = initialSequence

  // List of showed sub models indices
  let showedSubModels: number[] = modelData.bodyParts.map(() => 0)

  // Path: [bodyPartIndex][subModelIndex][meshIndex][sequenceIndex]
  const meshControllers = meshes.map((bodyPart, bodyPartIndex) =>
    bodyPart.map((subModel, subModelIndex) =>
      subModel.map((mesh, meshIndex) =>
        createMeshController(
          mesh,
          meshesRenderData[bodyPartIndex][subModelIndex][meshIndex],
          modelData,
          subModelIndex === 0
        )
      )
    )
  )

  // Setting default animation
  meshControllers.forEach(bodyPart =>
    bodyPart.forEach(subModel => subModel.forEach(controller => controller.setAnimation(activeSequenceIndex)))
  )

  /** Returns current state of the model */
  const getCurrentState = (): ModelState => ({
    isPaused: playbackRate === 0,
    activeSequenceIndex,
    showedSubModels,
    frame:    0,
    playbackRate
  })

  const modelController = {
    /**
     * Updates delta til=me
     * @param deltaTime
     */
    update: (deltaTime: number) =>
      meshControllers.forEach(bodyPart =>
        bodyPart.forEach(subModel => subModel.forEach(controller => controller.update(deltaTime)))
      ),

    /** Returns current state of the model */
    getCurrentState,

    /** Set pause state of the model */
    setPause: (isPaused: boolean) => {
      playbackRate = isPaused ? 0 : 0

      meshControllers.forEach(bodyPart =>
        bodyPart.forEach(subModel => subModel.forEach(controller => controller.setPlaybackRate(playbackRate)))
      )

      return getCurrentState()
    },

    /**
     * Sets playback rate (animation speed)
     * @param rate
     */
    setPlaybackRate: (rate: number) => {
      playbackRate = rate

      meshControllers.forEach(bodyPart =>
        bodyPart.forEach(subModel => subModel.forEach(controller => controller.setPlaybackRate(playbackRate)))
      )

      return getCurrentState()
    },
    /**
     * Sets animation to play
     * @param sequenceIndex
     */
    setAnimation: (sequenceIndex: number) => {
      activeSequenceIndex = sequenceIndex

      meshControllers.forEach(bodyPart =>
        bodyPart.forEach(subModel => subModel.forEach(controller => controller.setAnimation(sequenceIndex)))
      )

      return getCurrentState()
    },

    /**
     * Shows specified sub model
     */
    showSubModel: (bodyPartIndex: number, subModelIndex: number) => {
      showedSubModels[bodyPartIndex] = subModelIndex

      meshControllers[bodyPartIndex].forEach((subModel, i) => {
        const isVisible = i === subModelIndex

        subModel.forEach(controller => {
          controller.setVisibility(isVisible)
        })
      })

      return getCurrentState()
    }
  }

  return modelController
}

export type ModelController = ReturnType<typeof createModelController>
