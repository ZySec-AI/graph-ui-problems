import { ChangeEvent, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface TopNavbarProps {
  onFileImport: () => void;
  onExportImage?: () => void;
  searchTerm: string;
  onSearch: (search: string) => void;
}

export default function TopNavbar({ onFileImport, onExportImage, searchTerm, onSearch }: TopNavbarProps) {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  return (
    <header className={`glass-panel backdrop-blur-md border-b border-white/10 z-10 transition-all duration-500 ease-in-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center group">
              <div className="text-3xl mr-3 text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg w-9 h-9 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                  Graph Crafter
                </h1>
                <div className="text-xs text-white/50 -mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  Knowledge Graph Visualizer
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative animate-slide-in" style={{ animationDelay: '150ms' }}>
              <Input
                type="search"
                placeholder="Search nodes..."
                className="w-64 bg-white/5 border-white/10 text-white/90 focus:border-blue-500 focus:ring-blue-500 pl-10"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute left-3 top-2.5 text-white/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
            
            <Button 
              variant="outline" 
              className="flex items-center text-sm bg-white/5 border-white/20 text-white/80 hover:bg-white/10 hover:text-white transition-colors animate-slide-in"
              style={{ animationDelay: '200ms' }}
              onClick={onFileImport}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              Import JSON
            </Button>
            <Button
              variant="outline"
              className="flex items-center text-sm bg-white/5 border-white/20 text-white/80 hover:bg-white/10 hover:text-white transition-colors animate-slide-in"
              style={{ animationDelay: '220ms' }}
              onClick={onExportImage}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
              Export as Image
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
