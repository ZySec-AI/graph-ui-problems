import { useState, useRef } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { ChartNetwork } from "lucide-react";
import GraphView from "./components/GraphView";

/**
 * App Component
 * 
 * The main container for the Graph Crafter application.
 * 
 * Responsibilities:
 * - Manages the global state for graph data, sidebar visibility, and search term.
 * - Holds a ref to the Cytoscape instance for controlling the graph visualization.
 * - Renders the Navbar, Sidebar, and main graph visualization area.
 * - Controls the sidebar open/close behavior including an overlay for mobile view.
 * - Passes data and handlers down to child components to enable interactivity.
 * - Displays a placeholder message when no graph data is loaded.
*/

function App() {
  const cyInstanceRef = useRef(null);                       // Reference to Cytoscape instance to enable control from other components
  const [search, setSearch] = useState("");
  const [graphData, setGraphData] = useState(null);         // Holds the graph data loaded by the user
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const onCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleClear = () => {
    setGraphData(null);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar
        toggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        isSidebarOpen={isSidebarOpen}
      />

      <div className="flex flex-1 bg-gray-900 overflow-hidden min-h-0 relative">
        {/* Sidebar */}
        <div
          className={`z-20 transition-transform duration-300 fixed lg:static h-full ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 overflow-y-auto custom-scrollbar`}
        >
          <Sidebar
            onDataLoad={setGraphData}
            handleClear={handleClear}
            setSearch={setSearch}
            cyInstance={cyInstanceRef}
            onCloseSidebar={onCloseSidebar}
          />
        </div>

        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black opacity-50 z-10 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <div className="flex-1 m-3 rounded-md bg-gradient-to-r from-gray-800 to-slate-800 border overflow-auto min-h-0">
          {graphData ? (
            <GraphView data={graphData} search={search} cyInstance={cyInstanceRef} />
          ) : (
            <div className="flex flex-col justify-center items-center h-full text-center">
              <h2 className="text-3xl font-semibold text-gray-300 flex items-center gap-2">
                <ChartNetwork size={40} className="text-blue-500" />
                JSON-2-Graph
              </h2>
              <span className="mt-4 text-white">
                Upload or paste JSON to visualize your data.
              </span>
              <span className="mt-4 text-gray-400 text-4xl">
                ¯\_(ツ)_/¯
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
