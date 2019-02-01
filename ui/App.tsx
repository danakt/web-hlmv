import * as React          from 'react'
import { Fetch }           from './Fetch'
import { Renderer }        from './Renderer'

import * as model          from '../__mock__/leet.mdl'
import { ModelController } from '../lib/modelController'
import { Controller }      from './Controller'
import { ModelData }       from '../lib/modelDataParser'
// import * as model   from '../__mock__/jpngirl01.mdl'

type Props = {
  //
}

export const App = (props: Props) => {
  const [modelController, setModelController] = React.useState<ModelController | null>(null)
  const [modelData, setModelData] = React.useState<ModelData | null>(null)
  const [currentSequence, setCurrentSequence] = React.useState(3)

  return (
    <Fetch autoFetch url={model} type="buffer">
      {({ data }) => {
        if (data != null) {
          return (
            <React.Fragment>
              <Renderer
                modelBuffer={data}
                setModelController={setModelController}
                setModelData={setModelData}
                currentSequence={currentSequence}
              />

              {modelController != null && modelData != null && (
                <Controller
                  modelController={modelController}
                  modelData={modelData}
                  currentSequence={currentSequence}
                  setCurrentSequence={i => setCurrentSequence(i)}
                />
              )}
            </React.Fragment>
          )
        }
      }}
    </Fetch>
  )
}
