import React from 'react';
import ReactFlow, { Handle, Position } from 'reactflow';
import 'reactflow/dist/style.css';

const TooltipNodeWrapper = ({ data, children }) => {
  const [showTooltip, setShowTooltip] = React.useState(false);

  return (
    <div
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      style={{ position: 'relative', display: 'inline-block' }}
    >
      <Handle type="target" position={Position.Top} />
      {children}
      <Handle type="source" position={Position.Bottom} />

      {showTooltip && (
        <div
          style={{
            position: 'absolute',
            top: -30,
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '8px',
            background: 'black',
            color: 'white',
            borderRadius: 4,
            fontSize: 12,
            whiteSpace: 'nowrap',
            zIndex: 1000,
          }}
        >
          {Object.entries(data.properties).map(([key, value]) => (
            <div key={key}>
              <strong>{key}: </strong>{value}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const RectangularNode = ({ data }) => (
  <TooltipNodeWrapper data={data}>
    <div
      style={{
        padding: 10,
        border: `2px solid ${data.style?.color || '#ddd'}`,
        borderRadius: 5,
        backgroundColor: data.style?.color || '#f0f0f0',
        width: 150,
        cursor: 'pointer',
      }}
    >
      {data.label}
    </div>
  </TooltipNodeWrapper>
);

const CircleNode = ({ data }) => (
  <TooltipNodeWrapper data={data}>
    <div
      style={{
        width: 60,
        height: 60,
        borderRadius: '50%',
        backgroundColor: data.style?.color || '#a2d2ff',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        border: `2px solid ${data.style?.color || '#333'}`,
        fontWeight: 'bold',
        color: '#fff',
        cursor: 'pointer',
      }}
    >
      {data.label}
    </div>
  </TooltipNodeWrapper>
);

const nodeTypes = {
  rectangle: RectangularNode,
  circle: CircleNode,
};

const GraphUI = () => {
  const data = {
    nodes: [
      {
        id: 'user_1',
        label: 'Alice',
        type: 'Person',
        properties: {
          email: 'alice@example.com',
          role: 'Analyst',
        },
        style: {
          color: '#4CAF50',
          shape: 'circle',
        },
        group: 'Team A',
      },
      {
        id: 'doc_1',
        label: 'Report Q1',
        type: 'Document',
        properties: {
          created: '2024-03-01',
          status: 'approved',
        },
        style: {
          color: '#2196F3',
          shape: 'rectangle',
        },
        group: 'Documents',
      },
    ],
    edges: [
      {
        source: 'user_1',
        target: 'doc_1',
        label: 'authored',
        direction: 'one-way',
        style: {
          dashed: false,
          color: '#555',
        },
      },
    ],
    meta: {
      title: 'Knowledge Graph - Access Control',
      description: 'Sample graph representing users, documents, and policies.',
    },
  };

  const nodes = data.nodes.map((node) => ({
    id: node.id,
    type: node.style?.shape === 'circle' ? 'circle' : 'rectangle', 
    position: { x: Math.random() * 400, y: Math.random() * 400 },
    data: node,
  }));

  const edges = data.edges.map((edge) => ({
    id: `${edge.source}-${edge.target}`,
    source: edge.source,
    target: edge.target,
    label: edge.label,
    style: {
      stroke: edge.style?.color || '#555',
      strokeWidth: 2,
      strokeDasharray: edge.style?.dashed ? '5,5' : '0',
    },
    markerEnd: { type: 'arrowclosed' },
  }));

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} fitView />
    </div>
  );
};

export default GraphUI;
