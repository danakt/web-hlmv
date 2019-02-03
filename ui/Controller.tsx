import * as React          from 'react'
import styled              from 'styled-components'
import { ModelController } from '../lib/modelController'
import { ModelData }       from '../lib/modelDataParser'

const Wrapper = styled.div`
  z-index: 999;
  font-size: 14px;
  padding: 20px;
  position: absolute;
  right: 0;
  top: 0;
  max-height: 100vh;
  color: rgba(255, 255, 255, 0.75);
`

const FormGroup = styled.div`
  margin: 5px;
`

const FormTitle = styled.label`
  display: block;
  font-weight: bold;
  margin: 15px 0 5px;
  color: #fff;
  font-size: 16px;
`

const Label = styled.label`
  margin: 3px 0;
`

type Props = {
  modelController: ModelController
  modelData: ModelData
}

export const Controller = (props: Props) => {
  const [currentSequenceIndex, setSequenceIndex] = React.useState(() => props.modelController.activeSequenceIndex)
  const [showedSubModels, setShowedSubModels] = React.useState(() => props.modelData.bodyParts.map(() => 0))
  const currentSequence = props.modelData.sequences[currentSequenceIndex]

  return (
    <Wrapper>
      <FormTitle>Animations</FormTitle>

      <FormGroup>
        <select
          value={currentSequenceIndex.toString()}
          onChange={event => {
            const sequenceIndex = parseInt(event.target.value) || 0

            props.modelController.setAnimation(sequenceIndex)
            setSequenceIndex(props.modelController.activeSequenceIndex)
          }}
        >
          {props.modelData.sequences.map((sequence, i) => (
            <option key={i} value={i}>
              {sequence.label}
            </option>
          ))}
        </select>
      </FormGroup>

      <FormGroup>
        <Label>Frames:</Label> {currentSequence.numFrames}
      </FormGroup>

      <FormGroup>
        <Label>FPS:</Label> {currentSequence.fps}
      </FormGroup>

      <FormGroup>
        <Label>Duration:</Label> {parseFloat((currentSequence.numFrames / currentSequence.fps).toFixed(3))}s.
      </FormGroup>

      <FormTitle htmlFor="animation">Body parts</FormTitle>

      {props.modelData.bodyParts.map((bodyPart, bodyPartIndex) => (
        <React.Fragment key={bodyPartIndex}>
          <FormGroup>
            <Label>{bodyPart.name}</Label>
          </FormGroup>

          <FormGroup>
            <div>
              <select
                value={showedSubModels[bodyPartIndex]}
                onChange={event => {
                  const subModelIndex = parseInt(event.target.value) || 0

                  props.modelController.showSubModel(bodyPartIndex, subModelIndex)
                  setShowedSubModels(props.modelController.showedSubModels)
                }}
              >
                {props.modelData.subModels[bodyPartIndex].map((subModel, subModelIndex) => (
                  <option key={subModelIndex} value={subModelIndex}>
                    {subModel.name}
                  </option>
                ))}
              </select>
            </div>
          </FormGroup>
        </React.Fragment>
      ))}
    </Wrapper>
  )
}
