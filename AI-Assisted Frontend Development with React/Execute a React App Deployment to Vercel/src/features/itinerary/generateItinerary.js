import { ItinerarySchema } from './itinerarySchema.js'

function mockHeaders() {
  const scenario = import.meta.env.DEV ? localStorage.getItem('mock:scenario') : null
  return scenario ? { 'x-mock-scenario': scenario } : {}
}

export async function generateItinerary(request) {
  const response = await fetch('/api/itinerary', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...mockHeaders() },
    body: JSON.stringify({ request }),
  })
  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new Error(body?.error ?? `Request failed with status ${response.status}`)
  }

  const { output } = await response.json()

  let json
  try {
    json = JSON.parse(output)
  } catch {
    throw new Error("The AI's answer wasn't valid JSON.")
  }

  const result = ItinerarySchema.safeParse(json)
  if (!result.success) {
    console.warn('Itinerary failed validation:', result.error.issues)
    throw new Error("The AI's itinerary didn't match the expected format.")
  }

  return {
    days: result.data.days.map((day) => ({
      ...day,
      stops: day.stops.map((stop) => ({ ...stop, id: crypto.randomUUID() })),
    })),
  }
}