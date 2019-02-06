import * as React from 'react'

const INITIAL_BACKGROUND_COLOR = '#4d7f7e'
const LOCAL_STORAGE_KEY = '__hlmv_background_color'

type Data = {
  backgroundColor: string
}

type Actions = {
  setBackgroundColor: (color: string) => void
}

type Props = {
  children: (data: Data, actions: Actions) => React.ReactNode
}

export const BackgroundContainer = (props: Props) => {
  const [color, setColor] = React.useState(() => localStorage.getItem(LOCAL_STORAGE_KEY) || INITIAL_BACKGROUND_COLOR)

  React.useEffect(
    () => {
      localStorage.setItem(LOCAL_STORAGE_KEY, color)
    },
    [color]
  )

  return <React.Fragment>{props.children({ backgroundColor: color }, { setBackgroundColor: setColor })}</React.Fragment>
}
