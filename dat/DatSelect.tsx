import * as React       from 'react'
import styled           from 'styled-components'
import { DatItem }      from './DatItem'
import { DatLabel }     from './DatLabel'
import { DatLabelText } from './DatLabelText'

type Props = {
  label: React.ReactNode
  items: string[]
  activeItemIndex: number
  onChange: (selectedIndex: number) => void
}

const DatItemSelect = styled(DatItem)`
  border-left-color: #f4d450;
`

export const DatSelect = (props: Props) => (
  <DatItemSelect>
    <DatLabel>
      <DatLabelText>{props.label}</DatLabelText>

      <select
        value={props.activeItemIndex}
        style={{ width: '60%' }}
        onChange={event => props.onChange(parseInt(event.target.value))}
      >
        {props.items.map((item, i) => (
          <option key={i} value={i}>
            {item}
          </option>
        ))}
      </select>
    </DatLabel>
  </DatItemSelect>
)
