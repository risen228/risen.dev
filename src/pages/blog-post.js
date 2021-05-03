import React, { useEffect, useRef } from 'react'
import { Link, graphql } from 'gatsby'
import { rhythm, scale } from '../utils/typography'
import { fullDate } from '../utils/dates'
import { toPostUrl } from '../utils/post-url'
import { PostTemplate } from '../templates'
import { normalizeSlug } from '../utils/slug'
import { useThemeStore } from '../stores/theme'
import { Seo } from '../features/seo'
import { Bio } from '../features/bio'

const Header = ({ postTitle, date, langKey }) => {
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
        {fullDate(date, langKey)}
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
            <Link
              className="link-hover __right"
              to={toPostUrl(previous.fields.slug, previous.fields.langKey)}
              rel="prev"
            >
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
            <Link
              className="link-hover __left"
              to={toPostUrl(next.fields.slug, next.fields.langKey)}
              rel="next"
            >
              {next.frontmatter.title} →
            </Link>
          </li>
        )}
      </ul>
    </nav>
  )
}

const Comments = ({ slug }) => {
  const [theme] = useThemeStore()

  const commentBox = useRef()

  useEffect(() => {
    if (!commentBox.current) return

    const container = commentBox.current
    container.innerHTML = ''

    const script = document.createElement('script')
    script.async = true
    script.src = 'https://utteranc.es/client.js'
    script.setAttribute('repo', 'risenforces/risen.dev-comments')
    script.setAttribute('issue-term', slug)
    script.setAttribute('id', 'utterances')
    script.setAttribute('theme', `github-${theme}`)
    script.setAttribute('crossorigin', 'anonymous')

    container.appendChild(script)
  }, [slug, theme])

  return <div ref={commentBox} />
}

const Footer = ({ siteTitle, next, previous, slug, langKey }) => {
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
              color: 'var(--text-link-color)',
            }}
            to="/"
          >
            {siteTitle}
          </Link>
        </h3>

        <Bio />
      </div>

      <Comments slug={slug} langKey={langKey} />
    </footer>
  )
}

const TranslationsBlock = ({ children }) => (
  <div
    style={{
      fontSize: 14,
      padding: '1rem',
      borderRadius: 10,
      color: 'var(--translations-color)',
      backgroundColor: 'var(--translations-bg)',
      marginBottom: '2rem',
    }}
  >
    {children}
  </div>
)

const languageLabels = {
  en: 'English',
  ru: 'Русский',
}

const Translations = ({ slug, langKey, translations }) => {
  if (langKey !== 'en') {
    return (
      <TranslationsBlock>
        <a
          href={`/posts${slug}`}
          style={{ color: 'var(--translations-link-color)' }}
        >
          Read in original (English)
        </a>
      </TranslationsBlock>
    )
  }

  const links = translations.map((lang, index) => {
    return (
      <React.Fragment key={lang}>
        <a
          href={`/${lang}/posts${slug}`}
          style={{ color: 'var(--translations-link-color)' }}
        >
          {languageLabels[lang]}
        </a>
        {index < translations.length - 1 ? ', ' : ''}
      </React.Fragment>
    )
  })

  return <TranslationsBlock>Translated in: {links}</TranslationsBlock>
}

const BlogPost = ({ data, pageContext }) => {
  const {
    site: {
      siteMetadata: { title: siteTitle },
    },
    markdownRemark: {
      excerpt,
      html: postHtml,
      fields: { slug, langKey },
      frontmatter: { title: postTitle, date, description },
    },
  } = data

  const normalizedSlug = normalizeSlug(slug)
  const { previous, next, translations } = pageContext

  return (
    <PostTemplate title={siteTitle}>
      <Seo title={postTitle} description={description || excerpt} />
      <article>
        <Header postTitle={postTitle} date={date} langKey={langKey} />
        <Translations
          slug={normalizedSlug}
          langKey={langKey}
          translations={translations}
        />
        <PostText postHtml={postHtml} />
        <Footer
          siteTitle={siteTitle}
          next={next}
          previous={previous}
          slug={normalizedSlug}
          langKey={langKey}
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
      fields {
        slug
        langKey
      }
      frontmatter {
        title
        date
        description
      }
    }
  }
`

export default BlogPost
