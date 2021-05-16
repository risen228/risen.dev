import React, { useEffect, useLayoutEffect, useState } from 'react'
import clsx from 'clsx'
import { useThemeStore } from '../stores/theme'
import {
  getCurrentTheme,
  getSavedThemeChoice,
  getSystemColorScheme,
} from '../utils/theme'

function useSystemTheme() {
  const [systemTheme, setSystemTheme] = useState(() => {
    return getSystemColorScheme()
  })

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')

    const listener = event => {
      const newColorTheme = event.matches ? 'dark' : 'light'
      setSystemTheme(newColorTheme)
    }

    const addEventListener =
      media.addEventListener || media.addListener || function() {}
    const removeEventListener =
      media.removeEventListener || media.removeListener || function() {}
    addEventListener('change', listener)
    return () => removeEventListener('change', listener)
  }, [])

  return systemTheme
}

function useThemeChoice() {
  const [themeChoice, setThemeChoice] = useState(() => {
    return getSavedThemeChoice()
  })

  useEffect(() => {
    localStorage.setItem('ui/theme', themeChoice)
  }, [themeChoice])

  return [themeChoice, setThemeChoice]
}

export const ThemeSwitcher = () => {
  if (typeof window === 'undefined') return null
  return <ThemeSwitcherInner />
}

const ThemeSwitcherInner = () => {
  const systemTheme = useSystemTheme()
  const [themeChoice, setThemeChoice] = useThemeChoice()
  const [finalTheme, setFinalTheme] = useThemeStore()

  useLayoutEffect(() => {
    document.documentElement.style.backgroundColor = ''
  }, [])

  useEffect(() => {
    const finalTheme = getCurrentTheme(themeChoice, systemTheme)
    setFinalTheme(finalTheme)
  }, [themeChoice, systemTheme, setFinalTheme])

  useEffect(() => {
    const { classList } = document.documentElement

    const possibleClasses = ['light-theme', 'dark-theme']
    possibleClasses.forEach(className => classList.remove(className))

    classList.add(`${finalTheme}-theme`)
  }, [finalTheme])

  const classesByTheme = theme => {
    return clsx({
      choice: true,
      active: theme === themeChoice,
    })
  }

  return (
    <div className="theme-switcher">
      <div
        className={classesByTheme('light')}
        onClick={() => setThemeChoice('light')}
      >
        <span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="feather feather-sun"
          >
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
          Light
        </span>
      </div>
      <div
        className={classesByTheme('system')}
        onClick={() => setThemeChoice('system')}
      >
        <span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
            height="24"
            width="24"
          >
            <path
              xmlns="http://www.w3.org/2000/svg"
              d="M2 5C2 3.89543 2.89543 3 4 3H20C21.1046 3 22 3.89543 22 5V16C22 17.1046 21.1046 18 20 18H13V20H16C16.5523 20 17 20.4477 17 21C17 21.5523 16.5523 22 16 22H8C7.44772 22 7 21.5523 7 21C7 20.4477 7.44772 20 8 20H11V18H4C2.89543 18 2 17.1046 2 16V5ZM20 16V5H4V16H20Z"
            />
          </svg>
          System
        </span>
      </div>
      <div
        className={classesByTheme('dark')}
        onClick={() => setThemeChoice('dark')}
      >
        <span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="feather feather-moon"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
          Dark
        </span>
      </div>
      <span className="slider" />
    </div>
  )
}
