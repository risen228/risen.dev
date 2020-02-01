module.exports = {
  siteMetadata: {
    title: 'Risen.dev',
    author: 'risenforces',
    description:
      'Очередной блог о веб-разработке. Стараюсь сделать ваш код лучше.',
    siteUrl: 'https://risen.dev',
    social: {
      github: 'risenforces',
      vk: 'risenforces',
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
        ],
      },
    },
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    {
      resolve: 'gatsby-plugin-google-analytics',
      options: {
        trackingId: 'UA-157084858-1',
      },
    },
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
  ],
}
