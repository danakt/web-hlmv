import * as React from 'react'
import styled     from 'styled-components'

const GridContainer = styled.div`
  grid-template-columns: auto minmax(300px, 20%);
  display: grid;
  grid-template-rows: 100vh;
`

const Sidebar = styled.aside`
  width: 100%;
  height: 100%;
`

type Props = {}

type State = {}

export class Controls extends React.Component<Props, State> {
  public state = {}

  public render() {
    return (
      <GridContainer>
        {this.props.children}

        <Sidebar>{/* 123 */}</Sidebar>
      </GridContainer>
    )
  }
}
