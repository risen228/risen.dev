import { useForceUpdate, useIsomorphicLayoutEffect } from './common'

let theme = null

let subscribers = []

function subscribe(subscriber) {
  subscribers.push(subscriber)
  return () => {
    subscribers = subscribers.filter(item => item !== subscriber)
  }
}

function setTheme(nextTheme) {
  theme = nextTheme
  subscribers.forEach(callback => callback(nextTheme))
}

export function useThemeStore() {
  const forceUpdate = useForceUpdate()

  useIsomorphicLayoutEffect(() => {
    const unsubscribe = subscribe(forceUpdate)
    return unsubscribe
  }, [forceUpdate])

  return [theme, setTheme]
}
