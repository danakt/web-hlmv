import * as React   from 'react'
import { Fetch }    from './Fetch'
import { Renderer } from './Renderer'

import * as model   from '../__mock__/leet.mdl'
// import * as model   from '../__mock__/jpngirl01.mdl'

type Props = {
  //
}

export const App = (props: Props) => {
  return (
    <Fetch autoFetch url={model} type="buffer">
      {({ data }) => {
        if (data != null) {
          return <Renderer modelBuffer={data} />
        }
      }}
    </Fetch>
  )
}
