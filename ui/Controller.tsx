import * as React                from 'react'
import * as R                    from 'ramda'
import styled                    from 'styled-components'
import { INITIAL_UI_BACKGROUND } from '../const/constants'
import { ModelController }       from '../lib/modelController'
import { ModelData }             from '../lib/modelDataParser'
import { DatWrapper }            from '../dat/DatWrapper'
import { DatFolder }             from '../dat/DatFolder'
import { DatButton }             from '../dat/DatButton'
import { DatSelect }             from '../dat/DatSelect'
import { DatNumber }             from '../dat/DatNumber'
import { DatColor }              from '../dat/DatColor'
import { DatFile }               from '../dat/DatFile'

const StyledDatGui = styled(DatWrapper)`
  position: absolute;
  top: 15px;
  right: 15px;
  z-index: 3;
`

type Props = {
  backgroundColor: string
  modelController?: ModelController | null
  modelData?: ModelData | null
  isLoading: boolean
  onBackgroundColorUpdate: (color: string) => void
  onModelLoad: (file: File) => void
}

/**
 * Component with form of controlling model behavior
 */
export const Controller = (props: Props) => {
  const [animationIndex, setAnimationIndex] = React.useState(() =>
    props.modelController ? props.modelController.activeSequenceIndex : 0
  )
  const [isPaused, setPause] = React.useState(false)
  const [showedSubModels, setShowedSubModels] = React.useState<number[]>(() =>
    props.modelData ? props.modelData.bodyParts.map(() => 0) : []
  )

  React.useEffect(
    () => {
      if (props.modelController && props.modelData) {
        setAnimationIndex(props.modelController.activeSequenceIndex)
        setShowedSubModels(props.modelData.bodyParts.map(() => 0))
      }
    },
    [props.modelController, props.modelData]
  )

  // Change animation
  React.useEffect(
    () => {
      if (props.modelController) {
        props.modelController.setAnimation(animationIndex)
      }
    },
    [animationIndex]
  )

  // Pause/play
  React.useEffect(
    () => {
      if (props.modelController) {
        props.modelController.setPlaybackRate(isPaused ? 0 : 1)
      }
    },
    [isPaused]
  )

  // Updating sub models
  React.useEffect(
    () => {
      showedSubModels.forEach((subModelIndex, bodyPartIndex) => {
        if (props.modelController) {
          props.modelController.showSubModel(bodyPartIndex, subModelIndex)
        }
      })
    },
    [showedSubModels]
  )

  return (
    <StyledDatGui>
      <DatFile
        label={props.modelData ? props.modelData.header.name : 'Select a file'}
        onChange={file => props.onModelLoad(file)}
      />

      <DatColor
        label="Background"
        value={props.backgroundColor}
        onChange={color => props.onBackgroundColorUpdate(color)}
      />
      {props.backgroundColor !== INITIAL_UI_BACKGROUND && (
        <DatButton onClick={() => props.onBackgroundColorUpdate(INITIAL_UI_BACKGROUND)}>
          Set default background color
        </DatButton>
      )}

      {!props.isLoading && props.modelController && props.modelData && (
        <React.Fragment>
          <DatFolder title="Animation">
            <DatButton onClick={() => setPause(!isPaused)}>{isPaused ? 'Play' : 'Pause'}</DatButton>
            <DatSelect
              label="Sequence"
              activeItemIndex={animationIndex}
              items={props.modelData.sequences.map(item => item.label)}
              onChange={seqIndex => setAnimationIndex(seqIndex)}
            />
            <DatNumber label="Frames" disabled value={props.modelData.sequences[animationIndex].numFrames} />
            <DatNumber label="FPS" disabled value={props.modelData.sequences[animationIndex].fps} />
            <DatNumber
              label="Duration (sec)"
              disabled
              value={Number(
                (
                  props.modelData.sequences[animationIndex].numFrames / props.modelData.sequences[animationIndex].fps
                ).toFixed(3)
              )}
            />
          </DatFolder>

          <DatFolder title="Body parts">
            {props.modelData.bodyParts.map((bodyPart, bodyPartIndex) => (
              <DatSelect
                key={bodyPartIndex}
                label={bodyPart.name}
                activeItemIndex={showedSubModels[bodyPartIndex]}
                items={props.modelData!.subModels[bodyPartIndex].map(subModel => subModel.name)}
                onChange={subModelIndex =>
                  setShowedSubModels(R.set(R.lensIndex(bodyPartIndex), subModelIndex, showedSubModels))
                }
              />
            ))}
          </DatFolder>
        </React.Fragment>
      )}
    </StyledDatGui>
  )
}
