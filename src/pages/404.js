import React from 'react'
import { graphql } from 'gatsby'

import { Seo } from '../features/seo'
import { MainTemplate } from '../templates'
import { defaultLangKey } from '../../i18n'

const TgLink = () => (
  <a href="https://t.me/risenforces" target="_blank">
    Telegram
  </a>
)

const NotFoundPage = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata.title

  return (
    <MainTemplate location={location} title={siteTitle}>
      <Seo lang={defaultLangKey} title="404" />
      <h1>Not Found</h1>
      <p>Sorry, but there is nothing here.</p>
      <p>
        Contact me on <TgLink /> if you think it's an error.
      </p>
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
