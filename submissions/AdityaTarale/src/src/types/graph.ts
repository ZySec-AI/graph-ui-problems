interface Meta {
  title: string;
  description: string;
}

interface Style {
  color?: string;
  shape?: string;
  lineType?: string;
}

interface Properties {
  email?: string;
  role?: string;
  created?: string;
  status?: string;
}

export interface Node {
  id: string;
  label: string;
  type: string;
  properties: Properties;
  style: Style;
  group: string;
}

interface EdgeStyle {
  lineType?: string;
  dashed?: boolean;
  color?: string;
}

export interface Edge {
  source: string;
  target: string;
  label: string;
  direction: string;
  style: EdgeStyle;
}

export interface Graph {
  meta: Meta;
  nodes: Node[];
  edges: Edge[];
}
