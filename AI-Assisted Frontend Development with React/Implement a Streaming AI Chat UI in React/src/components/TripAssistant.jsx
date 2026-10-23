import { useState } from 'react'
import Markdown from 'react-markdown'
import Button from './Button.jsx'
import { useChatStream } from '../hooks/useChatStream.js'

function describeItinerary(days) {
  return days
    .map((day) => {
      const stops = day.stops.length
        ? day.stops.map((stop) => `${stop.time} ${stop.name}${stop.booked ? ' (booked)' : ''}`).join(', ')
        : 'no stops'
      return `Day ${day.number}: ${stops}`
    })
    .join('\n')
}

function TripAssistant({ itinerary }) {
  const { messages, status, error, send, stop, retry } = useChatStream()
  const [question, setQuestion] = useState('')
  const context = `My trip itinerary:\n${describeItinerary(itinerary)}`

  function handleSubmit(event) {
    event.preventDefault()
    const text = question.trim()
    if (!text || status === 'streaming') return
    send(text, context)
    setQuestion('')
  }

  return (
    <section className="rounded-lg bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold">Trip assistant</h2>

      <ul className="mt-4 space-y-3">
        {messages.map((message) => (
          <li key={message.id} className={message.role === 'user' ? 'ml-8 rounded bg-sky-50 p-3' : 'mr-8 rounded bg-slate-50 p-3'}>
            <p className="text-xs font-medium text-slate-500">{message.role === 'user' ? 'You' : 'Assistant'}</p>
            {message.role === 'assistant' ? (
              <div className="mt-1 [&_li]:ml-5 [&_ol]:list-decimal [&_p]:mb-2 [&_ul]:list-disc">
                <Markdown>{message.content || '…'}</Markdown>
              </div>
            ) : (
              <p className="mt-1">{message.content}</p>
            )}
          </li>
        ))}
      </ul>

      {status === 'error' && (
        <div role="alert" className="mt-4 rounded bg-red-50 p-3 text-sm text-red-700">
          <p>{error}</p>
          <div className="mt-2">
            <Button variant="secondary" onClick={() => retry(context)}>Retry</Button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-4">
        <label htmlFor="assistant-question" className="block text-sm font-medium">Ask about your trip</label>
        <div className="mt-1 flex gap-2">
          <input id="assistant-question" value={question} onChange={(event) => setQuestion(event.target.value)} className="flex-1 rounded border border-slate-300 px-3 py-2" />
          {status === 'streaming' ? (
            <Button variant="secondary" onClick={stop}>Stop</Button>
          ) : (
            <Button type="submit">Ask</Button>
          )}
        </div>
      </form>
    </section>
  )
}

export default TripAssistant