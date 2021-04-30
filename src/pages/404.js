import React from 'react'
import { graphql } from 'gatsby'

import { Seo } from '../features/seo'
import { MainTemplate } from '../templates'
import { CriticalHeadContent } from '../features/critical-head-content'

const NotFoundPage = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata.title

  return (
    <MainTemplate location={location} title={siteTitle}>
      <CriticalHeadContent />
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
