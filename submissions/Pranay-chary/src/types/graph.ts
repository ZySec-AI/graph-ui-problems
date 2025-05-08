export interface NodeStyle {
  color: string;
  shape?: string;
}

export interface EdgeStyle {
  lineType?: 'solid' | 'dashed' | 'dotted';
  color?: string;
}

export interface NodeData {
  id: string;
  label: string;
  type: string;
  properties: Record<string, any>;
  style: NodeStyle;
  group: string;
}

export interface EdgeData {
  source: string;
  target: string;
  label: string;
  direction: string;
  style: EdgeStyle;
}

export interface GraphMeta {
  title: string;
  description: string;
}

export interface GraphData {
  meta: GraphMeta;
  nodes: NodeData[];
  edges: EdgeData[];
} 