import { Fragment, useState, useEffect } from 'react';
import { GraphNode, ConnectedNode } from '@/types/graph';
import { getConnectedNodes, getBgColorClassForType, getIconForNodeType } from '@/lib/graphUtils';
import { ScrollArea } from '@/components/ui/scroll-area';
import sampleData from '@/lib/graphUtils';

interface DetailPanelProps {
  selectedNode: GraphNode | null;
  onClose: () => void;
}

export default function DetailPanel({ selectedNode, onClose }: DetailPanelProps) {
  // State for connected nodes
  const [connections, setConnections] = useState<ConnectedNode[]>([]);
  
  // Get connected nodes when the selected node changes
  useEffect(() => {
    if (!selectedNode) {
      setConnections([]);
      return;
    }
    
    // Get connected nodes from the selected node
    const connected = getConnectedNodes(selectedNode.id, sampleData);
    setConnections(connected);
  }, [selectedNode]);

  if (!selectedNode) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 hidden lg:block overflow-y-auto">
        <div className="p-6">
          <div className="text-center py-12 text-gray-500">
            <i className="ri-cursor-fill text-4xl mb-2"></i>
            <p>Select a node to view details</p>
          </div>
        </div>
      </div>
    );
  }

  const nodeType = selectedNode.type;
  const bgColorClass = getBgColorClassForType(nodeType);
  const iconClass = getIconForNodeType(nodeType);

  return (
    <div className="w-80 bg-white border-l border-gray-200 hidden lg:block">
      <ScrollArea className="h-full">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className={`h-10 w-10 rounded-full ${bgColorClass} flex items-center justify-center text-white flex-shrink-0`}>
              <i className={`${iconClass} text-xl`}></i>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-gray-900">{selectedNode.label}</h3>
              <div className="flex items-center text-sm text-gray-500">
                <span>{selectedNode.type}</span>
                <span className="mx-2">•</span>
                <span>{selectedNode.id}</span>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-4 mt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Properties</h4>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="grid grid-cols-2 gap-2">
                {!selectedNode.properties || Object.keys(selectedNode.properties).length === 0 ? (
                  <div className="text-xs text-gray-500 col-span-2">No properties</div>
                ) : (
                  Object.entries(selectedNode.properties).map(([key, value]) => (
                    <Fragment key={key}>
                      <div className="text-xs text-gray-500">{key}</div>
                      <div className="text-xs font-mono">{String(value)}</div>
                    </Fragment>
                  ))
                )}
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-4 mt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Connected Nodes</h4>
            <div className="space-y-2">
              {connections.length === 0 ? (
                <div className="text-xs text-gray-500 p-2">No connections</div>
              ) : (
                connections.map((connection, idx) => {
                  const connectedNode = connection.node;
                  const connectType = connectedNode.type;
                  const connectColor = getBgColorClassForType(connectType);
                  const connectIcon = getIconForNodeType(connectType);
                  
                  return (
                    <div key={idx} className="flex items-center p-2 rounded-md bg-gray-50 hover:bg-gray-100">
                      <div className={`h-6 w-6 rounded-full ${connectColor} flex items-center justify-center text-white flex-shrink-0`}>
                        <i className={`${connectIcon} text-xs`}></i>
                      </div>
                      <div className="ml-2 flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <p className="text-sm font-medium text-gray-900 truncate">{connectedNode.label}</p>
                          <span className="text-xs text-gray-500">{connectedNode.type}</span>
                        </div>
                        <p className="text-xs text-gray-500">
                          via: {connection.edge.label} {connection.isOutgoing ? '→' : '←'}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
