import * as React          from 'react'
import { Fetch }           from './Fetch'
import { Renderer }        from './Renderer'
import DropzoneContainer   from 'react-dropzone'

import * as model          from '../__mock__/leet.mdl'
// import * as model          from '../__mock__/jpngirl01.mdl'
import { ModelController } from '../lib/modelController'
import { Controller }      from './Controller'
import { ModelData }       from '../lib/modelDataParser'
import { GlobalStyles }    from './GlobalStyles'
import { Dropzone }        from './Dropzone'
import { LoadingScreen }   from './LoadingScreen'

type Props = {
  //
}

export const App = (props: Props) => {
  const [modelController, setModelController] = React.useState<ModelController | null>(null)
  const [modelData, setModelData] = React.useState<ModelData | null>(null)
  const [isLoading, setLoadingState] = React.useState(false)
  const [modelBuffer, setModelBuffer] = React.useState<ArrayBuffer | null>(null)

  return (
    <React.Fragment>
      <GlobalStyles />

      {modelBuffer ? (
        <React.Fragment>
          <Renderer modelBuffer={modelBuffer} setModelController={setModelController} setModelData={setModelData} />

          {modelController != null && modelData != null && (
            <Controller modelController={modelController} modelData={modelData} />
          )}
        </React.Fragment>
      ) : isLoading ? (
        <LoadingScreen />
      ) : (
        <DropzoneContainer
          onDrop={accepted => {
            const fileReader = new FileReader()
            fileReader.addEventListener('load', () => {
              setModelBuffer(fileReader.result as ArrayBuffer)
              setLoadingState(false)
            })

            fileReader.readAsArrayBuffer(accepted[0])
            setLoadingState(true)
          }}
        >
          {({ getRootProps, getInputProps, isDragActive }) => (
            <Dropzone wrapperProps={getRootProps()} inputProps={getInputProps()} isDragActive={isDragActive} />
          )}
        </DropzoneContainer>
      )}
    </React.Fragment>
  )
}
