export function toPostUrl(slug) {
  return '/posts' + slug.replace(/\/$/, '')
}
