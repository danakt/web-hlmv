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

export const createMeshController = (mesh: THREE.Mesh, meshRenderData: MeshRenderData, modelData: ModelData) => {
  console.time(`   Creating mesh controller ${mesh.uuid}`)

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

  console.timeEnd(`   Creating mesh controller ${mesh.uuid}`)

  return meshModelController
}

/**
 * Creates model controller
 */
export const createModelController = (
  meshes: THREE.Mesh[][][],
  meshesRenderData: MeshRenderData[][][],
  modelData: ModelData
) => {
  console.time('Creating model controller')

  let activeSequenceIndex = 0

  // Path: [bodyPartIndex][subModelIndex][meshIndex][sequenceIndex]
  const meshControllers = meshes.map((bodyPart, bodyPartIndex) =>
    bodyPart.map((subModel, subModelIndex) =>
      subModel.map((mesh, meshIndex) =>
        createMeshController(mesh, meshesRenderData[bodyPartIndex][subModelIndex][meshIndex], modelData)
      )
    )
  )

  const modelController = {
    /** Returns active sequence index */
    get activeSequenceIndex() {
      return activeSequenceIndex
    },

    /**
     * Sets playback rate (animation speed)
     * @param rate
     */
    setPlaybackRate: (rate: number) =>
      meshControllers.forEach(bodyPart =>
        bodyPart.forEach(subModel => subModel.forEach(controller => controller.setPlaybackRate(rate)))
      ),

    /**
     * Updates delta tile
     */
    update: (deltaTime: number) =>
      meshControllers.forEach(bodyPart =>
        bodyPart.forEach(subModel => subModel.forEach(controller => controller.update(deltaTime)))
      ),

    /**
     * Sets animation to play
     */
    setAnimation: (sequenceIndex: number) => {
      activeSequenceIndex = sequenceIndex

      meshControllers.forEach(bodyPart =>
        bodyPart.forEach(subModel => subModel.forEach(controller => controller.setAnimation(sequenceIndex)))
      )
    }
  }

  console.timeEnd('Creating model controller')

  return modelController
}

export type ModelController = ReturnType<typeof createModelController>
