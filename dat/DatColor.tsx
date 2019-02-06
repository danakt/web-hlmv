import * as React       from 'react'
import styled           from 'styled-components'
import { DatItem }      from './DatItem'
import { DatLabelText } from './DatLabelText'
import { ChromePicker } from 'react-color'

const Color = styled.div`
  width: 60%;
  text-align: center;
  font-weight: 700;
  color: #fff;
  text-shadow: rgba(0, 0, 0, 0.7) 0 1px 1px;
  vertical-align: middle;
  border: 3px solid #1a1a1a;
  cursor: pointer;
`

const Overlay = styled.div`
  position: fixed;
  z-index: 99;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
`

const Picker = styled.div`
  z-index: 100;
  position: absolute;
  right: 10px;
  top: 35px;
`

type Props = {
  label: React.ReactNode
  value: string
  onChange: (color: string) => void
}

export const DatColor = (props: Props) => {
  const [isPickerShown, showPicker] = React.useState(false)

  return (
    <div style={{ position: 'relative' }}>
      <DatItem>
        <DatLabelText>{props.label}</DatLabelText>

        <Color style={{ backgroundColor: props.value }} onClick={() => showPicker(true)}>
          {props.value}
        </Color>
      </DatItem>

      {isPickerShown && (
        <React.Fragment>
          <Overlay onClick={() => showPicker(false)} />

          <Picker>
            <ChromePicker disableAlpha color={props.value} onChange={result => props.onChange(result.hex)} />
          </Picker>
        </React.Fragment>
      )}
    </div>
  )
}
