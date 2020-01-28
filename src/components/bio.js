/**
 * Bio component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import avatar from '../assets/avatar.png'
import { rhythm } from '../utils/typography'

export const Bio = () => {
  const data = useStaticQuery(graphql`
    query BioQuery {
      site {
        siteMetadata {
          author
          social {
            github
          }
        }
      }
    }
  `)

  const { author, social } = data.site.siteMetadata

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <img
        src={avatar}
        alt={author}
        style={{
          marginRight: rhythm(0.5),
          marginBottom: 0,
          width: rhythm(2),
          height: rhythm(2),
          borderRadius: '50%',
        }}
      />
      <p style={{ maxWidth: 260, marginBottom: 0 }}>
        Personal website by{' '}
        <a href={`https://github.com/${social.github}`}>{author}</a>. I try to
        make your code cleaner.
      </p>
    </div>
  )
}
