import * as leetModel          from '../__mock__/leet.mdl'
import * as React              from 'react'
import { hot }                 from 'react-hot-loader'
import DropzoneContainer       from 'react-dropzone'
import { ModelController }     from '../lib/modelController'
import { ModelData }           from '../lib/modelDataParser'
import { LoadingScreen }       from './LoadingScreen'
import { Renderer }            from './Renderer'
import { Controller }          from './Controller'
import { GlobalStyles }        from './GlobalStyles'
import { Dropzone }            from './Dropzone'
import { BackgroundContainer } from './BackgroundContainer'
import { FileContainer }       from './FileContainer'
import { GithubButton }        from './GithubButton'

/** Is need to show demo */
const IS_DEMO_SHOWED = location.search.indexOf('?demo') === 0

export const App = hot(module)(() => {
  const [modelController, setModelController] = React.useState<ModelController | null>(null)
  const [modelData, setModelData] = React.useState<ModelData | null>(null)

  return (
    <FileContainer defaultFileUrl={IS_DEMO_SHOWED ? leetModel : null}>
      {({ buffer, isLoading }, { setFile }) => (
        <DropzoneContainer onDrop={files => setFile(files[0])}>
          {({ getRootProps, getInputProps, isDragActive }) => (
            <div {...getRootProps()} onClick={undefined}>
              <BackgroundContainer>
                {({ backgroundColor }, { setBackgroundColor }) => (
                  <React.Fragment>
                    <GlobalStyles backgroundColor={backgroundColor} color="#fff" />

                    <GithubButton />

                    <Controller
                      isLoading={isLoading}
                      backgroundColor={backgroundColor}
                      modelController={modelController}
                      modelData={modelData}
                      onBackgroundColorUpdate={setBackgroundColor}
                      onModelLoad={file => setFile(file)}
                    />

                    {(isDragActive || (!buffer && !isLoading)) && (
                      <Dropzone
                        onClick={getRootProps().onClick}
                        backgroundColor={backgroundColor}
                        onFileLoad={file => setFile(file)}
                        isDragActive={isDragActive}
                        inputProps={getInputProps()}
                      />
                    )}

                    {isLoading && <LoadingScreen />}

                    {buffer && !isLoading && (
                      <React.Fragment>
                        <Renderer
                          modelBuffer={buffer}
                          setModelController={setModelController}
                          setModelData={setModelData}
                        />
                      </React.Fragment>
                    )}
                  </React.Fragment>
                )}
              </BackgroundContainer>
            </div>
          )}
        </DropzoneContainer>
      )}
    </FileContainer>
  )
})
