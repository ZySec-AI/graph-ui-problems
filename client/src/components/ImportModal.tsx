import { useState, useRef, ChangeEvent, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (jsonData: string) => void;
}

export default function ImportModal({ isOpen, onClose, onImport }: ImportModalProps) {
  const [jsonInput, setJsonInput] = useState<string>('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setJsonInput('');
      setFileName(null);
    }
  }, [isOpen]);

  const handleBrowseFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    handleFile(file);
  };

  const handleFile = (file: File) => {
    if (!file.name.endsWith('.json')) {
      alert('Please select a JSON file');
      return;
    }

    setFileName(file.name);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      try {
        // Try to parse and format the JSON for better readability
        const parsed = JSON.parse(content);
        setJsonInput(JSON.stringify(parsed, null, 2));
      } catch (err) {
        // If parsing fails, just set the raw content
        setJsonInput(content);
      }
    };
    reader.readAsText(file);
  };

  const handleJsonInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setJsonInput(event.target.value);
  };

  const handleImport = () => {
    if (!jsonInput.trim()) return;
    
    try {
      // Validate JSON
      JSON.parse(jsonInput);
      onImport(jsonInput);
    } catch (err) {
      alert('Invalid JSON format. Please check your input.');
    }
  };

  // Drag and drop handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-lg bg-gray-900 text-white border border-white/10 shadow-xl animate-slide-in">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
            Import Graph Data
          </DialogTitle>
          <DialogDescription className="text-white/60">
            Upload a JSON file or paste your graph data directly
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-2">
          <div 
            ref={dropZoneRef}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
              isDragging 
                ? 'border-blue-500 bg-blue-500/10' 
                : 'border-white/20 bg-white/5 hover:border-blue-400/50 hover:bg-white/10'
            }`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div className="space-y-3">
              <div className="h-14 w-14 mx-auto bg-white/10 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              
              {fileName ? (
                <div className="text-white/80 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span className="font-medium">{fileName}</span>
                </div>
              ) : (
                <p className="text-sm text-white/60">
                  Drag and drop your JSON file here, or click to browse
                </p>
              )}
              
              <input 
                type="file" 
                accept=".json" 
                className="hidden" 
                ref={fileInputRef} 
                onChange={handleFileSelect} 
              />
              
              <Button 
                variant="outline" 
                onClick={handleBrowseFile}
                className="bg-white/10 border-white/20 text-white/80 hover:bg-white/20 hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
                Browse Files
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-white/90 mb-2 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-white/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg>
              Or paste JSON directly
            </h4>
            <Textarea 
              rows={8} 
              className="w-full font-mono text-sm bg-white/5 border-white/10 text-white/90 focus:border-blue-500" 
              placeholder='{"nodes": [], "edges": [], "meta": {"title": "My Graph"}}' 
              value={jsonInput}
              onChange={handleJsonInputChange}
            />
          </div>
        </div>
        
        <DialogFooter className="pt-2">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="border-white/20 text-white/70 hover:bg-white/10 hover:text-white"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleImport}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white"
            disabled={!jsonInput.trim()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <polyline points="19 12 12 19 5 12"></polyline>
            </svg>
            Import
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
