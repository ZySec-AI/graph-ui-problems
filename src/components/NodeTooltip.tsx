import React from 'react';

interface NodeTooltipProps {
  content: React.ReactNode;
  position: { x: number; y: number };
  visible: boolean;
}

const NodeTooltip: React.FC<NodeTooltipProps> = ({ content, position, visible }) => {
  if (!visible) return null;
  
  return (
    <div 
      className="absolute bg-white shadow-lg rounded-md p-3 z-50 max-w-xs transition-opacity duration-200"
      style={{
        left: position.x + 10,
        top: position.y + 10,
        opacity: visible ? 1 : 0,
        pointerEvents: 'none'
      }}
    >
      {content}
    </div>
  );
};

export default NodeTooltip;