import * as React           from 'react'
import { WindowSizeSensor } from 'libreact'

type Props = {
  className?: string
  onResize?: (width: number, height: number) => void
}

export const Canvas = (props: Props) => {
  return (
    <WindowSizeSensor
      onChange={size => {
        if (typeof props.onResize === 'function') {
          props.onResize(size.width, size.height)
        }
      }}
    >
      {(state: any) => (
        <canvas
          className={props.className}
          style={{
            width:  state.width + 'px',
            height: state.height + 'px'
          }}
        />
      )}
    </WindowSizeSensor>
  )
}
