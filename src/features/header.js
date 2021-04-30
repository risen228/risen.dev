import React from 'react'
import { ThemeSwitcher } from './theme-switcher'

export const Header = ({ title }) => {
  return (
    <header className="app-header">
      {title}
      <ThemeSwitcher />
    </header>
  )
}
