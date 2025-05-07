import React, { useState, useCallback, useRef } from 'react';
import GraphVisualization from './components/GraphVisualization';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Controls from './components/Controls';
import JsonImport from './components/JsonImport';
import { sampleData } from './data/sample-data';
import { GraphData } from './types/graph';

function App() {
  const [graphData, setGraphData] = useState<GraphData>(sampleData);
  const cyRef = useRef<any>(null);
  const [showImport, setShowImport] = useState(false);
  
  const handleZoomIn = useCallback(() => {
    if (cyRef.current) {
      cyRef.current.zoom({
        level: cyRef.current.zoom() * 1.2,
        renderedPosition: { x: window.innerWidth / 2, y: window.innerHeight / 2 }
      });
    }
  }, []);
  
  const handleZoomOut = useCallback(() => {
    if (cyRef.current) {
      cyRef.current.zoom({
        level: cyRef.current.zoom() * 0.8,
        renderedPosition: { x: window.innerWidth / 2, y: window.innerHeight / 2 }
      });
    }
  }, []);
  
  const handleReset = useCallback(() => {
    if (cyRef.current) {
      cyRef.current.fit();
      cyRef.current.center();
    }
  }, []);
  
  const handleSearch = useCallback((term: string) => {
    if (!cyRef.current || !term) return;
    
    // Reset all elements
    cyRef.current.elements().removeClass('highlighted dimmed');
    
    if (term.trim() === '') return;
    
    // Find matching nodes (case insensitive)
    const query = term.toLowerCase();
    const matching = cyRef.current.nodes().filter((node: any) => {
      const data = node.data();
      return (
        data.label.toLowerCase().includes(query) || 
        data.type.toLowerCase().includes(query) ||
        Object.values(data.properties).some((value: any) => 
          String(value).toLowerCase().includes(query)
        )
      );
    });
    
    if (matching.length > 0) {
      // Highlight matching nodes and their connected edges
      matching.addClass('highlighted');
      matching.connectedEdges().addClass('highlighted');
      
      // Dim other elements
      cyRef.current.elements().not(matching).not(matching.connectedEdges()).addClass('dimmed');
      
      // Center the view on the matching elements
      cyRef.current.fit(matching, 50);
    }
  }, []);
  
  const handleImport = useCallback((data: GraphData) => {
    setGraphData(data);
    setShowImport(false);
  }, []);
  
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header meta={graphData.meta} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          data={graphData}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onReset={handleReset}
        />
        
        <div className="flex-1 relative">
          <GraphVisualization 
            data={graphData} 
            ref={(cy) => { cyRef.current = cy; }}
          />
          
          <Controls 
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onReset={handleReset}
            onSearch={handleSearch}
          />
        </div>
      </div>
      
      {showImport && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <JsonImport onImport={handleImport} />
            <div className="flex justify-end px-4 py-3 bg-gray-50 rounded-b-lg">
              <button 
                onClick={() => setShowImport(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;