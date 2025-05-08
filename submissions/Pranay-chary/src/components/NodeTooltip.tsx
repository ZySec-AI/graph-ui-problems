import React from 'react';
import type { NodeData } from '../types/graph';

interface NodeTooltipProps {
  data: NodeData;
}

const NodeTooltip: React.FC<NodeTooltipProps> = ({ data }) => {
  const formatValue = (value: any): string => {
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    if (typeof value === 'object' && value !== null) {
      return Object.entries(value)
        .map(([k, v]) => `${k}: ${v}`)
        .join(', ');
    }
    return String(value);
  };

  return (
    <div className="absolute z-10 w-80 p-4 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 transform translate-x-1/4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold dark:text-white">{data.label}</h3>
        <span className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded">
          {data.type}
        </span>
      </div>
      <div className="space-y-2">
        {Object.entries(data.properties).map(([key, value]) => (
          <div key={key} className="flex justify-between items-start">
            <span className="text-sm text-gray-500 dark:text-gray-400 capitalize">
              {key.replace(/_/g, ' ')}:
            </span>
            <span className="text-sm font-medium text-right text-gray-700 dark:text-gray-300 max-w-[60%]">
              {formatValue(value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NodeTooltip; 