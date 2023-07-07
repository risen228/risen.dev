const { defaultLangKey } = require('./i18n')

module.exports = {
  siteMetadata: {
    title: 'Risen.dev',
    author: 'risen228',
    description:
      'Just an ordinary web-development blog. Trying to make your code better.',
    siteUrl: 'https://risen.dev',
    social: {
      github: 'risen228',
      telegram: 'risen228',
      vk: 'risen228',
      linkedIn: 'risen228'
    },
  },
  plugins: [
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/content/blog`,
        name: 'blog',
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/content/assets`,
        name: 'assets',
      },
    },
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          {
            resolve: 'gatsby-remark-code-buttons',
            options: {
              svgIcon: `<svg fill="none" viewBox="0 0 24 24" height="24" width="24" xmlns="http://www.w3.org/2000/svg">
              <path xmlns="http://www.w3.org/2000/svg" d="M2 4C2 2.89543 2.89543 2 4 2H14C15.1046 2 16 2.89543 16 4V8H20C21.1046 8 22 8.89543 22 10V20C22 21.1046 21.1046 22 20 22H10C8.89543 22 8 21.1046 8 20V16H4C2.89543 16 2 15.1046 2 14V4ZM10 16V20H20V10H16V14C16 15.1046 15.1046 16 14 16H10ZM14 14V4L4 4V14H14Z" fill="rgba(255, 255, 255, 0.65)"></path>
              </svg>`,
            },
          },
          {
            resolve: 'gatsby-remark-images',
            options: {
              maxWidth: 590,
            },
          },
          {
            resolve: 'gatsby-remark-responsive-iframe',
            options: {
              wrapperStyle: 'margin-bottom: 1.0725rem',
            },
          },
          {
            resolve: `gatsby-remark-autolink-headers`,
            options: {
              enableCustomId: true,
            },
          },
          {
            resolve: 'gatsby-remark-prismjs',
            options: {
              copy: true,
              inlineCodeMarker: '÷',
              languageExtensions: [
                {
                  language: 'tree',
                  extend: 'css',
                  insertBefore: {
                    function: {
                      'tree-line-group': /[┃┗┣ ]+/,
                      'tree-filename': /[\w._-]+/,
                    },
                  },
                },
              ],
            },
          },
          'gatsby-remark-copy-linked-files',
          'gatsby-remark-smartypants',
          {
            resolve: 'gatsby-remark-external-links',
            options: {
              target: '_blank',
            },
          },
          {
            resolve: `gatsby-remark-classes`,
            options: {
              classMap: {
                link: 'link-hover',
              },
            },
          },
        ],
      },
    },
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    'gatsby-plugin-feed',
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: 'Risen.dev',
        short_name: 'Risen.dev',
        start_url: '/',
        background_color: '#ffffff',
        theme_color: '#9730c1',
        display: 'minimal-ui',
        icon: 'content/assets/icon.png',
      },
    },
    'gatsby-plugin-sitemap',
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-plugin-typography',
      options: {
        pathToConfigModule: 'src/utils/typography',
      },
    },
    {
      resolve: 'gatsby-plugin-disqus',
      options: {
        shortname: 'risen-dev',
      },
    },
    {
      resolve: 'gatsby-plugin-i18n',
      options: {
        langKeyDefault: defaultLangKey,
        useLangKeyLayout: false,
        pagesPaths: [`${__dirname}/content/blog`],
      },
    },
    {
      resolve: 'gatsby-plugin-vercel',
    },
  ],
}
