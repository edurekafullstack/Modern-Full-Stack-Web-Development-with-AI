import { z } from 'zod'

const StopSchema = z.strictObject({
  time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Time must be in HH:MM format'),
  name: z.string().min(1).max(80),
  note: z.string().max(200),
})

const DaySchema = z.strictObject({
  number: z.number().int(),
  title: z.string(),
  stops: z.array(StopSchema).min(1).max(6),
})

export const ItinerarySchema = z.strictObject({
  days: z.array(DaySchema).min(1).max(7),
})
