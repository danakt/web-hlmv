import * as React                from 'react'
import styled                    from 'styled-components'
// eslint-disable-next-line no-unused-vars
import { ModelData, parseModel } from '../lib/modelDataParser'
import { Fetch }                 from './Fetch'
import { Canvas }                from './Canvas'

import * as model                from '../mdl/leet.mdl'
// import * as model                from '../mdl/jpngirl01.mdl'

const StyledCanvas = styled(Canvas)`
  /* background-color: #fff; */
`

type Props = {
  //
}

export const App = (props: Props) => {
  const [modelData, setModelData] = React.useState<ModelData | null>(null)

  if (modelData) {
    console.log(modelData)
  }

  return (
    <Fetch autoFetch url={model} type="buffer">
      {({ data }) => {
        if (data != null && modelData == null) {
          setModelData(parseModel(data))
        }

        return <StyledCanvas />
      }}
    </Fetch>
  )
}
