import { useEffect } from 'react'
import { isServer } from '../is-server'

export function useFontsLoader(loader) {
  useEffect(() => {
    if (isServer()) return
    loader()
  }, [loader])
}
