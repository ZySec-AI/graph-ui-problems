// Sidebar component that provides the main navigation and control interface for the graph visualization
// Includes graph input, search, metadata, and responsive layout management
import React, { useEffect, useState } from 'react';
import type { GraphData } from '../types/graph';
import GraphInput from './GraphInput';
import GraphMetadata from './GraphMetadata';
import NodeSearch from './NodeSearch';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import TimelineOutlinedIcon from '@mui/icons-material/TimelineOutlined';
import Graph from './Graph';

interface SidebarProps {
  onClose: () => void; // Callback for closing the sidebar
  onLoadGraph: (data: GraphData) => void; // Callback for loading new graph data
  onError?: (msg: string) => void; // Optional error handling callback
  currentGraph?: GraphData | null; // Currently loaded graph data
  sidebarOpen: boolean; // Controls sidebar visibility
  setSidebarOpen: (open: boolean) => void; // Toggle sidebar visibility
  layoutDirection: 'LR' | 'TB'; // Graph layout direction (Left-Right or Top-Bottom)
  setLayoutDirection: (direction: 'LR' | 'TB') => void; // Update layout direction
}

const Sidebar: React.FC<SidebarProps> = ({
  onClose,
  onLoadGraph,
  onError,
  currentGraph,
  sidebarOpen,
  setSidebarOpen,
  layoutDirection,
  setLayoutDirection,
}) => {
  // Track screen size for responsive behavior
  const [isMediumScreen, setIsMediumScreen] = useState(false);

  // Handle responsive layout changes
  useEffect(() => {
    const setMediumScreenSize = () => {
      setIsMediumScreen(window.innerWidth < 768); // Medium screen breakpoint
    };

    setMediumScreenSize();
    window.addEventListener('resize', setMediumScreenSize);
    return () => window.removeEventListener('resize', setMediumScreenSize);
  }, []);

  return (
    <aside
      className={`relative w-full h-full flex flex-col overflow-y-auto md:w-80 sidebar-scroll transition-all duration-300 ease-in-out`}
    >
      <div className="p-4 space-y-4">
        {/* Graph Input Section */}
        {/* Allows users to input or upload graph data */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <GraphInput
            onClose={onClose}
            onLoadGraph={onLoadGraph as (data: GraphData | null) => void}
            onError={onError}
          />
        </div>

        {/* Node Search Section */}
        {/* Provides search functionality when a graph is loaded */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          {currentGraph ? (
            <NodeSearch currentGraph={currentGraph || null} />
          ) : (
            // Placeholder when no graph is loaded
            <div className="flex flex-col items-center justify-center text-gray-400 min-h-[200px] space-y-3">
              <SearchOutlinedIcon
                fontSize="large"
                style={{ fontSize: 64 }}
                className="text-gray-300"
              />
              <p className="text-center">Load a graph to enable search</p>
            </div>
          )}
        </div>

        {/* Graph Metadata Section */}
        {/* Displays graph statistics and information */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          {currentGraph ? (
            <GraphMetadata graph={currentGraph} />
          ) : (
            // Placeholder when no graph is loaded
            <div className="flex flex-col items-center justify-center text-gray-400 min-h-[200px] space-y-3">
              <svg
                className="w-12 h-12 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              <p className="text-center">Load a graph to view metadata</p>
            </div>
          )}
        </div>

        {/* Mobile Graph View Section */}
        {/* Shows graph visualization on mobile devices */}
        <div className="relative transition-all duration-300 flex-1 block md:hidden">
          {/* Toggle button for mobile sidebar */}
          {!sidebarOpen && !isMediumScreen && (
            <button
              className="absolute top-8 left-8 z-50 transition-all duration-300 ease-in-out bg-white backdrop-blur-sm px-2 py-2 rounded-lg shadow-sm border border-gray-100 text-sm text-gray-600 flex items-center gap-2"
              onClick={() => setSidebarOpen(true)}
            >
              <MenuOutlinedIcon fontSize="small" />
            </button>
          )}

          {/* Graph visualization or placeholder */}
          {currentGraph ? (
            <Graph
              rawData={currentGraph}
              layoutDirection={layoutDirection}
              setLayoutDirection={setLayoutDirection}
              isSidebarOpen={sidebarOpen}
            />
          ) : (
            // Placeholder when no graph is loaded
            <div className="w-full bg-gray-100 h-full border-gray-300 flex flex-col overflow-y-auto shadow-md rounded-lg space-y-4">
              <div className="w-full h-full relative bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 text-gray-400 min-h-[200px] space-y-2 flex flex-col items-center justify-center">
                <TimelineOutlinedIcon
                  fontSize="large"
                  style={{ fontSize: 64 }}
                  className="dark:text-gray-300"
                />
                <p className="text-center">Paste or upload JSON to render the graph.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
