const React = require('react')

exports.onRenderBody = ({ setHeadComponents }) => {
  const themeScript = (
    <script
      key="theme-script"
      type="text/javascript"
      dangerouslySetInnerHTML={{
        __html: `
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
      
        function getCurrentTheme(themeChoice, systemTheme) {
          if (themeChoice === 'system') {
            return systemTheme
          }
      
          return themeChoice
        }
      
        var themeChoice = getSavedThemeChoice()
        var systemTheme = getSystemColorScheme()
        var theme = getCurrentTheme(themeChoice, systemTheme)
      
        var colors = {
          light: '#fff',
          dark: '#000',
        }
      
        document.documentElement.classList.add(theme + '-theme')
        document.documentElement.style.backgroundColor = colors[theme]
      `,
      }}
    />
  )

  setHeadComponents([themeScript])
}

function reorder(headComponents) {
  return [...headComponents].sort((componentA, componentB) => {
    if (componentA.key === 'theme-script') {
      return -1
    }

    if (componentB.key === 'theme-script') {
      return 1
    }

    return 0
  })
}

exports.onPreRenderHTML = ({ getHeadComponents, replaceHeadComponents }) => {
  const headComponents = getHeadComponents()
  const orderedComponents = reorder(headComponents)
  replaceHeadComponents(orderedComponents)
}
