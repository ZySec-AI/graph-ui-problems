import { z } from "zod";

// Common style options used in nodes and edges
const styleSchema = z.object({
  color: z.string().optional(),           // e.g., "#4CAF50", "blue"
  shape: z.string().optional(),           // Reserved for future shape support
  lineType: z.enum(["solid", "dashed", "dotted"]).optional() // Relevant for edges
}).optional();

// Schema for individual node
const nodeSchema = z.object({
  id: z.string({ required_error: 'Node "id" is required.' }),
  label: z.string({ required_error: 'Node "label" is required.' }),
  type: z.string({ required_error: 'Node "type" is required.' }),
  properties: z.record(z.any()).optional(),
  style: styleSchema,
  group: z.string().optional()
});

// Schema for individual edge
const edgeSchema = z.object({
  source: z.string({ required_error: 'Edge "source" is required.' }),
  target: z.string({ required_error: 'Edge "target" is required.' }),
  label: z.string().optional(),
  direction: z.enum(["->", "<-", "<->"]).optional(),
  style: styleSchema
});

// Meta information for the graph
const metaSchema = z.object({
  title: z.string({ required_error: 'Graph "title" is required.' }),
  description: z.string().optional()
});

// Complete graph schema including meta, nodes, and edges
export const graphSchema = z.object({
  meta: metaSchema,
  nodes: z.array(nodeSchema, {
    message:
      'The "nodes" field must be a valid array of node objects. Each node should contain a unique "id", a readable "label", a "type" (e.g., User, Document, etc.), and optional "properties", "style", and "group".'
  }).min(1, 'At least one node must be defined in the graph to visualize relationships.'),
  edges: z.array(edgeSchema, {
    message:
      'The "edges" field must be a valid array of edge objects. Each edge must include a "source" and "target" that match node IDs, and may include optional "label", "direction" (e.g., "->"), and "style" such as "lineType".'
  })
});

// Export types for inference
export type GraphMeta = z.infer<typeof metaSchema>;
export type GraphNode = z.infer<typeof nodeSchema>;
export type GraphEdge = z.infer<typeof edgeSchema>;
export type GraphData = z.infer<typeof graphSchema>;
