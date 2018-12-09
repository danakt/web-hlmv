import * as React                from 'react'
import * as THREE                from 'three'
import { WindowSizeSensor }      from 'libreact'
import { ModelData, parseModel } from '../lib/modelDataParser'
import { buildTexture }          from '../lib/textureBuilder'
import { renderModel }           from '../lib/modelRenderer'
import { renderScene }           from '../lib/screneRenderer'

type Props = {
  modelBuffer: ArrayBuffer
}

export const Renderer = (props: Props) => {
  // Model data
  const modelData: ModelData = React.useMemo(() => parseModel(props.modelBuffer), [props.modelBuffer])
  const textures: Uint8ClampedArray[] = React.useMemo(
    () => modelData.textures.map(texture => buildTexture(props.modelBuffer, texture)),
    [modelData]
  )
  const modelThreeGroup: THREE.Group = React.useMemo(() => renderModel(modelData, textures), [modelData])

  // Canvas reference
  const canvasRef = React.useRef<HTMLCanvasElement>(null)

  React.useEffect(
    () => {
      if (canvasRef.current != null) {
        renderScene(canvasRef.current, modelThreeGroup)
      }
    },
    [canvasRef.current]
  )

  console.log(modelData, canvasRef)

  return (
    <WindowSizeSensor
      onChange={size => {
        // if (typeof props.onResize === 'function') {
        //   props.onResize(size.width, size.height)
        // }
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
