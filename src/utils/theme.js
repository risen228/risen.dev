export function getSystemColorScheme() {
  if (!window.matchMedia) return 'light'
  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  return isDark ? 'dark' : 'light'
}

export function getSavedThemeChoice() {
  const record = localStorage.getItem('ui/theme')
  if (!record) return 'system'
  return record.replace(/"/g, '')
}

export function getCurrentTheme(themeChoice, systemTheme) {
  if (themeChoice === 'system') {
    return systemTheme
  }

  return themeChoice
}
