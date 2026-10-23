export const itineraryOutputs = {
  normal: JSON.stringify({
    days: [
      { number: 1, title: 'Belém and the riverside', stops: [
        { time: '10:00', name: 'Belém Tower', note: 'Arrive early to avoid queues.' },
        { time: '13:00', name: 'Pastéis de Belém', note: 'Custard tarts after lunch.' },
      ] },
      { number: 2, title: 'Alfama at a slow pace', stops: [
        { time: '10:30', name: 'Alfama walking tour', note: 'Wear comfortable shoes for the hills.' },
        { time: '18:00', name: 'Miradouro de Santa Luzia', note: 'Sunset over the rooftops.' },
      ] },
      { number: 3, title: 'A day in Sintra', stops: [
        { time: '09:30', name: 'Pena Palace', note: 'Book timed entry tickets in advance.' },
      ] },
    ],
  }),
  invalid: JSON.stringify({
    days: [{ number: 1, title: 'Belém', stops: [{ time: 'morning', name: 'Belém Tower' }] }],
  }),
  malformed: '{"days":[{"number":1,"title":"Belém","stops":[{"time":"10:00","na',
}