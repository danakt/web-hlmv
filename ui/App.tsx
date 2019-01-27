import * as React          from 'react'
import { Fetch }           from './Fetch'
import { Renderer }        from './Renderer'

import * as model          from '../__mock__/leet.mdl'
import { ModelController } from '../lib/modelController'
import { Controller }      from './Controller'
// import * as model   from '../__mock__/jpngirl01.mdl'

type Props = {
  //
}

export const App = (props: Props) => {
  const [modelController, setModelController] = React.useState<ModelController | null>(null)

  return (
    <Fetch autoFetch url={model} type="buffer">
      {({ data }) => {
        if (data != null) {
          return (
            <React.Fragment>
              <Renderer modelBuffer={data} setModelController={setModelController} />
              {modelController && <Controller modelController={modelController} />}
            </React.Fragment>
          )
        }
      }}
    </Fetch>
  )
}
