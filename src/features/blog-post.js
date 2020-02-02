import React from 'react'
import { Link, graphql } from 'gatsby'
import { Disqus } from 'gatsby-plugin-disqus'
import { Bio } from '../components/bio'
import { Seo } from '../components/seo'
import { rhythm, scale } from '../utils/typography'
import { fullDate } from '../utils/dates'
import { postUrl } from '../utils/post-url'
import { PostTemplate } from '../templates'

const Header = ({ postTitle, date }) => {
  return (
    <header>
      <h1
        style={{
          marginTop: rhythm(1),
          marginBottom: 0,
        }}
      >
        {postTitle}
      </h1>
      <p
        style={{
          ...scale(-1 / 5),
          display: 'block',
          marginBottom: rhythm(1),
        }}
      >
        {fullDate(date)}
      </p>
    </header>
  )
}

const PostText = ({ postHtml }) => {
  return (
    <section
      style={{ marginBottom: rhythm(3) }}
      dangerouslySetInnerHTML={{ __html: postHtml }}
    />
  )
}

const Navigation = ({ next, previous }) => {
  if (!next && !previous) return null

  return (
    <nav style={{ marginBottom: rhythm(2) }}>
      <ul
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          listStyle: 'none',
          padding: 0,
          margin: 0,
        }}
      >
        {previous && (
          <li
            style={{
              paddingRight: rhythm(0.5),
              marginBottom: 0,
              textAlign: 'left',
            }}
          >
            <Link to={postUrl(previous.fields.slug)} rel="prev">
              ← {previous.frontmatter.title}
            </Link>
          </li>
        )}
        {next && (
          <li
            style={{
              paddingLeft: rhythm(0.5),
              marginLeft: 'auto',
              marginBottom: 0,
              textAlign: 'right',
            }}
          >
            <Link to={postUrl(next.fields.slug)} rel="next">
              {next.frontmatter.title} →
            </Link>
          </li>
        )}
      </ul>
    </nav>
  )
}

const WrappedDisqus = ({ config }) => {
  if (process.env.GATSBY_DISABLE_DISQUS === 'true') return null

  return <Disqus config={config} />
}

const Footer = ({ siteTitle, next, previous, disqusConfig }) => {
  return (
    <footer style={{ marginTop: rhythm(3), marginBottom: rhythm(3) }}>
      <Navigation next={next} previous={previous} />

      <div style={{ marginBottom: rhythm(3) }}>
        <h3
          style={{
            fontFamily: 'Montserrat, sans-serif',
            marginTop: 0,
            marginBottom: rhythm(1),
          }}
        >
          <Link
            style={{
              boxShadow: 'none',
              textDecoration: 'none',
              color: 'var(--textLink)',
            }}
            to="/"
          >
            {siteTitle}
          </Link>
        </h3>

        <Bio />
      </div>

      <WrappedDisqus config={disqusConfig} />
    </footer>
  )
}

const BlogPost = ({ data, location, pageContext }) => {
  const {
    site: {
      siteMetadata: { title: siteTitle, siteUrl },
    },
    markdownRemark: {
      id,
      excerpt,
      html: postHtml,
      frontmatter: { title: postTitle, date, description },
    },
  } = data

  const { previous, next } = pageContext

  const disqusConfig = {
    url: siteUrl + location.pathname,
    identifier: id,
    title: postTitle,
  }

  return (
    <PostTemplate title={siteTitle}>
      <Seo title={postTitle} description={description || excerpt} />
      <article>
        <Header postTitle={postTitle} date={date} />
        <PostText postHtml={postHtml} />
        <Footer
          siteTitle={siteTitle}
          next={next}
          previous={previous}
          disqusConfig={disqusConfig}
        />
      </article>
    </PostTemplate>
  )
}

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        siteUrl
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date
        description
      }
    }
  }
`

export default BlogPost
