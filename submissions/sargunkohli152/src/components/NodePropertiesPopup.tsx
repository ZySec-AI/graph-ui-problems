// NodePropertiesPopup component that displays detailed information about selected graph nodes
// Shows node properties, type, group, and other metadata with theme-aware styling
import React from 'react';
import { useNodePopupStore } from '../store/nodePopupStore';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const NodePropertiesPopup: React.FC<{ isSidebarOpen: boolean }> = ({ isSidebarOpen }) => {
  // Get selected node state and setter from store
  const { selectedNode, setSelectedNode } = useNodePopupStore();

  // Show instruction message when no node is selected
  if (!selectedNode) {
    return (
      <div
        className={`absolute top-4 ${
          isSidebarOpen ? 'left-4' : 'left-15'
        } z-1 transition-all duration-300 ease-in-out bg-white/90 dark:bg-gray-900 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2`}
      >
        <InfoOutlinedIcon className="text-blue-500 dark:text-blue-400" fontSize="small" />
        Click on a node to view its details
      </div>
    );
  }

  // Extract node data for display
  const { data } = selectedNode;
  const { label, type, group, properties = {} } = data;

  return (
    <div
      className={`absolute top-4 ${
        isSidebarOpen ? 'left-4' : 'left-15'
      } z-50 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 md:w-80 w-50 transition-all duration-300 ease-in-out hover:shadow-xl dark:hover:shadow-gray-800/50 max-h-100 overflow-y-auto`}
    >
      {/* Popup header with title and close button */}
      <div className="flex items-center justify-between p-2 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900 rounded-t-lg">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Node Details</h3>
        <button
          onClick={() => setSelectedNode(null)}
          className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <CloseOutlinedIcon fontSize="small" />
        </button>
      </div>

      {/* Node information content */}
      <div className="p-4 -mt-2">
        <div className="space-y-3">
          {/* Basic node information */}
          <div>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Label</span>
            <p className="text-gray-900 dark:text-gray-100">{label}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Type</span>
            <p className="text-gray-900 dark:text-gray-100">{type}</p>
          </div>

          {/* Optional group information */}
          {group && (
            <div>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Group</span>
              <p className="text-gray-900 dark:text-gray-100">{group}</p>
            </div>
          )}

          {/* Node properties with custom scrollbar */}
          {Object.keys(properties).length > 0 && (
            <div>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Properties
              </span>
              <div className="space-y-1 max-h-[150px] overflow-y-auto custom-scrollbar">
                {Object.entries(properties).map(([key, value]) => (
                  <div key={key} className="flex flex-col">
                    <span className="text-gray-900 dark:text-gray-100">
                      {key}: {String(value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Custom scrollbar styles for both light and dark modes
const styles = `
  /* Light mode scrollbar styles */
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }

  /* Dark mode scrollbar styles */
  @media (prefers-color-scheme: dark) {
    .custom-scrollbar::-webkit-scrollbar-track {
      background: #2d3748;
      border-radius: 3px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: #4a5568;
      border-radius: 3px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: #718096;
    }
  }
`;

// Inject custom scrollbar styles into document
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default NodePropertiesPopup;
