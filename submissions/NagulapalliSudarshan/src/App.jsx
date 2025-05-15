import { useState, useRef } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { ChartNetwork } from "lucide-react";
import GraphView from "./components/GraphView";

function App() {
  const cyInstanceRef = useRef(null);
  const [search, setSearch] = useState("");
  const [graphData, setGraphData] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 

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
                Graph Crafter
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
