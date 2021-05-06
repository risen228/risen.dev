export function normalizeSlug(slug) {
  const segments = slug.split('/')
  const normalized = segments[segments.length - 2]
  return `/${normalized}/`
}
