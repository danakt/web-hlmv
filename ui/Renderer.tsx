import * as React                                                from 'react'
import { WindowSizeSensor }                                      from 'libreact/lib/WindowSizeSensor'
import { ModelData, parseModel }                                 from '../lib/modelDataParser'
import { buildTexture }                                          from '../lib/textureBuilder'
import { prepareRenderData, createModelMeshes, createContainer } from '../lib/modelRenderer'
import { createModelController, ModelController }                from '../lib/modelController'
import {
  createOrbitControls,
  createRenderer,
  createCamera,
  createLights,
  createClock,
  createScene
} from '../lib/screneRenderer'

const useAnimationFrame = function<T extends (...args: any[]) => void>(callback: T) {
  const callbackRef = React.useRef(callback)
  React.useEffect(() => (callbackRef.current = callback), [callback])

  const loop = () => {
    ;(frameRef as any).current = requestAnimationFrame(loop)

    callbackRef.current()
  }

  const frameRef = React.useRef<number>(null)

  React.useLayoutEffect(() => {
    ;(frameRef as any).current = requestAnimationFrame(loop)

    return () => cancelAnimationFrame(frameRef.current!)
  }, [])
}

type Props = {
  modelBuffer: ArrayBuffer
  setModelController: (controller: ModelController) => void
  setModelData: (modelData: ModelData) => void
}

export const Renderer = (props: Props) => {
  // Canvas reference
  const canvasRef = React.useRef<HTMLCanvasElement>(null)

  // Camera
  const camera = React.useMemo(() => createCamera(), [])
  // Clock
  const clock = React.useMemo(() => createClock(), [])
  // Clock
  const scene = React.useMemo(() => createScene(), [])

  // Three renderer
  const renderer: THREE.WebGLRenderer | null = React.useMemo(
    () => canvasRef.current && createRenderer(canvasRef.current),
    [canvasRef.current]
  )

  // Orbit controller
  const orbitControls: THREE.OrbitControls | null = React.useMemo(
    () => canvasRef.current && createOrbitControls(camera, canvasRef.current),
    [camera, canvasRef.current]
  )

  // Scene lights
  // Note: you can pass lights color to arguments
  const lights = React.useMemo(() => createLights(), [])

  // Parsing the model buffer
  const modelData: ModelData = React.useMemo(() => parseModel(props.modelBuffer), [props.modelBuffer])

  // Meshes render
  const meshesRenderData = React.useMemo(() => prepareRenderData(modelData), [modelData])

  // Textures preparing
  const textures = React.useMemo(() => modelData.textures.map(texture => buildTexture(props.modelBuffer, texture)), [
    modelData
  ])

  // Generation meshes
  const meshes = React.useMemo(() => createModelMeshes(meshesRenderData, modelData, textures), [
    meshesRenderData,
    modelData,
    textures
  ])

  // Creating model controller
  const controller: ModelController = React.useMemo(() => createModelController(meshes, meshesRenderData, modelData), [
    meshes,
    meshesRenderData,
    modelData
  ])

  // Mesh container
  const container = React.useMemo(() => createContainer(meshes), [meshes])

  // Updating scene objects
  React.useEffect(() => {
    if (scene) {
      scene.add(container)
      scene.add(...lights)

      return () => {
        scene.remove(container)
        scene.remove(...lights)
      }
    }
  }, [container, scene, lights])

  // Update model data
  React.useEffect(() => props.setModelData(modelData), [modelData])

  // Update controller
  React.useEffect(() => props.setModelController(controller), [controller])

  // Updating animation frame
  useAnimationFrame(() => {
    if (orbitControls) {
      orbitControls.update()
    }

    const delta = clock.getDelta()
    controller.update(delta)

    if (renderer) {
      renderer.render(scene, camera)
    }
  })

  return (
    <WindowSizeSensor
      onChange={size => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()

        if (renderer) {
          renderer.setSize(size.width, size.height)
        }
      }}
    >
      {(state: any) => (
        <canvas
          ref={canvasRef}
          style={{
            width:  state.width + 'px',
            height: state.height + 'px'
          }}
        />
      )}
    </WindowSizeSensor>
  )
}
