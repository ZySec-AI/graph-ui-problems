import React, { useState } from "react";
import { Upload, Trash2, Zap } from "lucide-react";

const Sidebar = ({ onDataLoad }) => {
  const [activeTab, setActiveTab] = useState("File Upload");
  const [rawText, setRawText] = useState("");
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        onDataLoad(json);
        setError("");
      } catch {
        setError("❌ Invalid JSON in file.");
      }
    };
    reader.readAsText(file);
  };

  const handleTextSubmit = () => {
    try {
      const json = JSON.parse(rawText);
      onDataLoad(json);
      setError("");
    } catch {
      setError("❌ Invalid JSON in editor.");
    }
  };

  const clearInput = () => {
    setRawText("");
    setError("");
  };

  const loadSample = () => {
    const sample = {
      nodes: [
        {
          id: "user_1",
          label: "Alice",
          type: "Person",
          properties: {
            email: "alice@example.com",
            role: "Analyst",
          },
          style: {
            color: "#4CAF50",
            shape: "circle",
          },
          group: "Team A",
        },
        {
          id: "doc_1",
          label: "Report Q1",
          type: "Document",
          properties: {
            created: "2024-03-01",
            status: "approved",
          },
          style: {
            color: "#2196F3",
            shape: "rectangle",
          },
          group: "Documents",
        },
      ],
      edges: [
        {
          source: "user_1",
          target: "doc_1",
          label: "authored",
          direction: "one-way",
          style: {
            dashed: false,
            color: "#555",
          },
        },
      ],
      meta: {
        title: "Knowledge Graph - Access Control",
        description:
          "Sample graph representing users, documents, and policies.",
      },
    };
    setRawText(JSON.stringify(sample, null, 2));
    onDataLoad(sample);
    setError("");
  };

  return (
    <div
      className="w-[26rem] bg-slate-900 h-full text-white p-6 border-r border-slate-800 overflow-y-auto"
    >
      <h2 className="text-xl font-bold text-white mb-4">Graph Input</h2>

      {/* Tabs */}
      <div className="flex mb-2 border-b border-slate-600">
      {["JSON Data", "File Upload"].map((tab) => (
           <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 text-sm font-medium px-3 py-2 rounded-t-md transition-all ${
               activeTab === tab
                ? "bg-blue-950 text-white borde border-b-0 shadow-inner cursor-pointer hover:bg-slate-700"
                 : "bg-slate-900 text-slate-400 cursor-pointer hover:bg-slate-700 hover:text-slate-200"
             }`}
           >
             {tab}
           </button>
         ))}
      </div>

      {/* JSON Editor Tab */}
      {activeTab === "JSON Data" && (
        <div className="space-y-4">
          <textarea
            rows={12}
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            placeholder="Paste your JSON here..."
            className="w-full text-sm px-4 py-3 text-gray-200 bg-slate-800 border border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
          />
          
          
          <button
            onClick={handleTextSubmit}
            className="w-full py-2 bg-blue-900 hover:bg-blue-950 rounded-md text-white flex items-center justify-center gap-2 cursor-pointer"
          >
            <Zap size={16} />
            Apply JSON
          </button>

          <div className="flex gap-2">
            <button
              onClick={loadSample}
              className="w-full py-2 bg-green-600 hover:bg-green-700 rounded-md text-white font-medium cursor-pointer"
            >
              Load Sample Data
            </button>

            <button
              onClick={clearInput}
              className="w-full py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Trash2 size={16} />
              Clear
            </button>
            </div>
        </div>
      )}

      {/* File Upload Tab */}
      {activeTab === "File Upload" && (
        <div className="space-y-6">
          <div className="h-60 border-2 border-dashed border-slate-600 rounded-lg p-6 text-center flex flex-col items-center justify-center gap-2">
            <Upload className="text-slate-400" size={36} />
            <p className="text-sm text-slate-400 mb-4">
              Drag and drop your JSON file or
            </p>
            <input
              type="file"
              id="jsonFileInput"
              // accept=".json,application/json"
              onChange={handleFileChange}
              className="hidden"
            />
            <label htmlFor="jsonFileInput">
              <span className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded font-medium">
                Choose File
              </span>
            </label>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => rawText && handleTextSubmit()}
              className="w-full py-2 bg-blue-900 hover:bg-blue-950 rounded-md text-white flex items-center justify-center gap-2 cursor-pointer"
            >
              <Zap size={16} />
              Apply JSON
            </button>

            <div className="flex gap-2">

              <button
                onClick={loadSample}
                className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium cursor-pointer"
              >
                Load Sample Data
              </button>

              <button
                onClick={clearInput}
                className="w-full py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Trash2 size={16} />
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-4 text-red-500 text-sm font-medium">{error}</div>
      )}
    </div>
  );
};

export default Sidebar;
