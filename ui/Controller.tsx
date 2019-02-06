import * as React          from 'react'
import * as R              from 'ramda'
import styled              from 'styled-components'
import { ModelController } from '../lib/modelController'
import { ModelData }       from '../lib/modelDataParser'
import { DatWrapper }      from './DatWrapper'
import { DatFolder }       from './DatFolder'
import { DatButton }       from './DatButton'
import { DatSelect }       from './DatSelect'
import { DatNumber }       from './DatNumber'

const StyledDatGui = styled(DatWrapper)`
  position: absolute;
  top: 15px;
  right: 15px;
`

type Props = {
  modelController: ModelController
  modelData: ModelData
}

/**
 * Component with form of controlling model behavior
 */
export const Controller = (props: Props) => {
  const [animationIndex, setAnimationIndex] = React.useState(props.modelController.activeSequenceIndex)
  const [isPaused, setPause] = React.useState(false)
  const [showedSubModels, setShowedSubModels] = React.useState(props.modelData.bodyParts.map(() => 0))

  // Change animation
  React.useEffect(
    () => {
      props.modelController.setAnimation(animationIndex)
    },
    [animationIndex]
  )

  // Pause/play
  React.useEffect(
    () => {
      props.modelController.setPlaybackRate(isPaused ? 0 : 1)
    },
    [isPaused]
  )

  // Updating sub models
  React.useEffect(() => {
    showedSubModels.forEach((subModelIndex, bodyPartIndex) =>
      props.modelController.showSubModel(bodyPartIndex, subModelIndex)
    )
  }, showedSubModels)

  return (
    <StyledDatGui>
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
          value={props.modelData.sequences[animationIndex].numFrames / props.modelData.sequences[animationIndex].fps}
        />
      </DatFolder>

      <DatFolder title="Body parts">
        {props.modelData.bodyParts.map((bodyPart, bodyPartIndex) => (
          <DatSelect
            key={bodyPartIndex}
            label={bodyPart.name}
            activeItemIndex={showedSubModels[bodyPartIndex]}
            items={props.modelData.subModels[bodyPartIndex].map(subModel => subModel.name)}
            onChange={subModelIndex =>
              setShowedSubModels(R.set(R.lensIndex(bodyPartIndex), subModelIndex, showedSubModels))
            }
          />
        ))}
      </DatFolder>
    </StyledDatGui>
  )
}
