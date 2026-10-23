import { Hono } from 'hono'
import { rateLimit } from './rateLimit.js'
import { streamFromClaude, generateItineraryFromClaude } from './providers/claude.js'
import { streamFromMock, itineraryFromMock } from './providers/mock.js'

const app = new Hono()

app.post('/api/chat', rateLimit({ limit: 10, windowMs: 60_000 }), async (c) => {
  const body = await c.req.json().catch(() => null)
  const messages = body?.messages

  if (!Array.isArray(messages) || messages.length === 0 || messages.length > 20) {
    return c.json({ error: 'Send between 1 and 20 messages.' }, 400)
  }

  const cleanMessages = messages.map((message) => ({
    role: message.role === 'assistant' ? 'assistant' : 'user',
    content: String(message.content).slice(0, 4000),
  }))

  const provider = process.env.AI_PROVIDER ?? 'mock'

  try {
    const stream =
      provider === 'claude'
        ? await streamFromClaude(cleanMessages)
        : streamFromMock(c.req.header('x-mock-scenario') ?? 'normal')

    return new Response(stream, {
      headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' },
    })
  } catch {
    return c.json({ error: 'The AI service is unavailable. Please try again.' }, 502)
  }
})

app.post('/api/itinerary', rateLimit({ limit: 10, windowMs: 60_000 }), async (c) => {
  const body = await c.req.json().catch(() => null)
  const request = typeof body?.request === 'string' ? body.request.trim().slice(0, 300) : ''
  if (!request) {
    return c.json({ error: 'Describe the trip you want.' }, 400)
  }

  try {
    const output =
      (process.env.AI_PROVIDER ?? 'mock') === 'claude'
        ? await generateItineraryFromClaude(request)
        : await itineraryFromMock(c.req.header('x-mock-scenario') ?? 'normal')
    return c.json({ output })
  } catch {
    return c.json({ error: 'The AI service is unavailable. Please try again.' }, 502)
  }
})

export default app