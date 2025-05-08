import { useState, useCallback, useRef } from "react";
import GraphVisualization from "./components/GraphVisualization";
import type { GraphData } from "./types";
import sampleData from "./assets/sample_json.json";
import { Upload, InfoIcon } from "lucide-react";
import { useLayoutStore } from "./store/layout";

function App() {
  const [graphData, setGraphData] = useState<GraphData | null>(
    sampleData as unknown as GraphData
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const layoutMode = useLayoutStore(
    (state: { layoutMode: string }) => state.layoutMode
  );
  const toggleLayout = useLayoutStore((state) => state.toggleLayout);

  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target?.result as string);
          if (
            !json.nodes ||
            !json.edges ||
            !Array.isArray(json.nodes) ||
            !Array.isArray(json.edges)
          ) {
            setNotification({
              message: "Please ensure your file contains valid JSON data",
              type: "error",
            });
            throw new Error(
              "Invalid JSON format: Expected 'nodes' and 'edges' as arrays"
            );
          }
          setGraphData(json);
          setNotification({
            message: `Loaded ${json.nodes.length} nodes and ${json.edges.length} edges`,
            type: "success",
          });

          setTimeout(() => setNotification(null), 3000);
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "An unknown error occurred";
          setNotification({
            message: "Please ensure your file contains valid JSON data",
            type: "error",
          });
          console.error("Error parsing JSON:", errorMessage);

          setTimeout(() => setNotification(null), 3000);
        }
      };
      reader.readAsText(file);
    },
    []
  );

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <header className="border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm p-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
            Graph Visualizer
          </h1>
          <p className="text-slate-400 text-sm">
            {graphData?.meta?.title ||
              "Interactive Knowledge Graph Visualization"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleLayout}
            className=" px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 transition-all shadow-lg shadow-emerald-500/20"
          >
            Toggle Layout :{layoutMode === "column" ? "Column" : "Random"}
          </button>

          <button
            onClick={triggerFileUpload}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 transition-all shadow-lg shadow-emerald-500/20"
          >
            <Upload size={16} />
            Load Graph Data
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".json"
            className="hidden"
          />
        </div>
      </header>

      {notification && (
        <div
          className={`px-4 py-2 ${
            notification.type === "success"
              ? "bg-emerald-500/20 text-emerald-200"
              : "bg-red-500/20 text-red-200"
          } border-l-4 ${
            notification.type === "success"
              ? "border-emerald-500"
              : "border-red-500"
          }`}
        >
          {notification.message}
        </div>
      )}

      <main className="flex-1 overflow-hidden relative">
        {graphData ? (
          <GraphVisualization data={graphData} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center p-8 rounded-xl bg-slate-800/50 backdrop-blur-sm border border-slate-700 max-w-md">
              <InfoIcon className="mx-auto mb-4 text-slate-400" size={48} />
              <h2 className="text-xl font-semibold mb-2">
                No Graph Data Loaded
              </h2>
              <p className="text-slate-400 mb-4">
                Upload a JSON file with nodes and edges to visualize your graph.
              </p>
              <button
                onClick={triggerFileUpload}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 transition-all"
              >
                Upload JSON File
              </button>
            </div>
          </div>
        )}
      </main>

      {graphData?.meta?.description && (
        <footer className="p-3 text-sm text-center border-t border-slate-700 bg-slate-800/50 backdrop-blur-sm text-slate-400">
          {graphData.meta.description}
        </footer>
      )}
    </div>
  );
}

export default App;
