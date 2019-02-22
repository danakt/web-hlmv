import * as React from 'react'

type Data = {
  buffer: null | ArrayBuffer
  isLoading: boolean
}

type Actions = {
  setFile: (file: File) => void
  setFileUrl: (fileUrl: string) => void
}

type Props = {
  defaultFileUrl?: string
  children: (data: Data, actions: Actions) => React.ReactNode
}

/**
 * Manages the model buffer
 */
export const FileContainer = (props: Props) => {
  const [fileUrl, setFileUrl] = React.useState<string | undefined>(props.defaultFileUrl)
  const [isLoading, setLoadingState] = React.useState(typeof fileUrl === 'string')
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

  React.useEffect(() => {
    if (typeof fileUrl === 'string') {
      loadingDemo(fileUrl)
    }
  }, [fileUrl])

  return (
    <React.Fragment>
      {props.children(
        { buffer, isLoading },
        {
          setFile: loadFile,
          setFileUrl
        }
      )}
    </React.Fragment>
  )
}
