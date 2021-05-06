import { defaultLangKey } from '../../i18n'
import { normalizeSlug } from './slug'

export function toPostUrl(slug, langKey) {
  const normalized = normalizeSlug(slug)
  if (langKey === defaultLangKey) return '/posts' + normalized
  return '/' + langKey + '/posts' + normalized
}
