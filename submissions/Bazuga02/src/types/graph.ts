export interface GraphNodeStyle {
  color?: string;
  shape?: string;
}

export interface GraphNodeProperties {
  [key: string]: string | number | boolean;
}

export interface GraphNode {
  id: string;
  label: string;
  type: string;
  properties?: GraphNodeProperties;
  style?: GraphNodeStyle;
  group?: string;
}

export interface GraphEdgeStyle {
  dashed?: boolean;
  lineType?: 'solid' | 'dashed' | 'dotted';
  color?: string;
}

export interface GraphEdge {
  source: string;
  target: string;
  label: string;
  direction?: string;
  style?: GraphEdgeStyle;
}

export interface GraphMeta {
  title?: string;
  description?: string;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
  meta: GraphMeta;
}

export interface CytoscapeNodeData {
  id: string;
  label: string;
  type: string;
  properties?: GraphNodeProperties;
  color: string;
  shape: string;
  group?: string;
}

export interface CytoscapeEdgeData {
  id: string;
  source: string;
  target: string;
  label: string;
  direction?: string;
  color: string;
  lineType: 'solid' | 'dashed' | 'dotted';
}

export interface ConnectedNode {
  node: GraphNode;
  edge: GraphEdge;
  isOutgoing: boolean;
}

export type LayoutType = 'cose' | 'concentric' | 'grid' | 'circle';
export type GroupByType = 'none' | 'type' | 'group';
