import * as React from 'react'
import styled     from 'styled-components'

const Wrapper = styled.div`
  position: absolute;
  left: 15px;
  top: 15px;
`

/**
 * Github button to get started :)
 */
export const GithubButton = () => (
  <Wrapper>
    <a
      className="github-button"
      href="https://github.com/danakt/web-hlmv"
      data-show-count="true"
      aria-label="Star danakt/web-hlmv on GitHub"
    >
      Star
    </a>
  </Wrapper>
)
