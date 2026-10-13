import type { ReferrerSource } from './session-types'

/**
 * Classify a raw referrer URL or document.referrer into a
 * known source. Runs server-side to keep client SDK tiny.
 */
export function classifyReferrer(
  referrer: string | null,
  ownHost: string | null = null
): ReferrerSource {
  if (!referrer) return 'direct'

  let host: string
  try {
    const url = new URL(referrer)
    host = url.hostname.toLowerCase()
  } catch {
    return 'direct'
  }

  // Same-site navigation
  if (ownHost && host.includes(ownHost.replace(/^https?:\/\//, ''))) {
    return 'internal'
  }

  if (host.includes('google.')) return 'google'
  if (host.includes('bing.')) return 'bing'
  if (host.includes('facebook.') || host.includes('fb.')) return 'facebook'
  if (host.includes('instagram.')) return 'instagram'
  if (host.includes('twitter.') || host.includes('x.com')) return 'twitter'
  if (host.includes('linkedin.')) return 'linkedin'
  if (host.includes('youtube.')) return 'youtube'
  if (host.includes('whatsapp.') || host.includes('wa.me')) return 'whatsapp'

  return 'other'
}