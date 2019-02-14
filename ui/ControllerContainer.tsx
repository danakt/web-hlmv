import * as React                      from 'react'
import { ModelController, ModelState } from '../lib/modelController'
import { ModelData }                   from '../lib/modelDataParser'

type Data = ModelState

type Actions = {
  togglePause: () => void
  setAnimation: (seqIndex: number) => void
  showSubModel: (bodyPartIndex: number, subModelIndex: number) => void
  setPlaybackRate: (rate: number) => void
  setFrame: (frame: number) => void
}

type Props = {
  modelData: ModelData
  modelController: ModelController
  children: (data: Data, actions: Actions) => React.ReactNode
}

/**
 * Controller container
 */
export const ControllerContainer = (props: Props) => {
  const [modelState, setModelState] = React.useState(() => props.modelController.getCurrentState())

  React.useEffect(() => {
    if (props.modelController) {
      setModelState(props.modelController.getCurrentState())
    }
  }, [props.modelController])

  // Updating animation frame index
  React.useEffect(() => {
    const frameDelay = (1 / props.modelData.sequences[modelState.activeAnimationIndex].fps) * 1000
    const intervalId = setInterval(() => setModelState(props.modelController.getCurrentState()), frameDelay)

    return () => clearInterval(intervalId)
  }, [props.modelData, modelState.activeAnimationIndex])

  return (
    <React.Fragment>
      {props.children(modelState, {
        togglePause:  () => setModelState(props.modelController.setPause(!modelState.isPaused)),
        setAnimation: seqIndex => setModelState(props.modelController.setAnimation(seqIndex)),
        showSubModel: (bodyPartIndex, subModelIndex) =>
          setModelState(props.modelController.showSubModel(bodyPartIndex, subModelIndex)),
        setPlaybackRate: rate => setModelState(props.modelController.setPlaybackRate(rate)),
        setFrame:        frame => setModelState(props.modelController.setFrame(frame))
      })}
    </React.Fragment>
  )
}
