import { useState, useRef } from "react";
import TopNavbar from "@/components/TopNavbar";
import Sidebar from "@/components/Sidebar";
import GraphViewer from "@/components/GraphViewer";
import DetailPanel from "@/components/DetailPanel";
import ImportModal from "@/components/ImportModal";
import { useToast } from "@/hooks/use-toast";
import { useGraph } from "@/hooks/useGraph";
import cytoscape from 'cytoscape';

export default function Home() {
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const cyRef = useRef<cytoscape.Core | null>(null);
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
      // Get PNG image as base64
      const png = cyRef.current.png({
        output: 'blob',
        bg: 'white',
        full: true,
        scale: 2.0
      });
      
      // Create a download link
      const url = URL.createObjectURL(png);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'graph-export.png';
      a.click();
      
      // Clean up
      URL.revokeObjectURL(url);
      
      toast({
        title: "Graph exported successfully",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Failed to export graph",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    }
  };

  return (
    <>
    <div className="flex flex-col h-screen">
      <TopNavbar 
        onFileImport={() => setImportModalOpen(true)} 
        searchTerm={searchTerm}
        onSearch={setSearchTerm}
        onExportImage={handleExportImage}
      />
      
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
          />
        )}
        
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
        
        <DetailPanel 
          selectedNode={selectedNode} 
          onClose={() => setSelectedNode(null)}
        />
      </main>
      
      
      <ImportModal 
        isOpen={importModalOpen} 
        onClose={() => setImportModalOpen(false)}
        onImport={handleImportGraph}
      />
      </div>
      <footer className="bg-white border-t border-gray-200 py-2 px-4 text-center text-sm text-gray-500">
        Graph Crafter - Powered by ZySec AI (Bazuga02)
      </footer>
    </>
  );
}
