import React from 'react';

const Edge = ({ edge, nodes, selected, onClick }) => {
  const source = nodes.find(n => n.id === edge.source);
  const target = nodes.find(n => n.id === edge.target);
  if (!source || !target) return null;

  const nodeRadius = 20;
  const fontSize = 12;
  const dx = target.x - source.x;
  const dy = target.y - source.y;
  const angle = Math.atan2(dy, dx);
  const startX = source.x + nodeRadius * Math.cos(angle);
  const startY = source.y + nodeRadius * Math.sin(angle);
  const arrowLength = edge.direction === 'one-way' ? nodeRadius : 0;
  const endX = target.x - (nodeRadius + arrowLength) * Math.cos(angle);
  const endY = target.y - (nodeRadius + arrowLength) * Math.sin(angle);
  const path = `M${startX},${startY} L${endX},${endY}`;
  const labelPos = { x: (source.x + target.x) / 2, y: (source.y + target.y) / 2 - 10 };

  let arrow = null;
  if (edge.direction === 'one-way') {
    const distance = Math.sqrt(dx * dx + dy * dy);
    const scaleFactor = (distance - nodeRadius) / distance;
    const endXArrow = source.x + dx * scaleFactor;
    const endYArrow = source.y + dy * scaleFactor;
    const arrowSize = 6;
    arrow = (
      <polygon 
        points={`0,-${arrowSize} ${arrowSize*1.5},0 0,${arrowSize}`}
        transform={`translate(${endXArrow},${endYArrow}) rotate(${angle * (180 / Math.PI)})`}
        fill={edge.style?.color || "#555"}
      />
    );
  }

  return (
    <g>
      <path 
        d={path}
        stroke={selected ? "#ff7700" : (edge.style?.color || "#555")}
        strokeWidth={selected ? 3 : 2}
        strokeDasharray={edge.style?.dashed ? "5,5" : "none"}
        fill="none"
        onClick={(e) => onClick(edge, e)}
        style={{ cursor: 'pointer' }}
      />
      <g transform={`translate(${labelPos.x}, ${labelPos.y})`}>
        <rect 
          x="-20" 
          y="-10" 
          width={edge.label ? edge.label.length * 6  : 0} 
          height="16" 
          fill="white" 
          fillOpacity="0.8" 
          rx="3"
        />
        <text 
          textAnchor="middle" 
          fontSize={fontSize} 
          fill="#333"
        >
          {edge.label}
        </text>
      </g>
      {arrow}
    </g>
  );
};

export default Edge;