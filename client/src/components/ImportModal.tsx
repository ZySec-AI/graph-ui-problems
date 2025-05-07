import { useState, useRef, ChangeEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (jsonData: string) => void;
}

export default function ImportModal({ isOpen, onClose, onImport }: ImportModalProps) {
  const [jsonInput, setJsonInput] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBrowseFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setJsonInput(content);
    };
    reader.readAsText(file);
  };

  const handleJsonInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setJsonInput(event.target.value);
  };

  const handleImport = () => {
    if (!jsonInput.trim()) return;
    onImport(jsonInput);
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Import Graph Data</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-300 transition-colors">
            <div className="space-y-2">
              <i className="ri-upload-cloud-2-line text-4xl text-gray-400"></i>
              <p className="text-sm text-gray-500">Drag and drop your JSON file here, or click to browse</p>
              <input 
                type="file" 
                accept=".json" 
                className="hidden" 
                ref={fileInputRef} 
                onChange={handleFileSelect} 
              />
              <Button variant="outline" onClick={handleBrowseFile}>
                Browse Files
              </Button>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-3">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Or paste JSON directly</h4>
            <Textarea 
              rows={5} 
              className="w-full font-mono" 
              placeholder='{"nodes": [], "edges": [], "meta": {}}' 
              value={jsonInput}
              onChange={handleJsonInputChange}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleImport}>
            Import
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
