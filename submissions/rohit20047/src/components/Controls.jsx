import React from 'react';
import { ZoomIn, ZoomOut, Move } from 'lucide-react';

const Controls = ({ layout, onLayoutChange, onZoomIn, onZoomOut, onResetView }) => {
  return (
    <div className="flex mt-3 space-x-2">
      <div>
        <label className="text-sm font-medium text-gray-300 mr-2">Layout:</label>
        <select 
          className="border rounded py-1 px-2 text-sm bg-gray-50"
          value={layout}
          onChange={(e) => onLayoutChange(e.target.value)}
        >
          <option value="force">Force-directed</option>
          <option value="circle">Circular</option>
          <option value="grid">Grid</option>
        </select>
      </div>
      <div className="flex space-x-1">
        <button 
          className="p-1 bg-gray-200 hover:bg-gray-200 rounded transition-colors"
          onClick={onZoomIn}
          title="Zoom In"
        >
          <ZoomIn size={16} />
        </button>
        <button 
          className="p-1 bg-gray-200 hover:bg-gray-300 rounded transition-colors"
          onClick={onZoomOut}
          title="Zoom Out"
        >
          <ZoomOut size={16} />
        </button>
        <button 
          className="p-1 bg-gray-200 hover:bg-gray-300 rounded transition-colors"
          onClick={onResetView}
          title="Reset View"
        >
          <Move size={16} />
        </button>
      </div>
    </div>
  );
};

export default Controls;