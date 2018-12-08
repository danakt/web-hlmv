import * as React      from 'react'
import * as ReactDOM   from 'react-dom'
import { hot }         from 'react-hot-loader'
import { App }         from './ui/App'

import * as model      from './mdl/leet.mdl'
// import * as model      from './mdl/jpngirl01.mdl'
import { renderModel } from './lib/modelRenderer'

// Render the app
ReactDOM.render(hot(module)(<App />), document.getElementById('root'))

fetch(model).then(async resp => {
  const buffer = await resp.arrayBuffer()

  renderModel(buffer)
})
