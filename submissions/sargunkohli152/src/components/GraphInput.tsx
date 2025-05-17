// GraphInput component that handles JSON data input for the graph visualization
// Supports both direct JSON pasting and file upload with validation
import React, { useState } from 'react';
import type { GraphData } from '../types/graph';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import DataObjectOutlinedIcon from '@mui/icons-material/DataObjectOutlined';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import BoltOutlinedIcon from '@mui/icons-material/BoltOutlined';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import { useSampleModalStore } from '../store/modalStore';
import { useNodePopupStore } from '../store/nodePopupStore';

interface GraphInputProps {
  onClose: () => void;
  onLoadGraph: (data: GraphData | null) => void;
  onError?: (msg: string) => void;
}

const GraphInput: React.FC<GraphInputProps> = ({ onClose, onLoadGraph, onError }) => {
  // State management for input handling
  const [tab, setTab] = useState(0); // Controls active tab (Paste/Upload)
  const [jsonInput, setJsonInput] = useState(''); // Stores raw JSON input
  const [fileName, setFileName] = useState<string | null>(null); // Stores uploaded file name
  const setSelectedNode = useNodePopupStore((state) => state.setSelectedNode);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  const handleJsonPrettify = () => {
    try {
      if (!jsonInput.trim()) {
        return;
      }
      const obj = JSON.parse(jsonInput);
      const pretty = JSON.stringify(obj, null, 2);
      setJsonInput(pretty);
    } catch (error) {
      onError?.('Invalid JSON to prettify');
    }
  };

  const handlePaste = () => {
    if (!jsonInput.trim()) {
      onError?.('No JSON provided');
      return;
    }
    try {
      const parsed = JSON.parse(jsonInput);
      // Validate graph data structure
      if (
        typeof parsed === 'object' &&
        parsed !== null &&
        Array.isArray(parsed.nodes) &&
        Array.isArray(parsed.edges)
      ) {
        setSelectedNode(null);
        onLoadGraph(parsed);
      } else {
        onError?.('JSON file must contain nodes and edges arrays');
      }
    } catch {
      onError?.('Invalid JSON');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      onError?.('No file selected');
      return;
    }
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        // Validate graph data structure
        if (
          typeof parsed === 'object' &&
          parsed !== null &&
          Array.isArray(parsed.nodes) &&
          Array.isArray(parsed.edges)
        ) {
          setJsonInput(event.target?.result as string);
          setSelectedNode(null);
          onLoadGraph(parsed);
        } else {
          onError?.('JSON file must contain nodes and edges arrays');
        }
      } catch {
        onError?.('Invalid JSON in file');
      }
    };
    reader.readAsText(file);
  };

  const handleClear = () => {
    setJsonInput('');
    setFileName(null);
    onLoadGraph(null);
  };

  // Load sample graph data
  const handleSample = () => {
    useSampleModalStore.getState().open((data) => {
      setSelectedNode(null);
      onLoadGraph(data);
    });
  };

  return (
    <div className="relative">
      {/* Header with title and close button */}
      <div className="flex justify-between items-center mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
        <div className="flex items-center gap-2">
          <InsertDriveFileOutlinedIcon className="text-gray-500 dark:text-gray-400" />
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Input Graph Data
          </h2>
        </div>

        <button
          className="hidden md:block border border-gray-200 dark:border-gray-700 px-2 py-1 rounded text-xs z-50 dark:text-gray-300"
          onClick={onClose}
        >
          <MenuOutlinedIcon fontSize="small" />
        </button>
      </div>

      {/* Input method tabs (Paste/Upload) */}
      <Tabs
        value={tab}
        onChange={handleTabChange}
        variant="fullWidth"
        className="mb-2 text-sm"
        sx={{
          '& .MuiTabs-indicator': {
            backgroundColor: 'rgb(59, 130, 246)', // blue-500
          },
          '& .MuiTab-root': {
            color: 'rgb(107, 114, 128)', // gray-500
            '&.Mui-selected': {
              color: 'rgb(59, 130, 246)', // blue-500
            },
          },
          // Dark mode styles
          '@media (prefers-color-scheme: dark)': {
            '& .MuiTab-root': {
              color: 'rgb(156, 163, 175)', // gray-400
              '&.Mui-selected': {
                color: 'rgb(96, 165, 250)', // blue-400
              },
            },
            '& .MuiTabs-indicator': {
              backgroundColor: 'rgb(96, 165, 250)', // blue-400
            },
          },
        }}
      >
        <Tab
          label="Paste JSON"
          sx={{
            textTransform: 'none',
            fontFamily: 'inherit',
            lineHeight: 'inherit',
            letterSpacing: 'inherit',
            padding: '0px !important',
            minHeight: '36px',
            fontSize: '0.875rem', // text-sm
          }}
        />
        <Tab
          label="Upload File"
          sx={{
            textTransform: 'none',
            fontFamily: 'inherit',
            lineHeight: 'inherit',
            letterSpacing: 'inherit',
            padding: '0px !important',
            minHeight: '36px',
            fontSize: '0.875rem', // text-sm
          }}
        />
      </Tabs>

      {/* JSON paste input area */}
      {tab === 0 && (
        <div className="relative mb-4">
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            className="w-full h-40 p-2 border border-gray-300 dark:border-gray-600 rounded text-sm font-mono mb-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            placeholder='Paste your JSON here...
Example format:
{
  "nodes": [...],
  "edges": [...],
  "meta": {...}
}'
          />
          {/* JSON prettify button */}
          {jsonInput && (
            <button
              onClick={handleJsonPrettify}
              className="absolute top-2 right-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 p-1 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
              title="Prettify JSON"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
          )}
        </div>
      )}

      {/* File upload area */}
      {tab === 1 && (
        <div className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded text-sm mb-4 bg-white dark:bg-gray-800">
          <div className="flex flex-col justify-center items-center mb-3 h-40">
            <input
              id="json-upload"
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
            {/* Upload interface */}
            <DataObjectOutlinedIcon
              fontSize="large"
              className="mb-4 text-gray-500 dark:text-gray-400"
            />
            <div className="flex flex-col items-center gap-2">
              <p className="text-gray-700 dark:text-gray-300">Upload your json file here</p>
              <button
                type="button"
                onClick={() => document.getElementById('json-upload')?.click()}
                className="flex items-center text-white py-2 px-3 rounded text-sm font-medium transition-colors bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
              >
                <CloudUploadIcon className="mb-1 mr-2" fontSize="medium" />
                <span>Upload JSON File</span>
              </button>
            </div>
            {/* Display selected filename */}
            {fileName && (
              <span className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Selected: {fileName}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-col gap-2 mt-2">
        <button
          onClick={handlePaste}
          className="flex items-center lg:justify-start sm:justify-center bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 px-3 rounded text-sm font-medium transition-colors"
        >
          <BoltOutlinedIcon className="mr-2" fontSize="small" />
          Apply JSON
        </button>
        <button
          onClick={handleSample}
          className="flex items-center lg:justify-start sm:justify-center bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 px-3 rounded text-sm font-medium transition-colors"
        >
          <FileUploadOutlinedIcon className="mr-2" fontSize="small" />
          Load Sample Data
        </button>
        <button
          onClick={handleClear}
          className="flex items-center lg:justify-start sm:justify-center bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 px-3 rounded text-sm font-medium transition-colors"
        >
          <DeleteOutlinedIcon className="mr-2" fontSize="small" />
          Clear
        </button>
      </div>
    </div>
  );
};

export default GraphInput;
