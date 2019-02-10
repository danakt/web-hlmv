import * as React from 'react'

type Data = {
  buffer: null | ArrayBuffer
  isLoading: boolean
}

type Actions = {
  setFile: (file: File) => void
}

type Props = {
  defaultFileUrl?: string
  children: (data: Data, actions: Actions) => React.ReactNode
}

/**
 * Manages the model buffer
 */
export const FileContainer = (props: Props) => {
  const [isLoading, setLoadingState] = React.useState(typeof props.defaultFileUrl === 'string')
  const [buffer, setBuffer] = React.useState<null | ArrayBuffer>(null)

  /** Loads default model file and saves it to state */
  const loadingDemo = async (modelFile: string) => {
    setLoadingState(true)
    const resp = await fetch(modelFile)
    const buffer = await resp.arrayBuffer()
    setBuffer(buffer)
    setLoadingState(false)
  }

  /** Loads file to buffer */
  const loadFile = (file: File) => {
    const fileReader = new FileReader()

    fileReader.addEventListener('load', () => {
      setBuffer(fileReader.result as ArrayBuffer)
      setLoadingState(false)
    })

    fileReader.readAsArrayBuffer(file)
    setLoadingState(true)
  }

  React.useEffect(
    () => {
      if (typeof props.defaultFileUrl === 'string') {
        loadingDemo(props.defaultFileUrl)
      }
    },
    [props.defaultFileUrl]
  )

  return (
    <React.Fragment>
      {props.children(
        { buffer, isLoading },
        {
          setFile: loadFile
        }
      )}
    </React.Fragment>
  )
}
