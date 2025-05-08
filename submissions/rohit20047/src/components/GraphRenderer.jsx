import React from 'react';
import Node from './Node';
import Edge from './Edge';

const GraphRenderer = ({ svgRef, nodes, edges, selectedElement, onNodeMouseDown, onEdgeClick, onSvgClick, onMouseMove, onMouseUp, zoom, offset }) => {
  const centerX = 500;
  const centerY = 300;
  const width = 1000 / zoom;
  const height = 600 / zoom;
  const adjustedViewBox = `${centerX - width/2 + offset.x} ${centerY - height/2 + offset.y} ${width} ${height}`;

  return (
    <svg 
      ref={svgRef}
      width="100%" 
      height="100%" 
      viewBox={adjustedViewBox}
      onClick={onSvgClick}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    >
      {edges.map(edge => (
        <Edge
          key={`${edge.source}-${edge.target}`}
          edge={edge}
          nodes={nodes}
          selected={selectedElement?.type === 'edge' && selectedElement.source === edge.source && selectedElement.target === edge.target}
          onClick={onEdgeClick}
        />
      ))}
      {nodes.map(node => (
        <Node
          key={node.id}
          node={node}
          selected={selectedElement?.type === 'node' && selectedElement.id === node.id}
          onMouseDown={(e) => onNodeMouseDown(node, e)}
        />
      ))}
    </svg>
  );
};

export default GraphRenderer;