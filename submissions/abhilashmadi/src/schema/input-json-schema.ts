import { z } from "zod";

// Style object schema (used in both nodes and edges)
const StyleSchema = z.object({
  color: z.string().optional(),      // e.g., "#4CAF50", "blue"
  shape: z.string().optional(),      // (if needed in future)
  lineType: z.enum(["solid", "dashed", "dotted"]).optional() // used in edges
}).optional();

// Node schema
const NodeSchema = z.object({
  id: z.string({ required_error: 'Node "id" is required.' }),
  label: z.string({ required_error: 'Node "label" is required.' }),
  type: z.string({ required_error: 'Node "type" is required.' }),
  properties: z.record(z.any()).optional(),
  style: StyleSchema,
  group: z.string().optional()
});

// Edge schema
const EdgeSchema = z.object({
  source: z.string({ required_error: 'Edge "source" is required.' }),
  target: z.string({ required_error: 'Edge "target" is required.' }),
  label: z.string().optional(),
  direction: z.enum(["->", "<-", "<->"]).optional(),
  style: StyleSchema
});

// Meta section schema
const MetaSchema = z.object({
  title: z.string({ required_error: 'Meta "title" is required.' }),
  description: z.string().optional()
});

// Full input schema
export const InputJsonSchema = z.object({
  meta: MetaSchema,
  nodes: z.array(NodeSchema, {
    message:
      'The "nodes" field must be a valid array of node objects. Each node should contain a unique "id", a readable "label", a "type" (e.g., User, Document, etc.), and optional "properties", "style", and "group".'
  }).min(1, 'At least one node must be defined in the graph to visualize relationships.'),
  edges: z.array(EdgeSchema, {
    message:
      'The "edges" field must be a valid array of edge objects. Each edge must include a "source" and "target" that match node IDs, and may include optional "label", "direction" (e.g., "->"), and "style" such as "lineType".'
  })
});


export type Meta = z.infer<typeof MetaSchema>;
export type Node = z.infer<typeof NodeSchema>;
export type Edge = z.infer<typeof EdgeSchema>;
export type Graph = z.infer<typeof InputJsonSchema>;