export const tripTools = [
  {
    name: 'add_stop',
    description: 'Add a stop to one day of the itinerary.',
    input_schema: {
      type: 'object',
      properties: {
        day_number: { type: 'integer' },
        time: { type: 'string', description: '24-hour time, HH:MM' },
        name: { type: 'string' },
      },
      required: ['day_number', 'time', 'name'],
    },
  },
  {
    name: 'move_stop',
    description: 'Move a stop up or down within its day.',
    input_schema: {
      type: 'object',
      properties: {
        stop_id: { type: 'string' },
        direction: { type: 'string', enum: ['up', 'down'] },
      },
      required: ['stop_id', 'direction'],
    },
  },
  {
    name: 'remove_stop',
    description: 'Remove a stop from the itinerary.',
    input_schema: {
      type: 'object',
      properties: { stop_id: { type: 'string' } },
      required: ['stop_id'],
    },
  },
]