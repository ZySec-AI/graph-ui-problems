import Dagre from '@dagrejs/dagre';

const NODE_WIDTH = 150;
const NODE_HEIGHT = 70;

export const getLayoutedElements = (nodes, edges, options = { direction: 'TB' }) => {
  const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: options.direction });

  nodes.forEach((node) => {
    g.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  });

  edges.forEach((edge) => {
    g.setEdge(edge.source, edge.target);
  });

  Dagre.layout(g);

  const layoutedNodes = nodes.map((node) => {
    const { x, y } = g.node(node.id);
    return {
      ...node,
      position: {
        x: x - NODE_WIDTH / 2,
        y: y - NODE_HEIGHT / 2,
      },
      sourcePosition: options.direction === 'LR' ? 'right' : 'bottom',
      targetPosition: options.direction === 'LR' ? 'left' : 'top',
    };
  });

  return {
    nodes: layoutedNodes,
    edges,
  };
};
