import React from 'react'
import { rhythm } from '../utils/typography'

const GatsbyLink = () => (
  <a className="link-hover" href="https://www.gatsbyjs.org">
    Gatsby
  </a>
)

export const Footer = () => {
  const year = new Date().getFullYear()

  return (
    <footer style={{ marginTop: rhythm(3) }}>
      © {year}, Создано с помощью <GatsbyLink />
    </footer>
  )
}
