import * as React    from 'react'
import * as ReactDOM from 'react-dom'
import { hot }       from 'react-hot-loader'
import { App }       from './ui/App'

// Render the app
ReactDOM.render(hot(module)(<App />), document.getElementById('root'))
