import * as React                                                from 'react'
import { WindowSizeSensor }                                      from 'libreact'
import { ModelData, parseModel }                                 from '../lib/modelDataParser'
import { buildTexture }                                          from '../lib/textureBuilder'
import { prepareRenderData, createModelMeshes, createContainer } from '../lib/modelRenderer'
import { renderScene }                                           from '../lib/screneRenderer'
import { createModelController, ModelController }                from '../lib/modelController'

type Props = {
  modelBuffer: ArrayBuffer
  setModelController: (controller: ModelController) => void
  setModelData: (modelData: ModelData) => void
}

export const Renderer = (props: Props) => {
  // Canvas reference
  const canvasRef = React.useRef<HTMLCanvasElement>(null)

  React.useEffect(
    () => {
      if (canvasRef.current) {
        const modelData: ModelData = parseModel(props.modelBuffer)

        const meshesRenderData = prepareRenderData(modelData)
        const textures = modelData.textures.map(texture => buildTexture(props.modelBuffer, texture))
        const meshes = createModelMeshes(meshesRenderData, modelData, textures)
        const controller: ModelController = createModelController(meshes, meshesRenderData, modelData)

        const container = createContainer(meshes)

        const scene = renderScene(canvasRef.current, controller)
        scene.add(container)

        props.setModelData(modelData)
        props.setModelController(controller)
      }
    },
    [props.modelBuffer]
  )

  return (
    <WindowSizeSensor>
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
