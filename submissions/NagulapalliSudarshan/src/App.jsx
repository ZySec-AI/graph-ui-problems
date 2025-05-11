import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import GraphView from "./components/GraphView";

function App() {
  const [graphData, setGraphData] = useState(null);

  return (
    <>
      <Navbar />
      <div className="flex h-screen bg-gray-100">
        <Sidebar onDataLoad={setGraphData} />
        <div className="flex-1 overflow-auto">
          {graphData ? (
            <GraphView data={graphData} />
          ) : (
            <div className="text-center mt-32">
              <h2 className="text-3xl font-semibold text-gray-700">
                Graph Viewer
              </h2>
              <p className="text-gray-500 mt-2">
                Upload or paste JSON to visualize the graph.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
