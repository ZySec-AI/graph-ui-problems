// NodeSearch component that provides node search functionality with history tracking
// Supports case-insensitive search, partial matches, and temporary node highlighting
import React, { useState } from 'react';
import type { GraphData } from '../types/graph';
import { useNodeHighlightStore } from '../store/nodeHighlightStore';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';

interface NodeSearchProps {
  currentGraph: GraphData | null;
}

const NodeSearch: React.FC<NodeSearchProps> = ({ currentGraph }) => {
  // State management for search functionality
  const [searchQuery, setSearchQuery] = useState(''); // Current search input
  const [searchHistory, setSearchHistory] = useState<string[]>([]); // Recent search terms
  const { highlightNode, clearHighlight } = useNodeHighlightStore();

  // Handle search execution with node highlighting
  const handleSearch = () => {
    if (!currentGraph || !searchQuery.trim()) {
      clearHighlight();
      return;
    }

    const searchTerm = searchQuery.toLowerCase().trim();
    // Find nodes matching the search term
    const matchingNodes = currentGraph.nodes.filter((n) =>
      n.label.toLowerCase().includes(searchTerm)
    );

    // Update search history (keep last 30 terms)
    setSearchHistory((prev) => {
      const newHistory = [searchTerm, ...prev.filter((term) => term !== searchTerm)].slice(0, 30);
      return newHistory;
    });

    if (matchingNodes.length > 0) {
      // Highlight matching nodes for 5 seconds
      matchingNodes.forEach((node) => highlightNode(node.id));
      setTimeout(clearHighlight, 5000);
    } else {
      clearHighlight();
    }
  };

  // Handle clicking on a history term
  const handleHistoryClick = (term: string) => {
    setSearchQuery(term);
    // Trigger search with the selected history term
    setTimeout(() => handleSearch(), 0);
  };

  return (
    <div className="space-y-3">
      {/* Search section header */}
      <div className="flex gap-2 items-center mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
        <SearchOutlinedIcon className="text-gray-500 dark:text-gray-400" />
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Node Search</h2>
      </div>

      {/* Search instructions */}
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
        Search nodes by their labels. The search is case-insensitive and will match partial text.
        Matching nodes will be highlighted for 5 seconds.
      </p>

      {/* Search input and button */}
      <div className="flex flex-wrap gap-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
          placeholder="Enter node label..."
          className="min-w-0 text-sm flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
        />
        <button
          onClick={handleSearch}
          className="shrink-0 text-sm px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded-md hover:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none"
        >
          Search
        </button>
      </div>

      {/* Search history section */}
      {searchHistory.length > 0 && (
        <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
          {/* History header with clear button */}
          <div className="flex items-center justify-between gap-2 mb-4">
            <div className="flex gap-2 items-center">
              <HistoryOutlinedIcon className="text-gray-500 dark:text-gray-400" />
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Recent Searches
              </h3>
            </div>
            <button
              className="px-2 py-1 text-sm bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-700 dark:text-red-400 rounded-md transition-colors whitespace-nowrap"
              onClick={() => setSearchHistory([])}
            >
              Clear
            </button>
          </div>

          {/* History terms with custom scrollbar */}
          <div className="flex flex-wrap gap-2 max-h-[120px] overflow-y-auto pr-2 custom-scrollbar">
            {searchHistory.map((term, index) => (
              <button
                key={index}
                onClick={() => handleHistoryClick(term)}
                className="px-2 py-1 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-300 rounded-md transition-colors whitespace-nowrap"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}
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

export default NodeSearch;
