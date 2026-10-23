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