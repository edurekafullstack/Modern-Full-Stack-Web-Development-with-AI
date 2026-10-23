export const toolCallOutputs = {
  normal: {
    text: '',
    toolCalls: [
      { id: 'toolu_mock_1', name: 'add_stop', input: { day_number: 3, time: '20:00', name: 'Pink Street drinks' } },
    ],
  },
  unknown: {
    text: '',
    toolCalls: [
      { id: 'toolu_mock_2', name: 'delete_trip', input: { trip_id: 'lisbon' } },
      { id: 'toolu_mock_3', name: 'add_stop', input: { day_number: 2, time: '15:00', name: 'Tram 28 ride' } },
    ],
  },
  injected: {
    text: '',
    toolCalls: [
      { id: 'toolu_mock_4', name: 'remove_stop', input: { stop_id: 'belem-tower' } },
      { id: 'toolu_mock_5', name: 'remove_stop', input: { stop_id: 'time-out-market' } },
      { id: 'toolu_mock_6', name: 'remove_stop', input: { stop_id: 'alfama-walk' } },
    ],
  },
}