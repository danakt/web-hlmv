import { createGlobalStyle } from 'styled-components'

/** Reset.css */
export const resetCss = `
  html, body, div, span, applet, object, iframe,
  h1, h2, h3, h4, h5, h6, p, blockquote, pre,
  a, abbr, acronym, address, big, cite, code,
  del, dfn, em, img, ins, kbd, q, s, samp,
  small, strike, strong, sub, sup, tt, var,
  b, u, i, center,
  dl, dt, dd, ol, ul, li,
  fieldset, form, label, legend,
  table, caption, tbody, tfoot, thead, tr, th, td,
  article, aside, canvas, details, embed, 
  figure, figcaption, footer, header, hgroup, 
  menu, nav, output, ruby, section, summary,
  time, mark, audio, video {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    font: inherit;
    vertical-align: baseline;
  }
  article, aside, details, figcaption, figure, 
  footer, header, hgroup, menu, nav, section {
    display: block;
  }
  body {
    line-height: 1;
  }
  ol, ul {
    list-style: none;
  }
  blockquote, q {
    quotes: none;
  }
  blockquote:before, blockquote:after,
  q:before, q:after {
    content: '';
    content: none;
  }
  table {
    border-collapse: collapse;
    border-spacing: 0;
  }
`

type Props = {
  backgroundColor: string
  color: string
}

/** Component with global styles of the app */
export const GlobalStyles = createGlobalStyle<Props>`
  ${resetCss}

  @import url('https://fonts.googleapis.com/css?family=Inconsolata');

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  html, body {
    height: 100%;
  }

  body {
    padding: 0;
    margin: 0;
    background: ${props => props.backgroundColor};
    font-family: 'Inconsolata', monospace;
    font-size: 14px;
    color: ${props => props.color};
    transition: background-color .3s ease-out;
    overflow: hidden;
  }

  input {
    font-family: 'Inconsolata', monospace;
    font-size: 14px;
  }

  a {
    color: #fff
  }
`
