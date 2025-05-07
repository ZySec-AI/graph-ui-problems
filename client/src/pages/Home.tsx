import { useState, useRef, useEffect } from "react";
import TopNavbar from "@/components/TopNavbar";
import Sidebar from "@/components/Sidebar";
import Graph3DViewer from "@/components/Graph3DViewer";
import GraphViewer from "@/components/GraphViewer";
import DetailPanel from "@/components/DetailPanel";
import ImportModal from "@/components/ImportModal";
import { useToast } from "@/hooks/use-toast";
import { useGraph } from "@/hooks/useGraph";
import { Button } from "@/components/ui/button";
import cytoscape from 'cytoscape';

export default function Home() {
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [is3DMode, setIs3DMode] = useState(true);
  const cyRef = useRef<any>(null);
  const { toast } = useToast();
  
  const {
    graphData,
    loadGraph,
    selectedNode,
    setSelectedNode,
    activeFilters,
    setActiveFilters,
    groupBy,
    setGroupBy,
    layout,
    setLayout,
    searchTerm,
    setSearchTerm
  } = useGraph();
  
  const handleImportGraph = async (jsonData: string) => {
    try {
      const parsedData = JSON.parse(jsonData);
      loadGraph(parsedData);
      setImportModalOpen(false);
      toast({
        title: "Graph imported successfully",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Error importing graph",
        description: error instanceof Error ? error.message : "Invalid JSON format",
        variant: "destructive"
      });
    }
  };
  
  const handleExportImage = () => {
    if (!cyRef.current) return;
    
    try {
      if (is3DMode) {
        // For 3D mode, take a screenshot
        const canvas = document.querySelector('canvas');
        if (!canvas) {
          throw new Error("Cannot find canvas element");
        }
        
        // Create a download link for the canvas
        canvas.toBlob((blob) => {
          if (!blob) {
            throw new Error("Failed to create blob from canvas");
          }
          
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'graph-export-3d.png';
          a.click();
          
          // Clean up
          URL.revokeObjectURL(url);
          
          toast({
            title: "3D Graph exported successfully",
            variant: "default"
          });
        });
      } else {
        // For 2D mode, use Cytoscape's export
        const png = cyRef.current.png({
          output: 'blob',
          bg: '#111827', // Dark background
          full: true,
          scale: 2.0
        });
        
        // Create a download link
        const url = URL.createObjectURL(png);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'graph-export-2d.png';
        a.click();
        
        // Clean up
        URL.revokeObjectURL(url);
        
        toast({
          title: "2D Graph exported successfully",
          variant: "default"
        });
      }
    } catch (error) {
      toast({
        title: "Failed to export graph",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <TopNavbar 
        onFileImport={() => setImportModalOpen(true)} 
        searchTerm={searchTerm}
        onSearch={setSearchTerm}
      />
      
      <div className="fixed top-20 right-6 z-20 animate-slide-in">
        <Button
          className={`btn-modern ${is3DMode ? 'bg-gradient-to-r from-indigo-600 to-violet-600' : 'bg-gradient-to-r from-gray-600 to-gray-700'} text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105`}
          onClick={() => setIs3DMode(!is3DMode)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 animate-float" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
            <line x1="12" y1="22.08" x2="12" y2="12"></line>
          </svg>
          <span className={is3DMode ? 'gradient-text' : ''}>{is3DMode ? '3D Mode' : '2D Mode'}</span>
        </Button>
      </div>

      <main className="flex-1 flex overflow-hidden">
        {isSidebarVisible && (
          <Sidebar 
            graphData={graphData} 
            filters={activeFilters}
            onFilterChange={setActiveFilters}
            groupBy={groupBy}
            onGroupChange={setGroupBy}
            layout={layout}
            onLayoutChange={setLayout}
            onResetView={() => {
              if (cyRef && cyRef.current) {
                if (is3DMode) {
                  // 3D viewer reset view function (zoomToFit)
                  cyRef.current.zoomToFit(400, 40);
                } else {
                  // 2D viewer reset view function
                  cyRef.current.fit();
                  cyRef.current.zoom(1);
                  cyRef.current.center();
                }
              }
            }}
            onExportImage={handleExportImage}
          />
        )}
        
        {is3DMode ? (
          <Graph3DViewer 
            graphData={graphData}
            filters={activeFilters}
            searchTerm={searchTerm}
            onNodeSelect={setSelectedNode}
            cyRef={cyRef}
          />
        ) : (
          <GraphViewer 
            graphData={graphData}
            filters={activeFilters}
            groupBy={groupBy}
            layout={layout}
            searchTerm={searchTerm}
            onNodeSelect={setSelectedNode}
            toggleSidebar={() => setIsSidebarVisible(!isSidebarVisible)}
            cyRef={cyRef}
          />
        )}
        
        <DetailPanel 
          selectedNode={selectedNode} 
          onClose={() => setSelectedNode(null)}
        />
      </main>
      
      <footer className="glass-panel backdrop-blur-md border-t border-white/10 py-2 px-4 text-center text-sm text-white/60">
        Graph Crafter - Powered by ZySec AI
      </footer>
      
      <ImportModal 
        isOpen={importModalOpen} 
        onClose={() => setImportModalOpen(false)}
        onImport={handleImportGraph}
      />
    </div>
  );
}
