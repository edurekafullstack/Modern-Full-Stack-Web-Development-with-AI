import { useContext, useEffect, useRef, useState } from 'react'
import Button from './Button.jsx'
import { TripContext } from '../features/trip/TripContext.jsx'
import { planActions } from '../features/assistant/assistantTools.js'
import { describeForTools, requestToolCalls } from '../features/assistant/requestToolCalls.js'

function ConfirmActionsDialog({ actions, onConfirm, onCancel }) {
  const dialogRef = useRef(null)

  useEffect(() => {
    dialogRef.current.showModal()
  }, [])

  return (
    <dialog ref={dialogRef} onCancel={onCancel} aria-labelledby="confirm-title" className="m-auto max-w-md rounded-lg p-6 shadow-xl backdrop:bg-black/40">
      <h2 id="confirm-title" className="text-lg font-semibold">Confirm changes</h2>
      <p className="mt-2 text-sm text-slate-600">The assistant wants to make these changes:</p>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">
        {actions.map((item) => (
          <li key={item.id}>{item.description}</li>
        ))}
      </ul>
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button onClick={onConfirm}>Apply changes</Button>
      </div>
    </dialog>
  )
}

function AssistantActions({ itinerary, tripNote }) {
  const { dispatch } = useContext(TripContext)
  const [request, setRequest] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [planned, setPlanned] = useState([])
  const [log, setLog] = useState([])

  async function handleSubmit(event) {
    event.preventDefault()
    if (!request.trim()) return
    setIsLoading(true)
    try {
      const toolCalls = await requestToolCalls(request.trim(), describeForTools(itinerary, tripNote))
      const result = planActions(toolCalls, itinerary)
      setLog(result.rejected.length || result.planned.length ? result.rejected : ['The assistant had no changes to make.'])
      setPlanned(result.planned)
    } catch (error) {
      setLog([error.message])
    } finally {
      setIsLoading(false)
    }
  }

  function applyChanges() {
    planned.forEach((item) => dispatch(item.action))
    setLog((current) => [...current, ...planned.map((item) => `Done: ${item.description}.`)])
    setPlanned([])
    setRequest('')
  }

  function cancelChanges() {
    setLog((current) => [...current, 'Cancelled. Nothing was changed.'])
    setPlanned([])
  }

  return (
    <section className="rounded-lg bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold">Edit with AI</h2>
      <form onSubmit={handleSubmit} className="mt-3">
        <label htmlFor="assistant-action" className="block text-sm font-medium">Tell the assistant what to change</label>
        <div className="mt-1 flex gap-2">
          <input id="assistant-action" value={request} onChange={(event) => setRequest(event.target.value)} className="flex-1 rounded border border-slate-300 px-3 py-2" />
          <Button type="submit" disabled={isLoading}>{isLoading ? 'Thinking…' : 'Suggest'}</Button>
        </div>
      </form>

      <ul aria-live="polite" className="mt-3 space-y-1 text-sm text-slate-700">
        {log.map((line, index) => (
          <li key={index}>{line}</li>
        ))}
      </ul>

      {planned.length > 0 && (
        <ConfirmActionsDialog actions={planned} onConfirm={applyChanges} onCancel={cancelChanges} />
      )}
    </section>
  )
}

export default AssistantActions