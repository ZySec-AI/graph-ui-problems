import { useState, useRef, useEffect } from 'react';
import type { GraphData } from '../types/graph';

interface GraphInputProps {
  onDataLoaded: (data: GraphData) => void;
}

const GraphInput = ({ onDataLoaded }: GraphInputProps) => {
  const [error, setError] = useState<string | null>(null);
  const [jsonText, setJsonText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [view, setView] = useState<'input' | 'upload'>('input');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const validateAndParseJSON = (jsonString: string): GraphData | null => {
    try {
      const parsed = JSON.parse(jsonString);
      
      // validation
      if (!parsed.nodes || !Array.isArray(parsed.nodes) || !parsed.edges || !Array.isArray(parsed.edges)) {
        setError('Invalid JSON format. Make sure it contains "nodes" and "edges" arrays.');
        return null;
      }
      
      setError(null);
      return parsed as unknown as GraphData;
    } catch (error) {
      console.error('JSON parse error:', error);
      setError('Invalid JSON. Please check the format.');
      return null;
    }
  };
  
  const handleJsonInput = () => {
    setIsLoading(true);
    setSuccess(false);
    
    setTimeout(() => {
      const parsedData = validateAndParseJSON(jsonText);
      if (parsedData) {
        onDataLoaded(parsedData);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000);
      }
      setIsLoading(false);
    }, 500);
  };
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setIsLoading(true);
    setSuccess(false);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setJsonText(content);
      
      setTimeout(() => {
        const parsedData = validateAndParseJSON(content);
        if (parsedData) {
          onDataLoaded(parsedData);
          setSuccess(true);
          setTimeout(() => setSuccess(false), 2000);
        }
        setIsLoading(false);
      }, 500);
    };
    reader.readAsText(file);
  };
  
  const handleLoadSampleData = () => {
    setIsLoading(true);
    setSuccess(false);
    

    import('../data/sampleGraph.json')
      .then((module) => {
        setTimeout(() => {
          const sampleData = module.default as unknown as GraphData;
          setJsonText(JSON.stringify(sampleData, null, 2));
          onDataLoaded(sampleData);
          setSuccess(true);
          setTimeout(() => setSuccess(false), 2000);
          setIsLoading(false);
        }, 500); 
      })
      .catch((err) => {
        console.error('Failed to load sample data:', err);
        setError('Failed to load sample data');
        setIsLoading(false);
      });
  };
  
  const handlePrettify = () => {
    try {
      if (!jsonText.trim()) return;
      
      const obj = JSON.parse(jsonText);
      const pretty = JSON.stringify(obj, null, 2);
      setJsonText(pretty);
    } catch (error) {
      setError('Invalid JSON to prettify');
      console.error('JSON prettify error:', error);
    }
  };
  
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    const adjustHeight = () => {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(400, textarea.scrollHeight)}px`;
    };
    
    textarea.addEventListener('input', adjustHeight);
    adjustHeight();
    
    return () => {
      textarea.removeEventListener('input', adjustHeight);
    };
  }, [jsonText]);
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg mb-6 overflow-hidden transition-all">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4">
        <h2 className="text-xl font-bold text-white flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          Graph Data Input
        </h2>
      </div>
      
      <div className="p-5">
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
          <button
            className={`px-4 py-2 font-medium text-sm ${
              view === 'input'
                ? 'text-indigo-600 border-b-2 border-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
            onClick={() => setView('input')}
          >
            JSON Editor
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${
              view === 'upload'
                ? 'text-indigo-600 border-b-2 border-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
            onClick={() => setView('upload')}
          >
            File Upload
          </button>
        </div>
        
        {view === 'input' ? (
          <div className="mb-4">
            <div className="relative">
              <textarea
                ref={textareaRef}
                className="w-full p-3 border rounded-lg font-mono text-sm text-gray-800 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder={`Enter your JSON data here...\n\nExample format:\n{\n  "nodes": [...],\n  "edges": [...],\n  "meta": {...}\n}`}
                value={jsonText}
                onChange={(e) => setJsonText(e.target.value)}
                rows={8}
              />
              
              {jsonText && (
                <button
                  onClick={handlePrettify}
                  className="absolute top-2 right-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 p-1 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                  title="Prettify JSON"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="mb-4">
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center bg-gray-50 dark:bg-gray-900">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-gray-600 dark:text-gray-400 mb-3">Drag & drop your JSON file here or</p>
              <button
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onClick={() => fileInputRef.current?.click()}
              >
                Choose File
              </button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".json"
                onChange={handleFileUpload}
              />
              {jsonText && (
                <div className="mt-4 text-left p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {jsonText.length > 50 ? jsonText.substring(0, 50) + '...' : jsonText}
                    </span>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => setJsonText('')}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm mb-4 flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 p-3 rounded-lg text-sm mb-4 flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Graph data successfully loaded!</span>
          </div>
        )}
        
        <div className="flex flex-wrap gap-2">
          <button
            className={`flex items-center px-4 py-2 rounded-lg transition-all ${
              isLoading 
                ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed text-gray-600 dark:text-gray-400'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow hover:shadow-md'
            }`}
            onClick={handleJsonInput}
            disabled={isLoading || !jsonText.trim()}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-600 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Apply JSON
              </>
            )}
          </button>
          
          <button
            className="flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow hover:shadow-md transition-all"
            onClick={handleLoadSampleData}
            disabled={isLoading}
          >
            {isLoading ? (
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            )}
            Load Sample Data
          </button>
          
          <button
            className="flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
            onClick={() => setJsonText('')}
            disabled={!jsonText.trim() || isLoading}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};

export default GraphInput; 