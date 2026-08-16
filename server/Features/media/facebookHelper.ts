const SHORT_LINK_PATTERN = /facebook\.com\/share\/|fb\.watch\//i

export const isShortFacebookLink = (url: string): boolean => {
  return SHORT_LINK_PATTERN.test(url)
}

export const resolveFacebookRedirect = async (url: string): Promise<string> => {
  if (!url || !isShortFacebookLink(url)) return url

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 5000)

  try {
    const res = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; NomadesBot/1.0; ...)' }
    })
    await res.body?.cancel()
    return res.url || url
  } catch (err) {
    console.warn(`[resolveFacebookRedirect] No se pudo resolver "${url}":`, err)
    return url
  } finally {
    clearTimeout(timeout)
  }
}