import * as React from 'react';
import styled from 'styled-components';
import { INITIAL_UI_BACKGROUND } from '../const/constants';
import { ControllerContainer } from './ControllerContainer';
import { ModelController } from '../lib/modelController';
import { ModelData } from '../lib/modelDataParser';
import { DatWrapper } from '../dat/DatWrapper';
import { DatFolder } from '../dat/DatFolder';
import { DatButton } from '../dat/DatButton';
import { DatSelect } from '../dat/DatSelect';
import { DatNumber } from '../dat/DatNumber';
import { DatColor } from '../dat/DatColor';
import { DatFile } from '../dat/DatFile';
import { DatRange } from '../dat/DatRange';

const StyledDatGui = styled(DatWrapper)`
  position: absolute;
  top: 15px;
  right: 15px;
  z-index: 3;
`;

type Props = {
  backgroundColor: string;
  modelController?: ModelController;
  modelData?: ModelData;
  isLoading: boolean;
  onBackgroundColorUpdate: (color: string) => void;
  onModelLoad: (file: File) => void;
};

/**
 * Component with form of controlling model behavior
 */
export const Controller = (props: Props) => {
  const { backgroundColor, modelController, modelData, isLoading } = props;

  return (
    <StyledDatGui>
      <DatFile
        label={props.modelData ? props.modelData.header.name : 'Select a file'}
        onChange={file => props.onModelLoad(file)}
      />

      <DatColor label="Background" value={backgroundColor} onChange={color => props.onBackgroundColorUpdate(color)} />
      {backgroundColor !== INITIAL_UI_BACKGROUND && (
        <DatButton onClick={() => props.onBackgroundColorUpdate(INITIAL_UI_BACKGROUND)}>
          Set default background color
        </DatButton>
      )}

      {!isLoading && modelController && modelData && (
        <ControllerContainer modelData={modelData} modelController={modelController}>
          {(
            { isPaused, activeAnimationIndex: activeSequenceIndex, showedSubModels, frame, playbackRate },
            { togglePause, setAnimation, showSubModel, setPlaybackRate, setFrame, setTempPaused }
          ) => (
            <React.Fragment>
              <DatFolder title="Animation">
                <DatSelect
                  label="Sequence"
                  activeItemIndex={activeSequenceIndex}
                  items={modelData.sequences.map(item => item.label)}
                  onChange={seqIndex => setAnimation(seqIndex)}
                />
                <DatButton onClick={() => togglePause()}>{isPaused ? 'Play' : 'Pause'}</DatButton>
                <DatRange
                  label="Frame"
                  value={frame}
                  min={0}
                  max={modelData.sequences[activeSequenceIndex].numFrames - 1}
                  onChange={value => setFrame(value)}
                  onChangeStart={() => setTempPaused(true)}
                  onChangeComplete={() => setTempPaused(false)}
                />
                <DatRange
                  label="Playback rate"
                  value={Number(playbackRate.toFixed(2))}
                  min={0}
                  max={2}
                  step={0.1}
                  onChange={value => setPlaybackRate(value)}
                />
                <DatNumber label="Frames" disabled value={modelData.sequences[activeSequenceIndex].numFrames} />
                <DatNumber label="FPS" disabled value={modelData.sequences[activeSequenceIndex].fps} />
                <DatNumber
                  label="Duration (sec)"
                  disabled
                  value={Number(
                    (
                      modelData.sequences[activeSequenceIndex].numFrames / modelData.sequences[activeSequenceIndex].fps
                    ).toFixed(3)
                  )}
                />
              </DatFolder>

              <DatFolder title="Body parts">
                {modelData.bodyParts.map((bodyPart, bodyPartIndex) => (
                  <DatSelect
                    key={bodyPartIndex}
                    label={bodyPart.name}
                    activeItemIndex={showedSubModels[bodyPartIndex]}
                    items={props.modelData!.subModels[bodyPartIndex].map(subModel => subModel.name)}
                    onChange={subModelIndex => showSubModel(bodyPartIndex, subModelIndex)}
                  />
                ))}
              </DatFolder>
            </React.Fragment>
          )}
        </ControllerContainer>
      )}
    </StyledDatGui>
  );
};
