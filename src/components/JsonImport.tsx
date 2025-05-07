import React, { useState } from 'react';
import { GraphData } from '../types/graph';
import { Upload, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface JsonImportProps {
  onImport: (data: GraphData) => void;
}

const JsonImport: React.FC<JsonImportProps> = ({ onImport }) => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        // Parse the JSON
        const jsonData = JSON.parse(event.target?.result as string);
        
        // Validate the structure
        if (!jsonData.nodes || !Array.isArray(jsonData.nodes)) {
          throw new Error("Invalid JSON: Missing or invalid 'nodes' array");
        }
        
        if (!jsonData.edges || !Array.isArray(jsonData.edges)) {
          throw new Error("Invalid JSON: Missing or invalid 'edges' array");
        }
        
        if (!jsonData.meta || typeof jsonData.meta !== 'object') {
          throw new Error("Invalid JSON: Missing or invalid 'meta' object");
        }
        
        // Success - call the import handler
        onImport(jsonData);
        setError(null);
        setSuccess(`Successfully imported ${jsonData.nodes.length} nodes and ${jsonData.edges.length} edges`);
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccess(null);
        }, 3000);
        
      } catch (err) {
        setSuccess(null);
        setError(err instanceof Error ? err.message : 'Error parsing JSON file');
      }
    };
    
    reader.onerror = () => {
      setSuccess(null);
      setError('Error reading file');
    };
    
    reader.readAsText(file);
  };
  
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Import JSON</h2>
        <label className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md cursor-pointer hover:bg-indigo-700 transition-colors">
          <Upload size={16} className="mr-2" />
          <span>Upload File</span>
          <input 
            type="file" 
            accept=".json" 
            className="hidden" 
            onChange={handleFileChange}
          />
        </label>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start">
          <AlertTriangle size={18} className="mr-2 mt-0.5 flex-shrink-0" />
          <div className="text-sm">{error}</div>
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md flex items-start">
          <CheckCircle2 size={18} className="mr-2 mt-0.5 flex-shrink-0" />
          <div className="text-sm">{success}</div>
        </div>
      )}
      
      <div className="mt-4 text-sm text-gray-600">
        <p className="mb-2">JSON file should include:</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Array of nodes with id, label, type</li>
          <li>Array of edges with source, target, label</li>
          <li>Meta information (title, description)</li>
        </ul>
      </div>
    </div>
  );
};

export default JsonImport;