import * as React   from 'react'
import styled       from 'styled-components'
import { DatItem }  from './DatItem'
import { DatLabel } from './DatLabel'

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

export const DatButton = (props: Props) => (
  <DatItemButton>
    <DatLabel>{props.children}</DatLabel>
  </DatItemButton>
)
