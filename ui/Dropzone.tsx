import * as React                                from 'react'
import styled                                    from 'styled-components'
import { DropzoneInputProps, DropzoneRootProps } from 'react-dropzone'

const Wrapper = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  cursor: pointer;
`

const Input = styled.input`
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
`

const BorderedBox = styled.div`
  position: absolute;
  left: 25px;
  top: 25px;
  width: calc(100% - 50px);
  height: calc(100% - 50px);
  z-index: 1;
`

const Description = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`

type Props = {
  wrapperProps: DropzoneRootProps
  inputProps: DropzoneInputProps
  isDragActive: boolean
}

export const Dropzone = (props: Props) => (
  <Wrapper {...props.wrapperProps}>
    <Input {...props.inputProps} />

    <BorderedBox>
      <Description>
        {props.isDragActive
          ? 'Drop model here...'
          : 'Try dropping some model here, or click to select model to upload.'}
      </Description>
    </BorderedBox>
  </Wrapper>
)
