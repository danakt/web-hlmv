import * as React  from 'react'
import styled      from 'styled-components'
import { DatItem } from './DatItem'

const DatItemButton = styled(DatItem)`
  border-left-color: #e61d5f;
  cursor: pointer;

  &:hover {
    background: #111;
  }
`

type Props = {
  onClick?: () => void
  children?: React.ReactNode
}

export const DatButton = (props: Props) => <DatItemButton onClick={props.onClick}>{props.children}</DatItemButton>
