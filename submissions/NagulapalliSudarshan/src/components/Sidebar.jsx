import React, { useState } from "react";
import { Upload, Trash2, Zap, CheckCircle2 } from "lucide-react";

const Sidebar = ({ onDataLoad }) => {
  const [activeTab, setActiveTab] = useState("File Upload");
  const [rawText, setRawText] = useState("");
  const [error, setError] = useState("");
  const [jsonLoaded, setJsonLoaded] = useState(false); // NEW STATE

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        onDataLoad(json);
        setRawText(JSON.stringify(json, null, 2)); // show in textarea too
        setError("");
        setJsonLoaded(true);
      } catch {
        setError("❌ Invalid JSON in file.");
        setJsonLoaded(false);
      }
    };
    reader.readAsText(file);
  };

  const handleTextSubmit = () => {
    try {
      const json = JSON.parse(rawText);
      onDataLoad(json);
      setError("");
      setJsonLoaded(true);
    } catch {
      setError("❌ Invalid JSON in editor.");
      setJsonLoaded(false);
    }
  };

  const clearInput = () => {
    setRawText("");
    setError("");
    setJsonLoaded(false);
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
    setJsonLoaded(true);
  };

  return (
    <div className="w-[26rem] bg-slate-900 h-full text-white p-6 border-r border-slate-800 overflow-y-auto">
      <div className="shadow-[7px_8px_0px_0px_#12171f] rounded">
        <h2 className="text-xl text-white mb-4 bg-gradient-to-r from-gray-800 to-slate-800 w-full border-transparent pt-4 px-2 pb-2 rounded-t-xl">Graph Input</h2>
        <div className="p-2">

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
            <div className="space-y-2">
              {jsonLoaded && (
                <div className="text-green-500 flex items-center justify-end gap-1 text-sm">
                  <CheckCircle2 size={16} />
                  JSON Loaded
                </div>
              )}

              <textarea
                rows={12}
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="Paste your JSON here..."
                className={`w-full text-sm px-4 py-3 text-gray-200 bg-slate-800 border ${
                  jsonLoaded ? "border-green-500" : "border-slate-700"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-grey-500 resize-none`}
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
            <div className="space-y-6 relative">
              <div className={`relative h-60 border-2 border-dashed ${jsonLoaded ? "border-green-500" : "border-slate-600"} rounded-lg p-6 text-center flex flex-col items-center justify-center gap-2`}>
                <Upload className={`text-${jsonLoaded ? "green" : "slate"}-400`} size={36} />
                <p className="text-sm text-slate-400 mb-4">
                  Drag and drop your JSON file or
                </p>
                {jsonLoaded && (
                  <div className="absolute top-2 right-2 flex items-center text-green-500 text-sm">
                    <CheckCircle2 size={16} />
                    <span className="ml-1">JSON Loaded</span>
                  </div>
                )}
                <input
                  type="file"
                  id="jsonFileInput"
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
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 text-red-500 text-sm font-medium">{error}</div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
