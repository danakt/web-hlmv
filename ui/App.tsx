import styled     from 'styled-components'
import * as React from 'react'

const Canvas = styled.canvas`
  width: 100%;
  height: 100%;
`

type Props = {
  bgColor: number
}

export const App = (props: Props) => <Canvas style={{ backgroundColor: '#' + props.bgColor.toString(16) }} />
