import React from 'react'
import { Link, graphql } from 'gatsby'

import { Bio } from '../components/bio'
import { Layout } from '../components/layout'
import { Seo } from '../components/seo'
import { rhythm } from '../utils/typography'
import { fullDate } from '../utils/date'

const BlogIndex = ({ data, location }) => {
  const {
    site: {
      siteMetadata: { title: siteTitle },
    },
    allMarkdownRemark: { edges: posts },
  } = data

  return (
    <Layout location={location} title={siteTitle}>
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
                  marginBottom: rhythm(1 / 4),
                }}
              >
                <Link style={{ boxShadow: `none` }} to={slug}>
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
    </Layout>
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
