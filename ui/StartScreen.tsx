import * as React from 'react'

type Props = {
  demoFileUrl: string
  selectFile?: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void
  setFileUrl: (url: string) => void
}

export const StartScreen = (props: Props) => (
  <React.Fragment>
    Try to drop some model here, or{' '}
    <a
      href="#"
      onClick={event => {
        if (props.selectFile) {
          props.selectFile(event)
        }

        event.preventDefault()
      }}
    >
      click here
    </a>{' '}
    to select a model to upload.
    <br /> Also, you can{' '}
    <a
      href="#"
      onClick={event => {
        props.setFileUrl(props.demoFileUrl)
        event.preventDefault()
      }}
    >
      start demo file viewing
    </a>
    .
  </React.Fragment>
)
