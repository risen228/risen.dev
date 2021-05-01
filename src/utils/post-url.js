function normalizeSlug(slug) {
  const segments = slug.split('/')
  const normalized = segments[segments.length - 2]
  return `/${normalized}/`
}

export function toPostUrl(slug, langKey) {
  const normalized = normalizeSlug(slug)
  if (langKey === 'en') return '/posts' + normalized
  return '/' + langKey + '/posts' + normalized
}
