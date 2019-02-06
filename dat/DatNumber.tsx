import * as React       from 'react'
import styled           from 'styled-components'
import { DatItem }      from './DatItem'
import { DatLabelText } from './DatLabelText'
import { DatInput }     from './DatInput'

type Props = {
  onChange?: (value: number) => void
  value: number
  label: React.ReactNode
  disabled?: boolean
}

const DatItemNumber = styled(DatItem)`
  border-left-color: #2fa1d6;
`

export const DatNumber = (props: Props) => (
  <DatItemNumber>
    <DatLabelText>{props.label}</DatLabelText>

    <DatInput
      style={{ width: '60%' }}
      type="number"
      inputMode="numeric"
      value={props.value}
      onChange={event => typeof props.onChange === 'function' && props.onChange(Number(event.target.value))}
      disabled={props.disabled}
    />
  </DatItemNumber>
)
