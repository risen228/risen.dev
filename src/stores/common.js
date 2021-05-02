import { useCallback, useEffect, useLayoutEffect, useState } from 'react'

export function useForceUpdate() {
  const [, setCount] = useState(0)
  const forceUpdate = useCallback(() => {
    setCount(current => current + 1)
  }, [])
  return forceUpdate
}

export const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' &&
  typeof window.document !== 'undefined' &&
  typeof window.document.createElement !== 'undefined'
    ? useLayoutEffect
    : useEffect
