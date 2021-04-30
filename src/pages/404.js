import React from 'react'
import { graphql } from 'gatsby'

import { Seo } from '../features/seo'
import { MainTemplate } from '../templates'

const NotFoundPage = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata.title

  return (
    <MainTemplate location={location} title={siteTitle}>
      <Seo title="404" />
      <h1>Not Found</h1>
      <p>По данному адресу ничего не было найдено..</p>
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
  }
`

export default NotFoundPage
