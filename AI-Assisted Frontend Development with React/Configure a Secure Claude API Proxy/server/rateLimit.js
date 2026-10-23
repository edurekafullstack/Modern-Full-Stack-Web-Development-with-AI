export function rateLimit({ limit, windowMs }) {
  const hits = new Map()

  return async (c, next) => {
    const ip = c.req.header('x-forwarded-for')?.split(',')[0].trim() ?? 'local'
    const now = Date.now()
    const entry = hits.get(ip)

    if (!entry || now - entry.start >= windowMs) {
      hits.set(ip, { start: now, count: 1 })
    } else {
      entry.count += 1
      if (entry.count > limit) {
        const retryAfter = Math.ceil((entry.start + windowMs - now) / 1000)
        c.header('Retry-After', String(retryAfter))
        return c.json({ error: 'Too many requests. Please wait and try again.' }, 429)
      }
    }

    await next()
  }
}