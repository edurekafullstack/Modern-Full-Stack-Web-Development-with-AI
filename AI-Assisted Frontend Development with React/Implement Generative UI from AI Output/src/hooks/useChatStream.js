import { useEffect, useRef, useState } from 'react'

function parseEvent(rawEvent) {
  const dataLine = rawEvent.split('\n').find((line) => line.startsWith('data: '))
  if (!dataLine) return null
  return JSON.parse(dataLine.slice(6))
}

function mockHeaders() {
  const scenario = import.meta.env.DEV ? localStorage.getItem('mock:scenario') : null
  return scenario ? { 'x-mock-scenario': scenario } : {}
}

export function useChatStream() {
  const [messages, setMessages] = useState([])
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState(null)
  const controllerRef = useRef(null)

  useEffect(() => () => controllerRef.current?.abort(), [])

  function appendToLastMessage(text) {
    setMessages((current) => {
      const last = current[current.length - 1]
      return [...current.slice(0, -1), { ...last, content: last.content + text }]
    })
  }

  async function streamReply(history, context) {
    const controller = new AbortController()
    controllerRef.current = controller
    setStatus('streaming')
    setError(null)
    setMessages([...history, { id: crypto.randomUUID(), role: 'assistant', content: '' }])

    const apiMessages = history.map((message, index) => ({
      role: message.role,
      content:
        index === history.length - 1 && context
          ? `${context}\n\nQuestion: ${message.content}`
          : message.content,
    }))

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...mockHeaders() },
        body: JSON.stringify({ messages: apiMessages }),
        signal: controller.signal,
      })
      if (!response.ok) {
        const body = await response.json().catch(() => null)
        throw new Error(body?.error ?? `Request failed with status ${response.status}`)
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      let finished = false

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const rawEvents = buffer.split('\n\n')
        buffer = rawEvents.pop()

        for (const rawEvent of rawEvents) {
          const event = parseEvent(rawEvent)
          if (event?.type === 'content_block_delta' && event.delta.type === 'text_delta') {
            appendToLastMessage(event.delta.text)
          } else if (event?.type === 'message_stop') {
            finished = true
          } else if (event?.type === 'error') {
            throw new Error('The AI service reported an error.')
          }
        }
      }

      if (!finished) throw new Error('The response was cut off.')
      setStatus('idle')
    } catch (err) {
      if (err.name === 'AbortError') {
        setStatus('idle')
        return
      }
      setError(err instanceof SyntaxError ? 'The response came back garbled.' : err.message)
      setStatus('error')
    }
  }

  function send(text, context) {
    const history = [...messages, { id: crypto.randomUUID(), role: 'user', content: text }]
    streamReply(history, context)
  }

  function stop() {
    controllerRef.current?.abort()
  }

  function retry(context) {
    const lastUserIndex = messages.findLastIndex((message) => message.role === 'user')
    streamReply(messages.slice(0, lastUserIndex + 1), context)
  }

  return { messages, status, error, send, stop, retry }
}