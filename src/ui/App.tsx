import leetModel from '../__mock__/leet.mdl';
import * as React from 'react';
import { hot } from 'react-hot-loader';
import DropzoneContainer from 'react-dropzone';
import { ModelController } from '../lib/modelController';
import { ModelData } from '../lib/modelDataParser';
import { LoadingScreen } from './LoadingScreen';
import { Renderer } from './Renderer';
import { Controller } from './Controller';
import { GlobalStyles } from './GlobalStyles';
import { Dropzone } from './Dropzone';
import { BackgroundContainer } from './BackgroundContainer';
import { FileContainer } from './FileContainer';
import { GithubButton } from './GithubButton';
import { StartScreen } from './StartScreen';

/** Is need to show demo */
export const App = hot(module)(() => {
  const [modelController, setModelController] = React.useState<ModelController | undefined>(undefined);
  const [modelData, setModelData] = React.useState<ModelData | undefined>(undefined);
  const [isDemoShowed] = React.useState(location.search.indexOf('?demo') === 0);
  const [demoFileUrl] = React.useState(leetModel);

  return (
    <FileContainer defaultFileUrl={isDemoShowed ? demoFileUrl : null}>
      {({ buffer, isLoading }, { setFile, setFileUrl }) => (
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
                        // onClick={getRootProps().onClick}
                        backgroundColor={backgroundColor}
                        onFileLoad={file => setFile(file)}
                        isDragActive={isDragActive}
                        inputProps={getInputProps()}
                      >
                        {isDragActive ? (
                          'Drop model here...'
                        ) : (
                          <StartScreen
                            demoFileUrl={demoFileUrl}
                            selectFile={getRootProps().onClick}
                            setFileUrl={setFileUrl}
                          />
                        )}
                      </Dropzone>
                    )}

                    {isLoading && <LoadingScreen>Loading...</LoadingScreen>}

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
  );
});
