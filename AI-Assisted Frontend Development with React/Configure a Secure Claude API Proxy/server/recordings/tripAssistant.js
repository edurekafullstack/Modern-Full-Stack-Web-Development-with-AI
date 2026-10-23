const text = ['On Day 2 ', 'you have the ', 'Alfama walking tour ', 'at 10:00. ', 'Day 3 is ', 'still open.']

export const normalEvents = [
  { event: 'message_start', data: { type: 'message_start', message: { id: 'msg_mock_01', type: 'message', role: 'assistant', model: 'mock', content: [], stop_reason: null, usage: { input_tokens: 42, output_tokens: 1 } } } },
  { event: 'content_block_start', data: { type: 'content_block_start', index: 0, content_block: { type: 'text', text: '' } } },
  ...text.map((chunk) => ({ event: 'content_block_delta', data: { type: 'content_block_delta', index: 0, delta: { type: 'text_delta', text: chunk } } })),
  { event: 'content_block_stop', data: { type: 'content_block_stop', index: 0 } },
  { event: 'message_delta', data: { type: 'message_delta', delta: { stop_reason: 'end_turn', stop_sequence: null }, usage: { output_tokens: 18 } } },
  { event: 'message_stop', data: { type: 'message_stop' } },
]

export const malformedEvents = [
  normalEvents[0],
  normalEvents[1],
  normalEvents[2],
  { event: 'content_block_delta', data: '{"type":"content_block_delta","index":0,"delta":{"type":"text_del' },
]