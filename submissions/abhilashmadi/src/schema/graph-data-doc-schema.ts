
import { graphSchema } from '@schema/input-json-schema';
import { z } from 'zod';

export const graphDataDbDocSchema = z.object({
  id: z.number(),
  title: z.string().min(4).max(40),
  data: graphSchema,
})

export type GraphDataDbDoc = z.infer<typeof graphDataDbDocSchema>;