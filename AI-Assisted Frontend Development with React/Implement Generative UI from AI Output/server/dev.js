import { serve } from '@hono/node-server'
import app from './app.js'

const port = 8787
serve({ fetch: app.fetch, port })
console.log(`AI proxy on http://localhost:${port} using the ${process.env.AI_PROVIDER ?? 'mock'} provider`)