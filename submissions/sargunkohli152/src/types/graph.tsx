export type GraphData = {
  nodes: {
    id: string;
    label: string;
    type: string;
    properties?: Record<string, any>;
    style?: {
      color?: string;
      shape?: 'circle' | 'rectangle';
    };
    group?: string;
  }[];
  edges: {
    source: string;
    target: string;
    label?: string;
    direction?: string;
    style?: {
      dashed?: boolean;
      color?: string;
      lineType?: string;
    };
  }[];
  meta?: {
    title?: string;
    description?: string;
  };
};
