import React from 'react'
import { Link } from 'gatsby'

import { rhythm } from '../utils/typography'
import { Footer } from '../components/footer'

export const Post = ({ title, children }) => {
  return (
    <div
      style={{
        marginLeft: `auto`,
        marginRight: `auto`,
        maxWidth: rhythm(24),
        padding: `${rhythm(1.5)} ${rhythm(0.75)}`,
      }}
    >
      <header style={{ marginBottom: rhythm(1) }}>
        <h3
          style={{
            fontFamily: `Montserrat, sans-serif`,
            marginTop: 0,
            marginBottom: 0,
          }}
        >
          <Link
            style={{
              boxShadow: `none`,
              textDecoration: `none`,
              color: `inherit`,
            }}
            to="/"
          >
            {title}
          </Link>
        </h3>
      </header>
      <main>{children}</main>
      <Footer />
    </div>
  )
}
