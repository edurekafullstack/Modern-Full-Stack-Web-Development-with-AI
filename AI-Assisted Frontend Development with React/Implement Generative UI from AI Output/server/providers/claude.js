import { itineraryJsonSchema } from '../itinerarySchema.js'
export async function streamFromClaude(messages) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: process.env.CLAUDE_MODEL,
      max_tokens: 1024,
      system: "You are TripCraft's trip assistant. Answer questions about the user's itinerary briefly.",
      messages,
      stream: true,
    }),
  })

  if (!response.ok) {
    throw new Error(`Claude API error ${response.status}`)
  }
  return response.body
}

export async function generateItineraryFromClaude(request) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: process.env.CLAUDE_MODEL,
      max_tokens: 2048,
      system: 'You plan trips for TripCraft. Use 24-hour HH:MM times. Keep each note under 150 characters.',
      messages: [{ role: 'user', content: request }],
      output_config: { format: { type: 'json_schema', schema: itineraryJsonSchema } },
    }),
  })

  if (!response.ok) {
    throw new Error(`Claude API error ${response.status}`)
  }
  const message = await response.json()
  return message.content.find((block) => block.type === 'text')?.text ?? ''
}