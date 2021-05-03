import React from 'react'
import { Link, graphql } from 'gatsby'

import { Bio } from '../features/bio'
import { Seo } from '../features/seo'
import { rhythm } from '../utils/typography'
import { fullDate } from '../utils/dates'
import { toPostUrl } from '../utils/post-url'
import { MainTemplate } from '../templates'

const BlogIndex = ({ data, location, pageContext }) => {
  const {
    site: {
      siteMetadata: { title: siteTitle },
    },
    allMarkdownRemark: { edges: posts },
  } = data

  const { langKey = 'en' } = pageContext

  return (
    <MainTemplate location={location} title={siteTitle}>
      <Seo title="Все посты" />
      <Bio />
      {posts
        .filter(({ node }) => {
          return node.fields.langKey === langKey
        })
        .map(({ node }) => {
          const {
            excerpt,
            fields: { slug },
            frontmatter: { date, title, description },
          } = node

          return (
            <article key={slug}>
              <header>
                <h3
                  style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontWeight: 700,
                    marginBottom: rhythm(0.25),
                  }}
                >
                  <Link
                    style={{ boxShadow: 'none' }}
                    to={toPostUrl(slug, langKey)}
                  >
                    {title}
                  </Link>
                </h3>
                <small>{fullDate(date, langKey)}</small>
              </header>
              <section>
                <p
                  dangerouslySetInnerHTML={{
                    __html: description || excerpt,
                  }}
                />
              </section>
            </article>
          )
        })}
    </MainTemplate>
  )
}

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          excerpt
          fields {
            slug
            langKey
          }
          frontmatter {
            date
            title
            description
          }
        }
      }
    }
  }
`

export default BlogIndex
