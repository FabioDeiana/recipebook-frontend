import { useCallback, useEffect, useState } from 'react'

// Runs an API call when deps change; ignores responses that arrive after a newer call
export function useApi(fetcher, deps) {
  const [state, setState] = useState({ data: null, error: null, loading: true })
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let ignore = false
    setState((prev) => ({ ...prev, error: null, loading: true }))
    fetcher()
      .then((data) => {
        if (!ignore) setState({ data, error: null, loading: false })
      })
      .catch((error) => {
        if (!ignore) setState({ data: null, error, loading: false })
      })
    return () => {
      ignore = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, reloadKey])

  const reload = useCallback(() => setReloadKey((key) => key + 1), [])
  const setData = useCallback((data) => setState((prev) => ({ ...prev, data })), [])

  return { ...state, reload, setData }
}
