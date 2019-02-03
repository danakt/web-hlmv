import * as React from 'react'
import styled     from 'styled-components'

const Wrapper = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`

export const LoadingScreen = () => <Wrapper>Loading...</Wrapper>
