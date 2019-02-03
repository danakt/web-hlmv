import * as React          from 'react'
import { Fetch }           from './Fetch'
import { Renderer }        from './Renderer'

import * as model          from '../__mock__/leet.mdl'
import { ModelController } from '../lib/modelController'
import { Controller }      from './Controller'
import { ModelData }       from '../lib/modelDataParser'
// import * as model          from '../__mock__/jpngirl01.mdl'
import { GlobalStyles }    from './GlobalStyles'

type Props = {
  //
}

export const App = (props: Props) => {
  const [modelController, setModelController] = React.useState<ModelController | null>(null)
  const [modelData, setModelData] = React.useState<ModelData | null>(null)

  return (
    <React.Fragment>
      <GlobalStyles />

      <Fetch autoFetch url={model} type="buffer">
        {({ data }) => {
          if (data != null) {
            return (
              <React.Fragment>
                <Renderer modelBuffer={data} setModelController={setModelController} setModelData={setModelData} />

                {modelController != null && modelData != null && (
                  <Controller modelController={modelController} modelData={modelData} />
                )}
              </React.Fragment>
            )
          }
        }}
      </Fetch>
    </React.Fragment>
  )
}
