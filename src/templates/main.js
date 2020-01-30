import React from 'react'
import { Link } from 'gatsby'

import { rhythm, scale } from '../utils/typography'
import { Footer } from '../components/footer'

export const Main = ({ title, children }) => {
  return (
    <div
      style={{
        marginLeft: 'auto',
        marginRight: 'auto',
        maxWidth: rhythm(24),
        padding: `${rhythm(1.5)} ${rhythm(0.75)}`,
      }}
    >
      <header style={{ marginBottom: rhythm(1.5) }}>
        <h1
          style={{
            ...scale(0.75),
            marginTop: 0,
          }}
        >
          <Link
            style={{
              boxShadow: 'none',
              textDecoration: 'none',
              color: 'inherit',
            }}
            to="/"
          >
            {title}
          </Link>
        </h1>
      </header>
      <main>{children}</main>
      <Footer />
    </div>
  )
}
