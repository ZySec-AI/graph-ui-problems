import React, { useState, useCallback } from "react";
import './App.css';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  applyNodeChanges,
  applyEdgeChanges,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { graphData } from './data/graphData';
import CustomNode from './CustomNode';
import CustomEdge from './CustomEdge';
import { getLayoutedElements } from './LayoutHelper'; 


const style = (node) => {
  const isCircle = node.style.shape === "circle";
  const size = 80;
  return {
    background: node.style.color || "#333",
    borderRadius: isCircle ? "50%" : "6px",
    color: "#fff",
    width: isCircle ? size : 130,
    height: isCircle ? size : 60,
    fontSize: "0.7rem",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    lineHeight: 1.2,
  };
};

function App() {

  const initialNodes = graphData.nodes.map((node) => ({
    id: node.id,
    type: 'custom',
    data: {
      label: `${node.label} (${node.type})`,
      properties: node.properties,
      group: node.group,
    },
    position: { x: 0, y: 0 },
    style: style(node),
  }));

  const initialEdges = graphData.edges.map((edge, index) => {
  const id = `e-${index}`;
  const lineType = edge.style?.lineType || 'solid';

  return {
    id,
    source: edge.source,
    target: edge.target,
    type: 'custom',
    data: {
      style: { lineType },
      label: edge.label,
    },
    style: {
      stroke: '#999',
    },
    markerEnd: {
      type: 'arrowclosed',
      color: '#fff',
      width: 25,
      height: 25,
    },
  };
});

  const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(initialNodes, initialEdges);

  const [nodes, setNodes] = useState(layoutedNodes);
  const [edges,setEdges] = useState(layoutedEdges);

  const nodeTypes = {
    custom: CustomNode,
  };

  const edgeTypes = {
  custom: CustomEdge,
};

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [],
  );

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center">
      <div className="flex flex-col justify-center items-center p-4 bg-slate-100 border-b border-gray-300">
        <h2 className="m-0 text-xl font-bold">{graphData.meta.title}</h2>
        <p className="m-0 text-sm text-gray-600">{graphData.meta.description}</p>
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        colorMode="dark"
        fitView
      >
        <Background variant="dots" gap={12} size={1} />
        <MiniMap pannable zoomable />
        <Controls />
      </ReactFlow>
    </div>
  );
}

export default App;
