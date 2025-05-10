import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { Node as AppNode } from '../../types/graph';

interface CustomNodeData extends AppNode {
  isHighlighted?: boolean;
}

interface NodeProps {
  id: string;
  data: CustomNodeData;
  isConnectable: boolean;
  selected?: boolean;
}

const CustomNode = ({ data, isConnectable, selected }: NodeProps) => {
  const { label, type, style, isHighlighted, properties, group } = data;

  // Shorter label for better display in complex graphs
  const displayLabel = label.length > 20 ? `${label.substring(0, 18)}...` : label;
  
  const nodeStyle = {
    borderColor: isHighlighted ? '#ff5722' : style.color,
    backgroundColor: isHighlighted 
      ? 'rgba(255, 87, 34, 0.2)' 
      : selected 
        ? 'rgba(49, 130, 206, 0.1)' 
        : 'rgba(49, 130, 206, 0.2)s',
    boxShadow: isHighlighted 
      ? '0 0 12px rgba(255, 87, 34, 0.6)' 
      : selected
        ? '0 0 0 2px #3182ce'
        : '0 2px 5px rgba(0, 0, 0, 0.1)',
    borderWidth: isHighlighted ? '3px' : '2px',
    maxWidth: '180px',
  };

  // Map node shapes to appropriate styles
  const getShapeStyles = () => {
    switch (style.shape?.toLowerCase()) {
      case 'circle':
        return 'rounded-full';
      case 'diamond':
        return 'rotate-45 rounded-sm';
      case 'triangle':
        return 'triangle-node';
      case 'hexagon':
        return 'hexagon-node';
      case 'rectangle':
      default:
        return 'rounded-md';
    }
  };
  
  const propertyCount = Object.keys(properties).length;
  
  return (
    <div className={`custom-node ${getShapeStyles()} px-3 py-3 transition-all duration-300`} style={nodeStyle}>
      <Handle 
        type="target" 
        position={Position.Top} 
        isConnectable={isConnectable} 
        className="bg-gray-400 w-3 h-3 border-2 border-white dark:border-gray-800"
      />
      
      <div className="flex flex-col items-center">
        <div 
          className="w-5 h-5 mb-1 rounded-full flex items-center justify-center"
          style={{ backgroundColor: style.color }}
        >
          {type && type.charAt(0).toUpperCase()}
        </div>
        
        <div className="font-semibold text-center text-sm text-gray-800 dark:text-white leading-tight">
          {displayLabel}
        </div>
        
        <div className="text-xs text-gray-500 mt-1">{type}</div>
        
        {group && (
          <div className="text-[10px] mt-1 px-1.5 py-0.5 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-300 rounded-full">
            {group}
          </div>
        )}
        
        {propertyCount > 0 && (
          <div className="text-[10px] mt-1 opacity-75 text-gray-500">
            {propertyCount} {propertyCount === 1 ? 'property' : 'properties'}
          </div>
        )}
      </div>
      
      <Handle 
        type="source" 
        position={Position.Bottom} 
        isConnectable={isConnectable} 
        className="bg-gray-400 w-3 h-3 border-2 border-white dark:border-gray-800"
      />
    </div>
  );
};

export default memo(CustomNode); 