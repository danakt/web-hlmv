import * as React       from 'react'
import styled           from 'styled-components'

import { DatItem }      from './DatItem'
import { DatLabelText } from './DatLabelText'
import { DatInput }     from './DatInput'

const DatItemRange = styled(DatItem)`
  border-left-color: #2fa1d6;
`

const NumberInput = styled(DatInput)`
  width: 20%;
`

const RangeInput = styled.input`
  width: calc(40% - 6px);
  appearance: none;
  outline: none;
  padding: 0;
  cursor: pointer;
  overflow: hidden;
  height: 19px;
  margin: 3px;
  background: #2fa1d6;

  &::-webkit-slider-thumb {
    position: relative;
    appearance: none;
    height: 0;
    width: 0;
    background: #0199ff;
    border: 0;
    top: 50%;
    margin-top: -6.5px;
    box-shadow: 1000px 0 0 1000px #303030;
    transition: background-color 150ms;
  }

  &::-moz-range-thumb {
    position: relative;
    appearance: none;
    height: 0;
    width: 0;
    background: #0199ff;
    border: 0;
    top: 50%;
    margin-top: -6.5px;
    box-shadow: 1000px 0 0 1000px #303030;
    transition: background-color 150ms;
  }
`

type Props = {
  value: number
  label: React.ReactNode
  min: number
  max: number
  step?: number
  disabled?: boolean
  onChange?: (value: number) => void
  onChangeStart?: (value: number) => void
  onChangeComplete?: (value: number) => void
}

export const DatRange = (props: Props) => (
  <DatItemRange>
    <DatLabelText>{props.label}</DatLabelText>

    <RangeInput
      type="range"
      min={props.min}
      max={props.max}
      value={props.value}
      onChange={event => props.onChange && props.onChange(Number(event.target.value))}
      step={props.step}
      onMouseDown={event => props.onChangeStart && props.onChangeStart(Number((event.target as any).value))}
      onMouseUp={event => props.onChangeComplete && props.onChangeComplete(Number((event.target as any).value))}
    />

    <NumberInput
      type="number"
      inputMode="numeric"
      value={props.value}
      onChange={event => typeof props.onChange === 'function' && props.onChange(Number(event.target.value))}
      disabled={props.disabled}
    />
  </DatItemRange>
)
