import * as React       from 'react'
import styled           from 'styled-components'
import { DatItem }      from './DatItem'
import { DatLabelText } from './DatLabelText'
import { DatInput }     from './DatInput'

type Props = {
  onChange?: (value: File) => void
  label: React.ReactNode
  disabled?: boolean
}

const DatItemNumber = styled(DatItem)`
  /* border-left-color: #2fa1d6; */
`

const InputWrapper = styled.div`
  width: 60%;
  position: relative;
  overflow: hidden;
  display: inline-block;
  cursor: pointer;
`

const Button = styled(DatInput)`
  display: block;
  color: #fff;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
`

const File = styled.input`
  position: absolute;
  font-size: 100px;
  left: 0;
  top: 0;
  opacity: 0;
  cursor: pointer;
`

export const DatFile = (props: Props) => (
  <DatItemNumber>
    <DatLabelText>{props.label}</DatLabelText>

    <InputWrapper>
      <Button type="button" value="Upload a file" />

      <File
        style={{ width: '60%' }}
        type="file"
        onChange={event => {
          if (typeof props.onChange === 'function') {
            const files: File[] = Array.from(event.target.files || [])

            if (files.length) {
              props.onChange(files[0])
            }
          }
        }}
        disabled={props.disabled}
      />
    </InputWrapper>
  </DatItemNumber>
)
