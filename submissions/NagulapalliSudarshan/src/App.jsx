import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import GraphView from "./components/GraphView";
import { ChartNetwork } from "lucide-react";

function App() {
  const [graphData, setGraphData] = useState(null);

  const handleClear = () => {
    setGraphData(null);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar />
      <div className="flex flex-1 overflow-hidden bg-gray-900">
        <Sidebar onDataLoad={setGraphData} handleClear={handleClear} />
        <div className="flex-1 m-3 rounded-md bg-gradient-to-r from-gray-800 to-slate-800 overflow-hidden border">
          {graphData ? (
            <GraphView data={graphData} />
          ) : (
            <div className="flex flex-col justify-center items-center h-full text-center">
              <h2 className="text-3xl font-semibold text-gray-300 flex items-center gap-2">
                <ChartNetwork size={40} className="text-blue-500" />
                Graph Visualizer
              </h2>
              <span className="mt-4 text-white">
                Upload or paste JSON to visualize the graph.
              </span>
              <span className="mt-2 text-gray-400 text-3xl">
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
