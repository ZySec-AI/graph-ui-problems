import { Fragment, useState, useEffect } from 'react';
import { GraphNode, ConnectedNode } from '@/types/graph';
import { getConnectedNodes, getBgColorClassForType, getIconForNodeType } from '@/lib/graphUtils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import sampleData from '@/lib/graphUtils';

interface DetailPanelProps {
  selectedNode: GraphNode | null;
  onClose: () => void;
}

export default function DetailPanel({ selectedNode, onClose }: DetailPanelProps) {
  // State for connected nodes
  const [connections, setConnections] = useState<ConnectedNode[]>([]);
  const [visible, setVisible] = useState(false);
  
  // Get connected nodes when the selected node changes
  useEffect(() => {
    if (!selectedNode) {
      setConnections([]);
      setVisible(false);
      return;
    }
    
    // First hide panel, then update data, then show it with animation
    setVisible(false);
    
    setTimeout(() => {
      // Get connected nodes from the selected node
      const connected = getConnectedNodes(selectedNode.id, sampleData);
      setConnections(connected);
      
      // Show panel after data is updated
      setTimeout(() => {
        setVisible(true);
      }, 50);
    }, 300);
  }, [selectedNode]);

  if (!selectedNode) {
    return (
      <div className="w-80 glass-panel backdrop-blur-md border-l border-white/10 hidden lg:block overflow-y-auto transform transition-transform duration-300 ease-in-out">
        <div className="p-6">
          <div className="text-center py-12 text-gray-300 animate-fade-in">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
            <p className="text-white/70">Select a node to view details</p>
          </div>
        </div>
      </div>
    );
  }

  const nodeType = selectedNode.type;
  const bgColorClass = getBgColorClassForType(nodeType);
  const iconClass = getIconForNodeType(nodeType);

  return (
    <div className={`w-80 glass-panel backdrop-blur-md border-l border-white/10 hidden lg:block transform transition-all duration-500 ease-in-out ${visible ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`}>
      <div className="absolute top-3 right-3">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-7 w-7 rounded-full text-gray-300 hover:text-white hover:bg-white/10"
          onClick={onClose}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </Button>
      </div>
      <ScrollArea className="h-full">
        <div className="p-6">
          <div className="flex items-start mb-6 animate-slide-in" style={{ animationDelay: '100ms' }}>
            <div className={`h-12 w-12 rounded-lg ${bgColorClass} flex items-center justify-center text-white flex-shrink-0`}>
              <i className={`${iconClass} text-2xl`}></i>
            </div>
            <div className="ml-4">
              <h3 className="text-xl font-bold text-white/90 mb-1">{selectedNode.label}</h3>
              <div className="flex items-center text-sm">
                <Badge variant="outline" className="text-xs font-medium bg-white/5 text-white/70 border-white/10 mr-2">
                  {selectedNode.type}
                </Badge>
                <span className="text-white/50 text-xs">{selectedNode.id}</span>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-5 mt-5 animate-slide-in" style={{ animationDelay: '200ms' }}>
            <h4 className="text-sm font-semibold text-white/90 mb-3 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-white/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7c-2 0-3 1-3 3z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h8M8 14h6" />
              </svg>
              Properties
            </h4>
            <div className="bg-white/5 backdrop-blur-md rounded-lg p-4 border border-white/10">
              <div className="grid grid-cols-2 gap-3">
                {!selectedNode.properties || Object.keys(selectedNode.properties).length === 0 ? (
                  <div className="text-xs text-white/50 col-span-2 italic">No properties available</div>
                ) : (
                  Object.entries(selectedNode.properties).map(([key, value], index) => (
                    <Fragment key={key}>
                      <div className="text-xs text-white/50">{key}</div>
                      <div className="text-xs font-mono text-white/90">{String(value)}</div>
                    </Fragment>
                  ))
                )}
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-5 mt-5 animate-slide-in" style={{ animationDelay: '300ms' }}>
            <h4 className="text-sm font-semibold text-white/90 mb-3 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-white/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6L18 18M12 3C7.59 3 4 6.59 4 11c0 1.5.5 3.5 2 5L12 22 20 16c1.5-1.5 2-3.5 2-5 0-4.41-3.59-8-8-8z" />
              </svg>
              Connected Nodes
            </h4>
            <div className="space-y-2">
              {connections.length === 0 ? (
                <div className="text-xs text-white/50 p-3 bg-white/5 rounded-lg border border-white/10 backdrop-blur-md italic">
                  No connections found
                </div>
              ) : (
                connections.map((connection, idx) => {
                  const connectedNode = connection.node;
                  const connectType = connectedNode.type;
                  const connectColor = getBgColorClassForType(connectType);
                  const connectIcon = getIconForNodeType(connectType);
                  
                  return (
                    <div 
                      key={idx} 
                      className="flex items-center p-3 rounded-lg bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all duration-200 animate-slide-in" 
                      style={{ animationDelay: `${400 + idx * 50}ms` }}
                    >
                      <div className={`h-8 w-8 rounded-lg ${connectColor} flex items-center justify-center text-white flex-shrink-0`}>
                        <i className={`${connectIcon} text-sm`}></i>
                      </div>
                      <div className="ml-3 flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <p className="text-sm font-medium text-white/90 truncate">{connectedNode.label}</p>
                          <Badge variant="outline" className="text-[10px] h-5 font-medium bg-white/5 text-white/70 border-white/10">
                            {connectedNode.type}
                          </Badge>
                        </div>
                        <p className="text-xs text-white/50 mt-0.5 flex items-center">
                          <span className="mr-1">via:</span>
                          <span className="font-medium text-white/70">{connection.edge.label}</span>
                          <span className="mx-1 text-white/70">{connection.isOutgoing ? '→' : '←'}</span>
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
