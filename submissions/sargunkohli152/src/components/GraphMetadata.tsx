// GraphMetadata component that displays graph information and statistics
// Shows metadata like title, description, and node/edge counts with theme-aware styling
import React from 'react';
import type { GraphData } from '../types/graph';

interface GraphMetadataProps {
  graph: GraphData;
}

const GraphMetadata: React.FC<GraphMetadataProps> = ({ graph }) => {
  const { nodes, edges, meta } = graph;

  return (
    <div className="space-y-4">
      {/* Header section with graph information title */}
      <div className="flex gap-2 items-center pb-2 border-b border-gray-200 dark:border-gray-700">
        <svg
          className="w-5 h-5 text-gray-500 dark:text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Graph Information
        </h3>
      </div>

      {/* Optional metadata display sections */}
      {/* Title section */}
      {meta?.title && (
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
          <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center space-x-1">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Title</span>
          </h4>
          <p className="mt-1 text-gray-700 dark:text-gray-300 text-sm">{meta.title}</p>
        </div>
      )}

      {/* Description section */}
      {meta?.description && (
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
          <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center space-x-1">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
            <span>Description</span>
          </h4>
          <p className="mt-1 text-gray-700 dark:text-gray-300 text-sm">{meta.description}</p>
        </div>
      )}

      {/* Graph statistics section */}
      <div className="grid grid-cols-2 gap-3">
        {/* Node count display */}
        <div className="flex flex-col items-center justify-center bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
              <svg
                className="w-5 h-5 text-blue-500 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-blue-500 dark:text-blue-400">Nodes</p>
              <p className="text-sm font-bold text-blue-500 dark:text-blue-400">{nodes.length}</p>
            </div>
          </div>
        </div>

        {/* Edge count display */}
        <div className="flex flex-col items-center justify-center bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
              <svg
                className="w-5 h-5 text-blue-500 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-blue-500 dark:text-blue-400">Edges</p>
              <p className="text-sm font-bold text-blue-500 dark:text-blue-400">{edges.length}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraphMetadata;
