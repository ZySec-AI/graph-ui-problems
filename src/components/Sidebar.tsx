import React from 'react';
import { GraphData } from '../types/graph';
import { ZoomIn, ZoomOut, RotateCcw, Filter, Layers } from 'lucide-react';

interface SidebarProps {
  data: GraphData;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ data, onZoomIn, onZoomOut, onReset }) => {
  // Get unique groups
  const groups = Array.from(new Set(data.nodes.map(node => node.group).filter(Boolean)));
  
  // Get unique node types
  const nodeTypes = Array.from(new Set(data.nodes.map(node => node.type)));
  
  return (
    <div className="bg-white border-r border-gray-200 w-64 p-4 flex flex-col h-full">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Controls</h2>
        <div className="flex space-x-2">
          <button 
            onClick={onZoomIn}
            className="p-2 rounded hover:bg-gray-100 transition-colors"
            title="Zoom In"
          >
            <ZoomIn size={20} />
          </button>
          <button 
            onClick={onZoomOut}
            className="p-2 rounded hover:bg-gray-100 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut size={20} />
          </button>
          <button 
            onClick={onReset}
            className="p-2 rounded hover:bg-gray-100 transition-colors"
            title="Reset View"
          >
            <RotateCcw size={20} />
          </button>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-gray-800">Groups</h2>
          <button className="text-xs flex items-center text-indigo-600 hover:text-indigo-800">
            <Filter size={14} className="mr-1" />
            Filter
          </button>
        </div>
        <div className="space-y-2">
          {groups.map(group => (
            <div key={group} className="flex items-center text-sm">
              <span className="w-3 h-3 rounded-full bg-indigo-500 mr-2"></span>
              <span>{group}</span>
              <span className="ml-auto text-gray-500 text-xs">
                {data.nodes.filter(n => n.group === group).length}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-gray-800">Node Types</h2>
          <button className="text-xs flex items-center text-indigo-600 hover:text-indigo-800">
            <Layers size={14} className="mr-1" />
            Toggle
          </button>
        </div>
        <div className="space-y-2">
          {nodeTypes.map(type => {
            // Find a node with this type to get its color
            const nodeWithType = data.nodes.find(n => n.type === type);
            const color = nodeWithType?.style.color || '#888';
            
            return (
              <div key={type} className="flex items-center text-sm">
                <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: color }}></span>
                <span className="ml-2">{type}</span>
                <span className="ml-auto text-gray-500 text-xs">
                  {data.nodes.filter(n => n.type === type).length}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="mt-auto pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-500">
          <div className="flex justify-between mb-1">
            <span>Nodes:</span>
            <span>{data.nodes.length}</span>
          </div>
          <div className="flex justify-between">
            <span>Edges:</span>
            <span>{data.edges.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;