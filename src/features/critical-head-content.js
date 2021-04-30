import React from 'react'
import { Helmet } from 'react-helmet'

export const CriticalHeadContent = () => {
  return (
    <Helmet>
      <script type="text/javascript">{`
      function getSystemColorScheme() {
        if (!window.matchMedia) return 'light'
        var isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        return isDark ? 'dark' : 'light'
      }

      function getSavedThemeChoice() {
        var record = localStorage.getItem('ui/theme')
        if (!record) return 'system'
        return record.replace(/"/g, '')
      }

      function getCurrentTheme(themeChoice) {
        if (themeChoice === 'system') {
          return getSystemColorScheme()
        }

        return themeChoice
      }

      var themeChoice = getSavedThemeChoice()
      var theme = getCurrentTheme(themeChoice)

      var colors = {
        light: '#ffffff',
        dark: '#0f0f0f',
      }

      document.documentElement.classList.add('light-theme')
      document.documentElement.style.backgroundColor = colors[theme]
    `}</script>
    </Helmet>
  )
}
