// Types for our graph data structures

export interface NodeStyle {
  color: string;
  shape: string;
}

export interface EdgeStyle {
  dashed: boolean;
  color: string;
}

export interface NodeProperties {
  [key: string]: string | number | boolean;
}

export interface Node {
  id: string;
  label: string;
  type: string;
  properties: NodeProperties;
  style: NodeStyle;
  group?: string;
}

export interface Edge {
  source: string;
  target: string;
  label: string;
  direction: 'one-way' | 'two-way';
  style: EdgeStyle;
  properties?: NodeProperties;
}

export interface GraphMeta {
  title: string;
  description: string;
}

export interface GraphData {
  nodes: Node[];
  edges: Edge[];
  meta: GraphMeta;
}