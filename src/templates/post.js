import React from 'react'
import { Link } from 'gatsby'

import { Analytics } from '@vercel/analytics/dist/react'
import { rhythm } from '../utils/typography'
import { Footer } from '../features/footer'
import { Header } from '../features/header'
// import { SubscribeForm } from '../features/subscribe-form'

export const Post = ({ title, children }) => {
  return (
    <div
      style={{
        marginLeft: 'auto',
        marginRight: 'auto',
        maxWidth: rhythm(24),
        padding: `${rhythm(1.5)} ${rhythm(0.75)}`,
      }}
    >
      <Header
        title={
          <h3
            style={{
              fontFamily: 'Montserrat, sans-serif',
              marginTop: 0,
              marginBottom: 0,
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
          </h3>
        }
      />

      <main>{children}</main>

      {/* <SubscribeForm /> */}

      <Footer />

      <Analytics />
    </div>
  )
}
