import * as React from 'react'

// eslint-disable-next-line no-unused-vars
export type TypesCompare = {
  json: any
  buffer: ArrayBuffer
  text: string
}

type Data<T extends keyof TypesCompare> = {
  data: TypesCompare[T] | null
  isPending: boolean
}

type Actions = {
  //
}

type Props<T extends keyof TypesCompare> = {
  url: string
  type: T
  autoFetch?: boolean
  children: (data: Data<T>, actions: Actions) => React.ReactNode
}

export const Fetch = function<T extends keyof TypesCompare> (props: Props<T>) {
  const [isPending, setPending] = React.useState(false)
  const [data, setData] = React.useState<null | TypesCompare[T]>(null)

  const fetchData = async () => {
    setPending(true)

    const resp = await fetch(props.url)

    if (props.type === 'buffer') {
      const buffer = await resp.arrayBuffer()
      setData(buffer)
    } else if (props.type === 'json') {
      const json = await resp.json()
      setData(json)
    } else if (props.type === 'text') {
      const text = await resp.text()
      setData(text)
    }

    setPending(false)
  }

  React.useEffect(() => {
    if (props.autoFetch) {
      fetchData()
    }
  }, [])

  return (
    <React.Fragment>
      {props.children(
        {
          isPending,
          data
        },
        {
          fetch: fetchData
        }
      )}
    </React.Fragment>
  )
}
