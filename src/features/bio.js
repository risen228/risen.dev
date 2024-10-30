/**
 * Bio component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import avatar from '../assets/avatar.jpg'
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
        <SocialLink
          name="LinkedIn"
          url={`https://www.linkedin.com/in/${social.linkedIn}`}
        />
        <SocialLink name="GitHub" url={`https://github.com/${social.github}`} />
        <SocialLink name="Telegram" url={`https://t.me/${social.telegram}`} />
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
            telegram
            vk
            linkedIn
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
        src="https://avatars.githubusercontent.com/u/35740512?v=4"
        alt="Risen Github Photo"
        style={{
          marginRight: rhythm(0.5),
          marginBottom: 0,
          width: 64,
          height: 64,
          borderRadius: '50%',
        }}
      />
      <Description
        lines={[
          'Just an ordinary web-development blog.',
          'Trying to improve your code.',
        ]}
        social={social}
      />
    </div>
  )
}
