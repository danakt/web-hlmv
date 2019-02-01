import * as React          from 'react'
import styled              from 'styled-components'
import { ModelController } from '../lib/modelController'
import { ModelData }       from '../lib/modelDataParser'

const Wrapper = styled.div`
  z-index: 999;
  font-size: 15px;
  padding: 20px;
  position: absolute;
  right: 0;
  top: 0;
  max-height: 100vh;
`

type Props = {
  modelController: ModelController
  modelData: ModelData
  currentSequence: number
  setCurrentSequence: (sequenceIndex: number) => void
}

export const Controller = (props: Props) => {
  return (
    <Wrapper>
      <div>
        <select
          value={props.currentSequence}
          onChange={event => {
            const sequenceIndex = parseInt(event.target.value) || 0

            props.setCurrentSequence(sequenceIndex)
            props.modelController.setAnimation(sequenceIndex)
          }}
        >
          {props.modelData.sequences.map((sequence, i) => (
            <option key={i} value={i}>
              {sequence.label} ({sequence.numframes})
            </option>
          ))}
        </select>
      </div>
    </Wrapper>
  )
}
