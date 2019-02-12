import * as React                      from 'react'
import { ModelController, ModelState } from '../lib/modelController'

type Data = ModelState

type Actions = {
  togglePause: () => void
  setAnimation: (seqIndex: number) => void
  showSubModel: (bodyPartIndex: number, subModelIndex: number) => void
}

type Props = {
  modelController: ModelController
  children: (data: Data, actions: Actions) => React.ReactNode
}

/**
 * Controller container
 */
export const ControllerContainer = (props: Props) => {
  const [modelState, setModelState] = React.useState(() => props.modelController.getCurrentState())

  React.useEffect(
    () => {
      if (props.modelController) {
        setModelState(props.modelController.getCurrentState())
      }
    },
    [props.modelController]
  )

  return (
    <React.Fragment>
      {props.children(modelState, {
        togglePause:  () => setModelState(props.modelController.setPause(!modelState.isPaused)),
        setAnimation: seqIndex => setModelState(props.modelController.setAnimation(seqIndex)),
        showSubModel: (bodyPartIndex, subModelIndex) =>
          setModelState(props.modelController.showSubModel(bodyPartIndex, subModelIndex))
      })}
    </React.Fragment>
  )
}
