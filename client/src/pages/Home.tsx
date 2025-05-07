import { useState } from "react";
import TopNavbar from "@/components/TopNavbar";
import Sidebar from "@/components/Sidebar";
import GraphViewer from "@/components/GraphViewer";
import DetailPanel from "@/components/DetailPanel";
import ImportModal from "@/components/ImportModal";
import { useToast } from "@/hooks/use-toast";
import { useGraph } from "@/hooks/useGraph";

export default function Home() {
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
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

  return (
    <div className="flex flex-col h-screen">
      <TopNavbar 
        onFileImport={() => setImportModalOpen(true)} 
        searchTerm={searchTerm}
        onSearch={setSearchTerm}
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
            onResetView={() => {
              // This will be handled by the GraphViewer component
            }}
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
        />
        
        <DetailPanel 
          selectedNode={selectedNode} 
          onClose={() => setSelectedNode(null)}
        />
      </main>
      
      <footer className="bg-white border-t border-gray-200 py-2 px-4 text-center text-sm text-gray-500">
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
