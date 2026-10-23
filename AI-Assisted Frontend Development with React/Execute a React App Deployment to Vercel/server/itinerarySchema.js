export const itineraryJsonSchema = {
  type: 'object',
  properties: {
    days: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          number: { type: 'integer' },
          title: { type: 'string' },
          stops: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                time: { type: 'string' },
                name: { type: 'string' },
                note: { type: 'string' },
              },
              required: ['time', 'name', 'note'],
              additionalProperties: false,
            },
          },
        },
        required: ['number', 'title', 'stops'],
        additionalProperties: false,
      },
    },
  },
  required: ['days'],
  additionalProperties: false,
}