import React, { useState } from 'react';
import { Search, ZoomIn, ZoomOut, RefreshCw, MoreHorizontal } from 'lucide-react';

interface ControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  onSearch: (term: string) => void;
}

const Controls: React.FC<ControlsProps> = ({ onZoomIn, onZoomOut, onReset, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };
  
  return (
    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white rounded-full shadow-lg px-2 py-1 flex items-center z-10">
      <form onSubmit={handleSearchSubmit} className="flex items-center mr-2">
        <div className="relative">
          <input
            type="text"
            placeholder="Search nodes..."
            className="pl-8 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm w-40 md:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search size={16} className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        <button type="submit" className="sr-only">Search</button>
      </form>
      
      <div className="h-6 w-px bg-gray-300 mx-1"></div>
      
      <button
        onClick={onZoomIn}
        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        title="Zoom In"
      >
        <ZoomIn size={18} />
      </button>
      
      <button
        onClick={onZoomOut}
        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        title="Zoom Out"
      >
        <ZoomOut size={18} />
      </button>
      
      <button
        onClick={onReset}
        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        title="Reset View"
      >
        <RefreshCw size={18} />
      </button>
      
      <div className="h-6 w-px bg-gray-300 mx-1"></div>
      
      <button
        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        title="More Options"
      >
        <MoreHorizontal size={18} />
      </button>
    </div>
  );
};

export default Controls;