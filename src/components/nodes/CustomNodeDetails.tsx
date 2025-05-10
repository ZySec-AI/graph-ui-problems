import { memo } from 'react';
import type { Node as AppNode } from '../../types/graph';

interface CustomNodeDetailsProps {
  node: AppNode;
  onClose: () => void;
}

const CustomNodeDetails = ({ node, onClose }: CustomNodeDetailsProps) => {
  return (
    <div className="absolute top-4 right-4 w-80 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 transform transition-all duration-300 ease-in-out z-50">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-bold mb-2 text-gray-800 dark:text-white">{node.label}</h3>
        <button 
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          onClick={onClose}
          aria-label="Close details"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div className="flex items-center mb-3">
        <span className="inline-block w-3 h-3 rounded-full mr-2" style={{ backgroundColor: node.style.color }}></span>
        <p className="text-sm text-gray-600 dark:text-gray-300">{node.type}</p>
      </div>
      
      <div className="space-y-1 bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-white">Properties:</h4>
        {Object.entries(node.properties).map(([key, value]) => (
          <div key={key} className="text-xs py-1 border-t border-gray-100 dark:border-gray-600">
            <span className="font-medium text-gray-700 dark:text-gray-300">{key}:</span>{' '}
            <span className="text-gray-600 dark:text-gray-400">{String(value)}</span>
          </div>
        ))}
      </div>
      
      {node.group && (
        <div className="mt-3 p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-md">
          <span className="text-xs font-medium text-indigo-700 dark:text-indigo-300">Group:</span>{' '}
          {node.group}
        </div>
      )}
      
      <div className="mt-4 flex justify-end">
        <button 
          className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded text-xs hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default memo(CustomNodeDetails); 