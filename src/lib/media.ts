const mediaBaseUrl = import.meta.env.VITE_PUBLIC_MEDIA_BASE_URL?.replace(/\/$/, '')

/** Resolves catalogue assets from Cloudflare R2 while preserving external URLs. */
export function publicMedia(path: string) {
  if (/^https?:\/\//i.test(path)) return path

  const key = path.replace(/^\/+/, '')
  return mediaBaseUrl ? `${mediaBaseUrl}/assets/${key}` : `/${key}`
}
