import React, { useState, useRef } from "react";
import { Upload, Trash2, LogOut, CheckCircle2, FileJson2, Braces, Search, SearchX, CircleX } from "lucide-react";
import  validateJsonStructure from "../utils/JsonValidation";

const Sidebar = ({ onDataLoad, handleClear, setSearch }) => {
  const [activeTab, setActiveTab] = useState("File Upload");
  const [rawText, setRawText] = useState("");
  const [error, setError] = useState("");
  const [jsonLoaded, setJsonLoaded] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const fileInputRef = useRef(null);
  const [ fileName, setFileName ] = useState("");

  const handleSearchChange = e => {
    const val = e.target.value;
    setSearchInput(val);
  };

  const handleFileChange = e => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const fileName = file.name;
        const text = event.target.result;
        
        const result = validateJsonStructure(text);
        if (!result.valid) {
          setError(result.error);
          setJsonLoaded(false);
          return;
        }

        setFileName(fileName);
        const json = JSON.parse(event.target.result);
        onDataLoad(json);
        setRawText(JSON.stringify(json, null, 2));
        setError("");
        setJsonLoaded(true);
      } catch {
        setError("Error occured while file upload :(.");
        setJsonLoaded(false);
      }
    };
    reader.readAsText(file);
  };

  const handleTextSubmit = () => {
    try {
      const result = validateJsonStructure(rawText);
      if (!result.valid) {
        setError(result.error);
        setJsonLoaded(false);
        return;
      }

      const json = JSON.parse(rawText);
      onDataLoad(json);
      setError("");
      setJsonLoaded(true);
    } catch {
      setError("Invalid JSON on submit :(.");
      setJsonLoaded(false);
    }
  };

  const clearInput = () => {
    setRawText("");
    setError("");
    setFileName("");
    setJsonLoaded(false);
    handleClear();
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
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
    setFileName("");
    setJsonLoaded(true);
  };

  return (
    <div className="w-[20rem] sm:w-[25rem] md:w-[25rem] lg:w-[25rem] bg-slate-900 h-full text-white p-6 border-r border-slate-800 overflow-y-auto custom-scrollbar">
      <div className="shadow-[7px_8px_0px_0px_#12171f] border border-slate-800 rounded-xl">
        <h2 className="text-xl text-white mb-4 bg-gradient-to-r from-gray-800 to-slate-800 w-full border-transparent pt-4 px-2 pb-2 rounded-t-xl">Graph Input</h2>
        <div className="p-2">

          {/* Tabs */}
          <div className="flex mb-2 border-b border-slate-600">
            {["JSON Data", "File Upload"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-1/2 text-sm font-medium px-3 py-2 rounded-t-md transition-all ${
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
            <div className="space-y-2 w-full">
              {jsonLoaded && (
                <div className="text-green-500 flex items-center justify-end gap-1 text-sm">
                  <CheckCircle2 size={16} />
                  JSON Loaded
                </div>
              )}

              <textarea
                rows={11}
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="Paste your JSON here..."
                className={`w-full text-sm px-4 py-3 text-gray-200 bg-slate-800 border ${
                  jsonLoaded ? "border-green-500" : "border-slate-700"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-grey-500 resize-none custom-scrollbar`}
              />

              <button
                onClick={handleTextSubmit}
                className="w-full py-2 bg-blue-900 hover:bg-blue-950 rounded-md text-white flex items-center justify-center gap-2 cursor-pointer hover:-translate-x-0.5 hover:-translate-y-0.5 hover:transform"
              >
                <LogOut size={16} />
                Apply JSON
              </button>

              <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                <button
                  onClick={loadSample}
                  className="w-full py-2 bg-green-600 hover:bg-green-700 rounded-md text-white font-medium cursor-pointer hover:-translate-x-0.5 hover:-translate-y-0.5 hover:transform flex items-center justify-center gap-2"
                >
                  <Braces size={16} />
                  Sample data
                </button>

                <button
                  onClick={clearInput}
                  className="w-full py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md flex items-center justify-center gap-2 cursor-pointer hover:-translate-x-0.5 hover:-translate-y-0.5 hover:transform"
                >
                  <Trash2 size={16} />
                  Clear
                </button>
              </div>
            </div>
          )}

          {/* File Upload Tab */}
          {activeTab === "File Upload" && (
            <div className="space-y-6 relative  w-full">
              <div className={`relative h-60 border-2 border-dashed ${jsonLoaded ? "border-green-500" : "border-slate-600"} rounded-lg p-6 text-center flex flex-col items-center justify-center gap-2`}>
                <Upload className={`text-${jsonLoaded ? "green" : "slate"}-400`} size={36} />
                <p className="text-sm text-slate-400 mb-4">
                  Drag and drop your JSON file or
                </p>
                {
                  jsonLoaded && (
                    <div className="absolute top-2 right-2 flex items-center text-green-500 text-sm">
                      <CheckCircle2 size={16} />
                      <span className="ml-1">JSON Loaded</span>
                    </div>
                  )
                }
                <input
                  type="file"
                  id="jsonFileInput"
                  ref={fileInputRef}
                  accept=".json"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label htmlFor="jsonFileInput">
                  <span className="cursor-pointer bg-blue-900 hover:bg-blue-950 text-white px-4 py-2 rounded font-medium flex flex-row items-center justify-center gap-2 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:transform">
                    <FileJson2 size={20} />
                    Choose File
                  </span>
                </label>
                {fileName && (
                  <div className="flex items-center gap-2 text-sm shadow-sm border-t border-slate-600 pt-1">
                    <span className="text-slate-400">Selected File:</span>
                    <div className="truncate max-w-xs flex items-center gap-1"> 
                      {/* <FileJson size={16} /> */}
                      <span className="text-sky-600">{fileName}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <button
                  onClick={handleTextSubmit}
                  className="w-full py-2 bg-blue-900 hover:bg-blue-950 rounded-md text-white flex items-center justify-center gap-2 cursor-pointer hover:-translate-x-0.5 hover:-translate-y-0.5 hover:transform"
                >
                  <LogOut size={16} />
                  Apply JSON
                </button>

                <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                  <button
                    onClick={loadSample}
                    className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium cursor-pointer flex items-center justify-center gap-2 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:transform"
                  >
                    <Braces size={16} />
                    Sample data
                  </button>

                  <button
                    onClick={clearInput}
                    className="w-full py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md flex items-center justify-center gap-2 cursor-pointer transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:transform"
                  >
                    <Trash2 size={16} />
                    Clear
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="m-2 text-red-500 text-sm p-2 border border-red-500 rounded-md flex items-center gap-2">
            <CircleX size={26} />
            <span>
              {error}
            </span>
          </div>
        )}
      </div>
      {
        jsonLoaded && (
          <div className="shadow-[7px_8px_0px_0px_#12171f] border border-slate-800 rounded-xl mt-4">
            <h2 className="text-lg text-white mb-4 bg-gradient-to-r from-gray-800 to-slate-800 w-full border-transparent pt-4 px-2 pb-2 rounded-t-xl">Actions</h2>
            <div className="p-2">
              <input
                type="text"
                placeholder="Search nodes by ID or label..."
                className="w-full px-3 py-2 rounded bg-gray-700 text-white border border-gray-600 placeholder-gray-400"
                value={searchInput}
                onChange={handleSearchChange}
              />
              <div className="flex flex-row gap-2 flex-wrap sm:flex-nowrap mt-2">
                <button
                  onClick={() => setSearch(searchInput)}
                  className="w-full py-2 bg-blue-900 hover:bg-blue-950 rounded-md text-white flex items-center justify-center gap-2 cursor-pointer hover:-translate-x-0.5 hover:-translate-y-0.5 hover:transform"
                >
                  <Search size={16} />
                  Search
                </button>
                <button
                  onClick={() => {setSearch(""); setSearchInput("");}}
                  className="w-full py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md flex items-center justify-center gap-2 cursor-pointer hover:-translate-x-0.5 hover:-translate-y-0.5 hover:transform"
                >
                  <SearchX size={16} />
                  Clear Search
                </button>
              </div>
            </div>
          </div>
        )

      }

      <div className="mt-4 text-xs text-slate-400 border-t border-slate-800 pt-2 text-center">
        <p>
          <span className="text-slate-300">Graph Visualizer</span> by{" "}
          <a
            href=""
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            Sudarshan Nagulapalli
          </a>
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
