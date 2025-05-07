import { GraphData, GraphNode, GraphEdge, ConnectedNode } from '@/types/graph';

// Type to color mapping
export const typeColorMap: Record<string, string> = {
  'User': '#4F46E5', // indigo-600
  'Document': '#10B981', // emerald-500
  'Policy': '#F59E0B', // amber-500
  'Infrastructure': '#EF4444', // red-500
  'Group': '#8B5CF6', // purple-500
};

// Type to shape mapping
export const typeShapeMap: Record<string, string> = {
  'User': 'ellipse',
  'Document': 'rectangle',
  'Policy': 'hexagon', 
  'Infrastructure': 'diamond',
  'Group': 'roundrectangle',
};

// Type to icon mapping
export const typeIconMap: Record<string, string> = {
  'User': 'ri-user-fill',
  'Document': 'ri-file-text-fill',
  'Policy': 'ri-shield-check-fill',
  'Infrastructure': 'ri-server-fill',
  'Group': 'ri-group-fill',
};

// Type to background color class mapping
export const typeBgColorClass: Record<string, string> = {
  'User': 'bg-indigo-600',
  'Document': 'bg-emerald-500',
  'Policy': 'bg-amber-500',
  'Infrastructure': 'bg-red-500',
  'Group': 'bg-purple-500',
};

// Get a color for a node type, with fallback
export function getColorForNodeType(type: string, defaultColor: string = '#999'): string {
  return typeColorMap[type] || defaultColor;
}

// Get a shape for a node type, with fallback
export function getShapeForNodeType(type: string, defaultShape: string = 'ellipse'): string {
  return typeShapeMap[type] || defaultShape;
}

// Get an icon for a node type, with fallback
export function getIconForNodeType(type: string): string {
  return typeIconMap[type] || 'ri-question-fill';
}

// Get a background color class for a node type
export function getBgColorClassForType(type: string): string {
  return typeBgColorClass[type] || 'bg-gray-500';
}

// Get connected nodes for a given node
export function getConnectedNodes(nodeId: string, graphData: GraphData): ConnectedNode[] {
  const connectedNodes: ConnectedNode[] = [];
  
  if (!graphData || !graphData.edges) return connectedNodes;
  
  graphData.edges.forEach(edge => {
    if (edge.source === nodeId) {
      const targetNode = graphData.nodes.find(node => node.id === edge.target);
      if (targetNode) {
        connectedNodes.push({
          node: targetNode,
          edge,
          isOutgoing: true
        });
      }
    } else if (edge.target === nodeId) {
      const sourceNode = graphData.nodes.find(node => node.id === edge.source);
      if (sourceNode) {
        connectedNodes.push({
          node: sourceNode,
          edge,
          isOutgoing: false
        });
      }
    }
  });
  
  return connectedNodes;
}

// Default sample data for initial rendering
const sampleData: GraphData = {
  meta: {
    title: "Sample Knowledge Graph",
    description: "A sample knowledge graph containing users, documents, policies, and infrastructure components."
  },
  nodes: [
    {
      id: "user1",
      label: "Alice",
      type: "User",
      properties: {
        role: "Administrator"
      },
      style: {
        color: "blue"
      },
      group: "Personnel"
    },
    {
      id: "user2",
      label: "Bob",
      type: "User",
      properties: {
        role: "Developer"
      },
      style: {
        color: "blue"
      },
      group: "Personnel"
    },
    {
      id: "user3",
      label: "Charlie",
      type: "User",
      properties: {
        role: "Analyst"
      },
      style: {
        color: "blue"
      },
      group: "Personnel"
    },
    {
      id: "doc1",
      label: "Employee Handbook",
      type: "Document",
      properties: {
        category: "HR"
      },
      style: {
        color: "green"
      },
      group: "Documents"
    },
    {
      id: "policy1",
      label: "Password Policy",
      type: "Policy",
      properties: {
        strength: "High"
      },
      style: {
        color: "orange"
      },
      group: "Policies"
    },
    {
      id: "server1",
      label: "Web Server",
      type: "Infrastructure",
      properties: {
        os: "Linux"
      },
      style: {
        color: "red"
      },
      group: "Infrastructure"
    },
    {
      id: "group1",
      label: "Engineering Group",
      type: "Group",
      properties: {
        description: "Engineering Department"
      },
      style: {
        color: "purple"
      },
      group: "Groups"
    }
  ],
  edges: [
    {
      source: "user1",
      target: "doc1",
      label: "accesses",
      direction: "->",
      style: {
        lineType: "dotted"
      }
    },
    {
      source: "user2",
      target: "group1",
      label: "member of",
      direction: "->",
      style: {
        lineType: "solid"
      }
    },
    {
      source: "policy1",
      target: "server1",
      label: "protects",
      direction: "->",
      style: {
        lineType: "dashed"
      }
    },
    {
      source: "user3",
      target: "policy1",
      label: "follows",
      direction: "->",
      style: {
        lineType: "solid"
      }
    }
  ]
};

export default sampleData;
