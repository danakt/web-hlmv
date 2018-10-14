import * as model      from '../models/leet.mdl'
// import * as model      from '../models/jpngirl01.mdl'
import * as React      from 'react'
import { Controls }    from './Controls'
import { Canvas }      from './Canvas'
import { renderModel } from '../lib/modelRenderer'

/**
 * State of the app
 */
type State = {
  width: number
  height: number
  bgColor: number
  modelBuffer: ArrayBuffer | null
}

/**
 * The root application component
 */
export class App extends React.Component<{}, State> {
  public state = {
    width:       window.innerWidth,
    height:      window.innerHeight,
    bgColor:     0x4d7f7e,
    modelBuffer: null
  }

  public async componentDidMount() {
    const resp = await fetch(model)
    const modelBuffer = await resp.arrayBuffer()

    this.setState({
      modelBuffer
    })

    console.log(renderModel(modelBuffer))
  }

  public render() {
    return (
      <Controls>
        <Canvas bgColor={'#' + this.state.bgColor.toString(16)} onResize={this.handleResize} />
      </Controls>
    )
  }

  /**
   * Handles window resize
   */
  private handleResize = (width: number, height: number) => {
    this.setState({ width, height })
  }
}
