const React = require('react')
const {
  getSystemColorScheme,
  getSavedThemeChoice,
  getCurrentTheme,
} = require('./src/utils/theme')

exports.onRenderBody = ({ setHeadComponents }) => {
  const themeScript = (
    <script
      key="theme-script"
      type="text/javascript"
      dangerouslySetInnerHTML={{
        __html: `
        ${getSystemColorScheme}
        ${getSavedThemeChoice}
        ${getCurrentTheme}
      
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
