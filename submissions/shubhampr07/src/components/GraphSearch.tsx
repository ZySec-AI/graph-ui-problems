import { useRef, useState, useEffect } from 'react';
import type { GraphData } from '../types/graph';

interface GraphSearchProps {
  graphData: GraphData | null;
  onSearchResult: (nodeIds: string[]) => void;
}

const GraphSearch = ({ graphData, onSearchResult }: GraphSearchProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [availableTypes, setAvailableTypes] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  

  useEffect(() => {
    if (graphData) {
      const types = Array.from(new Set(graphData.nodes.map(node => node.type)));
      setAvailableTypes(types);
    }
  }, [graphData]);
  
  const handleSearch = () => {
    if (!graphData || !searchTerm.trim()) {
      onSearchResult([]);
      return;
    }
    
    setIsSearching(true);
    
    if (!searchHistory.includes(searchTerm) && searchTerm.trim()) {
      setSearchHistory(prev => [searchTerm, ...prev].slice(0, 5));
    }
    
    setTimeout(() => {
      const term = searchTerm.toLowerCase();
      const matchedNodeIds: string[] = [];
      
      graphData.nodes.forEach(node => {
        // If a type filter is selected, skip nodes of different types
        if (selectedType && node.type !== selectedType) {
          return;
        }
        
        // Check label and type
        if (
          node.label.toLowerCase().includes(term) ||
          node.type.toLowerCase().includes(term)
        ) {
          matchedNodeIds.push(node.id);
          return;
        }
        
        // Check properties
        const propertyValues = Object.values(node.properties);
        for (const value of propertyValues) {
          if (String(value).toLowerCase().includes(term)) {
            matchedNodeIds.push(node.id);
            return;
          }
        }
        
        // Check group if exists
        if (node.group && node.group.toLowerCase().includes(term)) {
          matchedNodeIds.push(node.id);
        }
      });
      
      // Search in edge labels
      graphData.edges.forEach(edge => {
        if (edge.label.toLowerCase().includes(term)) {
          // Add both source and target nodes if the edge label matches
          if (!matchedNodeIds.includes(edge.source)) {
            matchedNodeIds.push(edge.source);
          }
          if (!matchedNodeIds.includes(edge.target)) {
            matchedNodeIds.push(edge.target);
          }
        }
      });
      
      onSearchResult(matchedNodeIds);
      setIsSearching(false);
    }, 300);
  };
  
  const getResultCount = (): number => {
    if (!graphData || !searchTerm.trim()) return 0;
    
    const term = searchTerm.toLowerCase();
    let count = 0;
    
    graphData.nodes.forEach(node => {
      if (selectedType && node.type !== selectedType) {
        return;
      }
      
      if (
        node.label.toLowerCase().includes(term) ||
        node.type.toLowerCase().includes(term) ||
        (node.group && node.group.toLowerCase().includes(term))
      ) {
        count++;
        return;
      }
      
      const propertyValues = Object.values(node.properties);
      for (const value of propertyValues) {
        if (String(value).toLowerCase().includes(term)) {
          count++;
          return;
        }
      }
    });
    
    return count;
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 mb-4 transition-all">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Search Graph
        </h3>
        
        {searchTerm && (
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {isSearching ? 'Searching...' : `${getResultCount()} results found`}
          </span>
        )}
      </div>
      
      <div className="relative flex items-center mb-2">
        <div className="relative flex-grow">
          <input
            ref={inputRef}
            type="text"
            placeholder="Search nodes by label, type, or property..."
            className="w-full pl-10 pr-4 py-2 text-sm text-white border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          
          {searchTerm && (
            <button 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              onClick={() => setSearchTerm('')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        
        <button
          className={`ml-2 px-4 py-2 rounded-lg ${
            isSearching
              ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed text-gray-500 dark:text-gray-400'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
          onClick={handleSearch}
          disabled={isSearching || !searchTerm.trim()}
        >
          {isSearching ? (
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            'Search'
          )}
        </button>
      </div>
      
      {/* Type filters */}
      {availableTypes.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          <button
            className={`px-3 py-1 text-xs rounded-full ${
              selectedType === null
                ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
            onClick={() => setSelectedType(null)}
          >
            All Types
          </button>
          
          {availableTypes.map(type => (
            <button
              key={type}
              className={`px-3 py-1 text-xs rounded-full ${
                selectedType === type
                  ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              onClick={() => setSelectedType(type)}
            >
              {type}
            </button>
          ))}
        </div>
      )}
      
      {/* Recent searches */}
      {searchHistory.length > 0 && (
        <div className="pt-2">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Recent searches:</div>
          <div className="flex flex-wrap gap-1">
            {searchHistory.map((term, index) => (
              <button
                key={index}
                className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center"
                onClick={() => {
                  setSearchTerm(term);
                  if (inputRef.current) {
                    inputRef.current.focus();
                  }
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {term}
              </button>
            ))}
            {searchHistory.length > 0 && (
              <button
                className="text-xs px-2 py-1 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 rounded"
                onClick={() => setSearchHistory([])}
              >
                Clear history
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GraphSearch; 