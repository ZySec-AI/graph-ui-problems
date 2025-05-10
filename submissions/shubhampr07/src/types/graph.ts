export interface NodeStyle {
  color: string;
  shape: string;
}

export interface Node {
  id: string;
  label: string;
  type: string;
  properties: Record<string, unknown>;
  style: NodeStyle;
  group?: string;
}

export interface EdgeStyle {
  dashed: boolean;
  color: string;
}

export interface Edge {
  source: string;
  target: string;
  label: string;
  direction: 'one-way' | 'two-way';
  style: EdgeStyle;
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