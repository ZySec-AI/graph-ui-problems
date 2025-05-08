import React from 'react';

const Node = ({ node, selected, onMouseDown }) => {
  const nodeRadius = 20;
  const fontSize = 12;
  const color = node.style?.color || "#666";
  const shape = node.style?.shape || 'circle';

  return (
    <g onMouseDown={onMouseDown} style={{ cursor: 'pointer' }}>
      {shape === 'rectangle' ? (
        <rect 
          x={node.x - nodeRadius} 
          y={node.y - nodeRadius} 
          width={nodeRadius * 2} 
          height={nodeRadius * 2}
          fill={color}
          stroke={selected ? "#ff5500" : "#333"}
          strokeWidth={selected ? 3 : 2}
          rx="3"
        />
      ) : (
        <circle 
          cx={node.x} 
          cy={node.y} 
          r={nodeRadius}
          fill={color}
          stroke={selected ? "#ff5500" : "#333"}
          strokeWidth={selected ? 3 : 2}
        />
      )}
      <text 
        x={node.x} 
        y={node.y} 
        textAnchor="middle" 
        dominantBaseline="middle" 
        fill="white"
        fontSize={fontSize}
        fontWeight="bold"
        pointerEvents="none"
      >
        {node.label}
      </text>
      <text 
        x={node.x} 
        y={node.y + nodeRadius + 15} 
        textAnchor="middle" 
        fill="#fff"
        fontSize={fontSize - 2}
        pointerEvents="none"
       
      >
        {node.type}
       
      </text>
    </g>
  );
};

export default Node;