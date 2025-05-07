import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useState, useEffect } from 'react';

interface GraphControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitGraph: () => void;
  onToggleSidebar: () => void;
}

export default function GraphControls({
  onZoomIn,
  onZoomOut,
  onFitGraph,
  onToggleSidebar
}: GraphControlsProps) {
  const [visible, setVisible] = useState(false);
  
  // Animated entrance effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      className={`absolute bottom-6 right-6 flex flex-col glass-panel backdrop-blur-lg transform transition-all duration-300 ease-in-out ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            className="p-2 text-white/90 hover:bg-white/10 rounded-none rounded-t-lg graph-control" 
            onClick={onZoomIn}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              <line x1="11" y1="8" x2="11" y2="14"></line>
              <line x1="8" y1="11" x2="14" y2="11"></line>
            </svg>
          </Button>
        </TooltipTrigger>
        <TooltipContent className="bg-gray-900 text-white border-0">Zoom In</TooltipContent>
      </Tooltip>
      
      <div className="border-t border-white/10"></div>
      
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            className="p-2 text-white/90 hover:bg-white/10 rounded-none graph-control" 
            onClick={onZoomOut}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              <line x1="8" y1="11" x2="14" y2="11"></line>
            </svg>
          </Button>
        </TooltipTrigger>
        <TooltipContent className="bg-gray-900 text-white border-0">Zoom Out</TooltipContent>
      </Tooltip>
      
      <div className="border-t border-white/10"></div>
      
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            className="p-2 text-white/90 hover:bg-white/10 rounded-none graph-control" 
            onClick={onFitGraph}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 3 21 3 21 9"></polyline>
              <polyline points="9 21 3 21 3 15"></polyline>
              <line x1="21" y1="3" x2="14" y2="10"></line>
              <line x1="3" y1="21" x2="10" y2="14"></line>
            </svg>
          </Button>
        </TooltipTrigger>
        <TooltipContent className="bg-gray-900 text-white border-0">Fit Graph</TooltipContent>
      </Tooltip>
      
      <div className="border-t border-white/10"></div>
      
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            className="p-2 text-white/90 hover:bg-white/10 rounded-none rounded-b-lg md:hidden graph-control" 
            onClick={onToggleSidebar}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </Button>
        </TooltipTrigger>
        <TooltipContent className="bg-gray-900 text-white border-0">Toggle Sidebar</TooltipContent>
      </Tooltip>
    </div>
  );
}
