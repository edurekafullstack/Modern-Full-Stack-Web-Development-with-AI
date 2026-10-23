import { z } from 'zod'

function findStop(days, stopId) {
  for (const day of days) {
    const stop = day.stops.find((item) => item.id === stopId)
    if (stop) return { stop, dayNumber: day.number }
  }
  return null
}

const toolHandlers = {
  add_stop: {
    schema: z.object({
      day_number: z.number().int().positive(),
      time: z.string().regex(/^\d{2}:\d{2}$/),
      name: z.string().min(1).max(80),
    }),
    needsStop: false,
    describe: (input) => `Add "${input.name}" at ${input.time} on Day ${input.day_number}`,
    toAction: (input) => ({
      type: 'added_stop',
      dayNumber: input.day_number,
      stop: { id: crypto.randomUUID(), time: input.time, name: input.name, booked: false },
    }),
  },
  move_stop: {
    schema: z.object({ stop_id: z.string(), direction: z.enum(['up', 'down']) }),
    needsStop: true,
    describe: (input, days) => `Move "${findStop(days, input.stop_id).stop.name}" ${input.direction}`,
    toAction: (input, days) => ({
      type: 'moved_stop',
      dayNumber: findStop(days, input.stop_id).dayNumber,
      stopId: input.stop_id,
      direction: input.direction,
    }),
  },
  remove_stop: {
    schema: z.object({ stop_id: z.string() }),
    needsStop: true,
    describe: (input, days) => `Remove "${findStop(days, input.stop_id).stop.name}"`,
    toAction: (input) => ({ type: 'removed_stop', stopId: input.stop_id }),
  },
}

export function planActions(toolCalls, days) {
  const planned = []
  const rejected = []

  for (const call of toolCalls) {
    const handler = Object.hasOwn(toolHandlers, call.name) ? toolHandlers[call.name] : null
    if (!handler) {
      rejected.push(`Ignored unknown action "${call.name}".`)
      continue
    }

    const result = handler.schema.safeParse(call.input)
    if (!result.success) {
      rejected.push(`Ignored ${call.name}: the details were invalid.`)
      continue
    }

    if (handler.needsStop && !findStop(days, result.data.stop_id)) {
      rejected.push(`Ignored ${call.name}: that stop doesn't exist.`)
      continue
    }

    planned.push({
      id: call.id,
      description: handler.describe(result.data, days),
      action: handler.toAction(result.data, days),
    })
  }

  return { planned, rejected }
}