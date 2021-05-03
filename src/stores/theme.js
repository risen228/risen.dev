import { isClient } from '../utils/ssr'
import {
  getCurrentTheme,
  getSavedThemeChoice,
  getSystemColorScheme,
} from '../utils/theme'
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
  if (nextTheme === theme) return
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

///////////////////////
// Get initial value //
///////////////////////

if (isClient()) {
  const themeChoice = getSavedThemeChoice()
  const systemTheme = getSystemColorScheme()
  const currentTheme = getCurrentTheme(themeChoice, systemTheme)
  setTheme(currentTheme)
}
