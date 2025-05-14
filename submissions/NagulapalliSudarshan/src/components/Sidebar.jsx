import React, { useState, useRef } from "react";
import Tabs from "./ui/Sidebar/Tabs";
import Error from "./ui/Sidebar/Error";
import sample from "../test/test1.json";
import JsonInput from "./ui/Sidebar/JsonInput";
import FileInput from "./ui/Sidebar/FileInput";
import SearchAction from "./ui/Sidebar/Search";
import validateJsonStructure from "../utils/JsonValidation";

const Sidebar = ({ onDataLoad, handleClear, setSearch }) => {
  const fileInputRef = useRef(null);
  const [error, setError] = useState("");
  const [rawText, setRawText] = useState("");
  const [ fileName, setFileName ] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [jsonLoaded, setJsonLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState("File Upload");

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
    setRawText(JSON.stringify(sample, null, 2));
    onDataLoad(sample);
    setError("");
    setFileName("");
    setJsonLoaded(true);
  };

  return (
    <div className="w-[20rem] sm:w-[25rem] md:w-[25rem] lg:w-[25rem] bg-slate-900 h-full text-white p-6 border-r border-slate-800 overflow-y-auto custom-scrollbar">
      <div className="shadow-[7px_8px_0px_0px_#12171f] border border-slate-800 rounded-xl">
        <h2 className="text-xl text-white mb-4 bg-gradient-to-r from-gray-800 to-slate-800 w-full border-transparent pt-4 px-2 pb-2 rounded-t-xl">
          Graph Input
        </h2>

        <div className="p-2">
          <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
          {
            activeTab === "JSON Data" && 
              <JsonInput
                jsonLoaded={jsonLoaded}
                rawText={rawText}
                setRawText={setRawText}
                handleTextSubmit={handleTextSubmit}
                clearInput={clearInput}
                loadSample={loadSample}
              />
          }
          {
            activeTab === "File Upload" && 
            <FileInput
              jsonLoaded={jsonLoaded}
              fileInputRef={fileInputRef}
              handleFileChange={handleFileChange}
              fileName={fileName}
              handleTextSubmit={handleTextSubmit}
              loadSample={loadSample}
              clearInput={clearInput}
            />
          }
        </div>
        {error && <Error error={error} />}
      </div>

      {
        jsonLoaded && 
          <SearchAction 
            setSearch={setSearch} 
            searchInput={searchInput} 
            setSearchInput={setSearchInput} 
          /> 
      }

      {/* <div className="mt-4 text-xs text-slate-400 border-t border-slate-800 pt-2 text-center">
        <p>
          <span className="text-slate-300">Graph Visualizer</span> powered with{" "}
          <a
            href=""
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            React, Tailwind, Cytoscape.js
          </a>
        </p>
      </div> */}
    </div>
  );
};

export default Sidebar;
