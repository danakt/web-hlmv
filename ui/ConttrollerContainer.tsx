import * as React          from 'react'
import { ModelController } from '../lib/modelController'
import { ModelData }       from '../lib/modelDataParser'

export type ControllerData = {
  isPaused: boolean
  animationIndex: number
  animationName: string
}

type Actions = {
  setAnimation: (index: number) => void
  setPause: (isPaused: boolean) => void
}

type Props = {
  modelController: ModelController
  modelData: ModelData
  children: (data: ControllerData, actions: Actions) => React.ReactNode
}

export const ControllerContainer = (props: Props) => {
  const [animationIndex, setAnimation] = React.useState(props.modelController.activeSequenceIndex)
  const [isPaused, setPause] = React.useState(false)

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

  return (
    <React.Fragment>
      {props.children(
        {
          isPaused,
          animationIndex,
          animationName: props.modelData.sequences[animationIndex].label
        },
        {
          setAnimation,
          setPause
        }
      )}
    </React.Fragment>
  )
}
