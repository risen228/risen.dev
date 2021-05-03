const _ = require('lodash')

const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

function getSlug({ slug: path }) {
  const segments = path.split('/')
  const slug = segments[segments.length - 2]
  return `/${slug}/`
}

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  const BlogIndex = path.resolve(`./src/pages/index.js`)
  const BlogPost = path.resolve(`./src/pages/blog-post.js`)

  const result = await graphql(
    `
      {
        allMarkdownRemark(
          sort: { fields: [frontmatter___date], order: DESC }
          limit: 1000
        ) {
          edges {
            node {
              fields {
                slug
                langKey
              }
              frontmatter {
                title
              }
            }
          }
        }
      }
    `
  )

  if (result.errors) {
    throw result.errors
  }

  // Create index pages for other languages

  const otherLanguages = ['ru']

  _.each(otherLanguages, langKey => {
    createPage({
      path: '/' + langKey,
      component: BlogIndex,
      context: {
        langKey,
      },
    })
  })

  // Create blog posts pages.
  const allPosts = result.data.allMarkdownRemark.edges

  const prevBySlug = {}
  const nextBySlug = {}

  const defaultLangPosts = allPosts.filter(
    ({ node }) => node.fields.langKey === 'en'
  )

  const otherLangPosts = allPosts.filter(
    ({ node }) => node.fields.langKey !== 'en'
  )

  const translationsBySlug = otherLangPosts.reduce((acc, post) => {
    const { langKey } = post.node.fields
    const slug = getSlug(post.node.fields)
    const current = acc[slug] || []
    acc[slug] = current.concat(langKey)
    return acc
  }, {})

  _.each(defaultLangPosts, (post, index, posts) => {
    const previous = index === posts.length - 1 ? null : posts[index + 1].node
    const next = index === 0 ? null : posts[index - 1].node

    const { langKey } = post.node.fields
    const slug = getSlug(post.node.fields)

    prevBySlug[slug] = previous
    nextBySlug[slug] = next

    createPage({
      path: '/posts' + slug,
      component: BlogPost,
      context: {
        slug,
        previous,
        next,
        langKey,
        translations: translationsBySlug[slug],
      },
    })
  })

  _.each(otherLangPosts, post => {
    const { langKey } = post.node.fields
    const slug = getSlug(post.node.fields)

    createPage({
      path: '/' + langKey + '/posts' + slug,
      component: BlogPost,
      context: {
        slug: '/' + langKey + slug,
        previous: prevBySlug[slug],
        next: nextBySlug[slug],
        langKey,
        translations: translationsBySlug[slug],
      },
    })
  })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (
    node.internal.type === `MarkdownRemark` &&
    node.internal.fieldOwners.slug !== 'gatsby-plugin-i18n'
  ) {
    const value = createFilePath({ node, getNode })

    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}
