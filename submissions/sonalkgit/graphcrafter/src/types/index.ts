/**
 * Defines the structure of graph data used in the Cytoscape graph.
 * Includes node and edge definitions along with optional styling and metadata.
 */
export type GraphData = {
  nodes: Array<{
    id: string;
    label: string;
    type: string;
    properties: Record<string, string | undefined>;
    style?: {
      color?: string;
      shape?: string;
      [key: string]: any;
    };
    group: string;
  }>;
  edges: Array<{
    source: string;
    target: string;
    label: string;
    direction?: string;
    style?: {
      color?: string;
      lineType?: 'solid' | 'dashed';
    };
  }>;
  meta: {
    title: string;
    description: string;
  };
};
