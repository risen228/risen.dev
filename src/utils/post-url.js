import { normalizeSlug } from './slug'

export function toPostUrl(slug, langKey) {
  const normalized = normalizeSlug(slug)
  if (langKey === 'en') return '/posts' + normalized
  return '/' + langKey + '/posts' + normalized
}
