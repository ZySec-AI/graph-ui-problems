import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import GraphView from "./components/GraphView";

function App() {
  const [graphData, setGraphData] = useState(null);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar />
      <div className="flex flex-1 overflow-hidden bg-gray-900">
        <Sidebar onDataLoad={setGraphData} />
        <div className="flex-1 m-3 rounded-md bg-gray-800 overflow-hidden">
          {graphData ? (
            <GraphView data={graphData} />
          ) : (
            <div className="flex flex-col justify-center items-center h-full text-center">
              <h2 className="text-3xl font-semibold text-gray-300">
                Graph Viewer
              </h2>
              <p className="text-gray-400 mt-2">
                Upload or paste JSON to visualize the graph.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
