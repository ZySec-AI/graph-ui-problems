import React from 'react';

const StatisticsPanel = ({ data }) => {
  return (
    <div className="mt-4 p-4 bg-gray-800 rounded-lg shadow-md">
      <h3 className="font-bold text-white text-lg mb-2">Graph Statistics</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-100 p-3 rounded-md">
          <div className="text-sm font-medium text-gray-700">Nodes</div>
          <div className="text-xl font-bold">{data?.nodes?.length || 0}</div>
        </div>
        <div className="bg-gray-50 p-3 rounded-md">
          <div className="text-sm font-medium text-gray-700">Edges</div>
          <div className="text-xl font-bold">{data?.edges?.length || 0}</div>
        </div>
      </div>
      {data?.nodes && data.nodes.length > 0 && (
        <div className="mt-4">
          <h4 className="font-medium text-slate-300 text-sm mb-1">Node Types</h4>
          <div className="flex flex-wrap gap-2">
            {[...new Set(data.nodes.map(node => node.type))].map(type => (
              <span key={type} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                {type}
              </span>
            ))}
          </div>
        </div>
      )}
      {data?.nodes && data.nodes.length > 0 && (
        <div className="mt-4">
          <h4 className="font-medium text-white text-sm mb-1">Groups</h4>
          <div className="flex flex-wrap gap-2">
            {[...new Set(data.nodes.map(node => node.group))].map(group => (
              <span key={group} className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                {group}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StatisticsPanel;