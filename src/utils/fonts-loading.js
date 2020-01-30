import WebFontLoader from 'webfontloader'
import { useEffect } from 'react'
import { isServer } from './is-server'

const fontConfigs = {
  shared: {
    google: {
      families: [
        'Merriweather:400:latin,cyrillic',
        'Montserrat:700,900:latin,cyrillic',
      ],
    },
  },
  blogPost: {
    google: {
      families: [
        'Merriweather:400i,700,700i,900,900i:latin,cyrillic',
        'Fira Mono:400:latin,cyrillic',
      ],
    },
  },
}

function createLoader(fontConfig) {
  return function fontsLoader() {
    if (isServer()) return
    WebFontLoader.load(fontConfig)
  }
}

export const loadSharedFonts = createLoader(fontConfigs.shared)
export const loadBlogPostFonts = createLoader(fontConfigs.blogPost)

export function useFontsLoader(fontsLoader) {
  useEffect(() => {
    fontsLoader()
  }, [fontsLoader])
}
