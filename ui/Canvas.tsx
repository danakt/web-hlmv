import * as React from 'react'
import styled     from 'styled-components'

const StyledCanvas = styled.canvas`
  width: 100%;
  height: 100%;
`

type Props = {
  onResize?(width: number, height: number): void
  bgColor: string
}

/**
 * Canvas component
 */
export class Canvas extends React.Component<Props> {
  private canvasRef: React.RefObject<HTMLCanvasElement> = React.createRef()

  public componentDidMount() {
    window.addEventListener('resize', this.handleResize)
  }

  public componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
  }

  public render() {
    return <StyledCanvas ref={this.canvasRef as any} style={{ backgroundColor: this.props.bgColor }} />
  }

  /** Handles canvas resize */
  private handleResize = () => {
    const canvasElement = this.canvasRef.current

    if (this.props.onResize && canvasElement) {
      this.props.onResize(canvasElement.width, canvasElement.height)
    }
  }
}
