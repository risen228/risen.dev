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

const SocialLink = ({ name, url }) => (
  <a
    className="social-link link-hover"
    href={url}
    target="_blank"
    rel="nofollow noopener noreferrer"
  >
    {name}
  </a>
)

const Description = ({ lines, social }) => {
  return (
    <div>
      {lines.map(text => {
        return (
          <p key={text} className="description-line">
            {text}
          </p>
        )
      })}
      <div>
        <SocialLink name="GitHub" url={`https://github.com/${social.github}`} />
        <SocialLink name="VK" url={`https://vk.com/${social.vk}`} />
      </div>
    </div>
  )
}

export const Bio = () => {
  const data = useStaticQuery(graphql`
    query BioQuery {
      site {
        siteMetadata {
          author
          social {
            github
            vk
          }
        }
      }
    }
  `)

  const {
    site: {
      siteMetadata: { author, social },
    },
  } = data

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        marginTop: rhythm(1),
        marginBottom: rhythm(1),
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
      <Description
        lines={[
          'Очередной блог о веб-разработке.',
          'Стараюсь сделать ваш код лучше.',
        ]}
        social={social}
      />
    </div>
  )
}
