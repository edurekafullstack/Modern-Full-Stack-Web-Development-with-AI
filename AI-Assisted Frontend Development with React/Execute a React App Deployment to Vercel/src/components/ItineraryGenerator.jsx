import { useActionState } from 'react'
import Button from './Button.jsx'
import { generateItinerary } from '../features/itinerary/generateItinerary.js'

const initialState = { itinerary: null, error: null, request: '3 relaxed days in Lisbon' }

async function generateAction(previousState, formData) {
  const request = formData.get('request').trim()
  if (!request) {
    return { ...previousState, error: 'Describe the trip you want.' }
  }
  try {
    const itinerary = await generateItinerary(request)
    return { itinerary, error: null, request }
  } catch (error) {
    return { itinerary: null, error: error.message, request }
  }
}

function PlanStopCard({ time, name, note }) {
  return (
    <li className="rounded bg-slate-50 p-3">
      <div className="flex gap-4">
        <span className="text-slate-500">{time}</span>
        <span className="font-medium">{name}</span>
      </div>
      <p className="mt-1 text-sm text-slate-600">{note}</p>
    </li>
  )
}

function ItineraryGenerator() {
  const [state, formAction, isPending] = useActionState(generateAction, initialState)

  return (
    <section className="mt-10 rounded-lg bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold">Plan a trip with AI</h2>

      <form action={formAction} className="mt-4">
        <label htmlFor="plan-request" className="block text-sm font-medium">Describe your trip</label>
        <div className="mt-1 flex gap-2">
          <input id="plan-request" name="request" defaultValue={state.request} className="flex-1 rounded border border-slate-300 px-3 py-2" />
          <Button type="submit" disabled={isPending}>{isPending ? 'Planning…' : 'Generate'}</Button>
        </div>
      </form>

      {state.error && (
        <p role="alert" className="mt-4 rounded bg-red-50 p-3 text-sm text-red-700">
          {state.error} Nothing was added. Try again or rephrase your request.
        </p>
      )}

      {state.itinerary && (
        <ol className="mt-6 space-y-6">
          {state.itinerary.days.map((day) => (
            <li key={day.number}>
              <h3 className="font-semibold">Day {day.number}: {day.title}</h3>
              <ul className="mt-2 space-y-2">
                {day.stops.map((stop) => (
                  <PlanStopCard key={stop.id} time={stop.time} name={stop.name} note={stop.note} />
                ))}
              </ul>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}

export default ItineraryGenerator