import styled from 'styled-components'

export const DatInput = styled.input`
  background: #303030;
  border: 3px solid #1a1a1a;
  border-radius: 0;
  padding: 2px 5px;
  margin: 0;
  outline: none;
  font-size: inherit;
  color: #2fa1d6;

  &:hover {
    background-color: #3c3c3c;
  }

  &:disabled {
    color: #545454;
  }
`
