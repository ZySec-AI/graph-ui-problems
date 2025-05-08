import React from 'react';

const DetailsPanel = ({ selectedElement }) => {
  const renderPropertyList = (properties) => {
    if (!properties || Object.keys(properties).length === 0) return null;
    return (
      <div className="mt-2">
        <h4 className="text-sm font-semibold text-slate-300">Properties:</h4>
        <ul className="text-xs mt-1">
          {Object.entries(properties).map(([key, value]) => (
            <li key={key} className="flex justify-between text-slate-100">
              <span className="font-medium text-slate-400">{key}:</span> 
              <span className="ml-2 text-slate-400" >{value}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  if (!selectedElement) {
    return <p className="text-gray-200 italic">Click on a node or edge to view details</p>;
  }

  return (
    <div className="text-sm">
      <div className="font-semibold">
        {selectedElement.type === 'node' ? 'Node' : 'Edge'} Details:
      </div>
      <div className="mt-1">
        {selectedElement.type === 'node' ? (
          <>
            <p  className="font-medium text-slate-500"><span className="font-medium text-slate-400">ID:</span> {selectedElement.id}</p>
            <p  className="font-medium text-slate-500"><span className="font-medium  text-slate-400">Label:</span> {selectedElement.label}</p>
            <p  className="font-medium text-slate-500"><span className="font-medium  text-slate-400">Type:</span> {selectedElement.type}</p>
            <p  className="font-medium text-slate-500"><span className="font-medium  text-slate-400">Group:</span> {selectedElement.group}</p>
            {renderPropertyList(selectedElement.properties)}
          </>
        ) : (
          <>
            <p><span className="font-medium">Relationship:</span> {selectedElement.label}</p>
            <p><span className="font-medium">From:</span> {selectedElement.sourceLabel} ({selectedElement.source})</p>
            <p><span className="font-medium">To:</span> {selectedElement.targetLabel} ({selectedElement.target})</p>
            <p><span className="font-medium">Direction:</span> {selectedElement.direction}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default DetailsPanel;