import * as model                         from '../../models/leet.mdl'
import * as React                         from 'react'
import { Controls }                       from './Controls'
import { Canvas }                         from './Canvas'
import { createModelParser, ModelParser } from '../modelParser'

/**
 * State of the app
 */
type State = {
  width: number
  height: number
  bgColor: number
  modelParser: ModelParser | null
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
    modelBuffer: null,
    modelParser: null
  }

  public async componentDidMount() {
    const resp = await fetch(model)
    const modelBuffer = await resp.arrayBuffer()
    const modelParser = createModelParser(modelBuffer)

    this.setState({
      modelBuffer,
      modelParser
    })

    console.log(modelParser.parseModel())
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
