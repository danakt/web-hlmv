import * as React from 'react'
import styled     from 'styled-components'

const DatFolderTitle = styled.div`
  user-select: none;
  display: block;
  cursor: pointer;
  padding: 5px 5px 5px 16px;
  line-height: 22px;
  background: url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlI+hKgFxoCgAOw==)
    #000 6px 48% no-repeat;

  &.closed {
    background: url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlGIWqMCbWAEAOw==)
      #000 6px 48% no-repeat;
  }
`

type Props = {
  title: string
  defaultHidden?: boolean
  children?: React.ReactNode
}

export const DatFolder = (props: Props) => {
  const [isHidden, setHidden] = React.useState(props.defaultHidden == null ? false : props.defaultHidden)

  return (
    <div>
      <DatFolderTitle className={isHidden ? 'closed' : ''} onClick={() => setHidden(!isHidden)}>
        {props.title}
      </DatFolderTitle>

      <div
        style={{
          display:    isHidden ? 'none' : 'block',
          marginLeft: '4px',
          width:      'calc(100% - 4px)'
        }}
      >
        {props.children}
      </div>
    </div>
  )
}
