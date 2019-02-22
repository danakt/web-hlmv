import * as React             from 'react'
import styled                 from 'styled-components'
import { DropzoneInputProps } from 'react-dropzone'

const Wrapper = styled.div<{ color: string; isDragActive: boolean }>`
  position: relative;
  width: 100vw;
  height: 100vh;
  background-color: ${props => props.color};
  z-index: ${props => (props.isDragActive ? 5 : 'auto')};
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
  isDragActive: boolean
  backgroundColor: string
  inputProps: DropzoneInputProps
  onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
  onFileLoad: (file: File) => void
  children: React.ReactNode
}

/**
 * Dropzone
 */
export const Dropzone = (props: Props) => {
  const transparentColor = React.useMemo(() => {
    const r = parseInt(props.backgroundColor.substring(1, 3), 16)
    const g = parseInt(props.backgroundColor.substring(3, 5), 16)
    const b = parseInt(props.backgroundColor.substring(5, 7), 16)

    // Setting half-opacity
    return `rgba(${r}, ${g}, ${b}, ${0.7})`
  }, [props.backgroundColor])

  return (
    <Wrapper color={transparentColor} isDragActive={props.isDragActive} onClick={props.onClick}>
      {!props.isDragActive && <Input {...props.inputProps} />}

      <BorderedBox>
        <Description>{props.children}</Description>
      </BorderedBox>
    </Wrapper>
  )
}
