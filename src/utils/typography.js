import Typography from 'typography'
import Wordpress2016 from 'typography-theme-wordpress-2016'
import './global.css'
import './prismjs.css'

Wordpress2016.overrideThemeStyles = () => ({
  'body': {
    color: 'var(--c-text-primary)',
  },
  'a': {
    color: 'var(--text-link-color)',
  },
  'a.gatsby-resp-image-link': {
    boxShadow: 'none',
  },
  'h4': {
    textTransform: 'none',
    letterSpacing: 0,
  },
  'blockquote': {
    fontSize: '1rem',
    color: 'var(--quote-color)',
    borderLeftColor: 'var(--quote-border)',
  },
})

delete Wordpress2016.googleFonts

const typography = new Typography(Wordpress2016)

// Hot reload typography in development.
if (process.env.NODE_ENV !== 'production') {
  typography.injectStyles()
}

export const rhythm = typography.rhythm
export const scale = typography.scale

export default typography
