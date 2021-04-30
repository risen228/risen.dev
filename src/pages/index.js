import React from 'react'
import { Link, graphql } from 'gatsby'

import { Bio } from '../features/bio'
import { Seo } from '../features/seo'
import { rhythm } from '../utils/typography'
import { fullDate } from '../utils/dates'
import { toPostUrl } from '../utils/post-url'
import { MainTemplate } from '../templates'
import { CriticalHeadContent } from '../features/critical-head-content'

const BlogIndex = ({ data, location }) => {
  const {
    site: {
      siteMetadata: { title: siteTitle },
    },
    allMarkdownRemark: { edges: posts },
  } = data

  return (
    <MainTemplate location={location} title={siteTitle}>
      <CriticalHeadContent />
      <Seo title="Все посты" />
      <Bio />
      {posts.map(({ node }) => {
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
                <Link style={{ boxShadow: 'none' }} to={toPostUrl(slug)}>
                  {title}
                </Link>
              </h3>
              <small>{fullDate(date)}</small>
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
