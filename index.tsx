import * as React      from 'react'
import * as ReactDOM   from 'react-dom'
import { App }         from './ui/App'

import * as model      from './models/leet.mdl'
// import * as model      from './models/jpngirl01.mdl'
import { renderModel } from './lib/modelRenderer'

// Render the app
ReactDOM.render(<App bgColor={0x4d7f7e} />, document.getElementById('root'))

fetch(model).then(async resp => {
  const buffer = await resp.arrayBuffer()

  renderModel(buffer)
})
