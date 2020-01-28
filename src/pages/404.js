import React from 'react'
import { graphql } from 'gatsby'

import { Layout } from '../components/layout'
import { Seo } from '../components/seo'

const NotFoundPage = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata.title

  return (
    <Layout location={location} title={siteTitle}>
      <Seo title="404" />
      <h1>Not Found</h1>
      <p>По данному адресу ничего не было найдено..</p>
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
  }
`

export default NotFoundPage
