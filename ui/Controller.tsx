import * as React          from 'react'
import styled              from 'styled-components'
import { ModelController } from '../lib/modelController'

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
}

export const Controller = (props: Props) => {
  const [isPaused, setPause] = React.useState(props.modelController.isPaused)

  return (
    <Wrapper>
      <button
        onClick={() => {
          isPaused
            ? props.modelController.playAnimation(props.modelController.activeSequenceIndex)
            : props.modelController.pauseAnimation()

          setPause(props.modelController.isPaused)
        }}
      >
        {isPaused ? 'Play' : 'Stop'}
      </button>
    </Wrapper>
  )
}
