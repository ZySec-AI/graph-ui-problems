import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

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
  return (
    <div className="absolute bottom-6 right-6 flex flex-col bg-white shadow-lg rounded-lg border border-gray-200">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            className="p-2 hover:bg-gray-100 rounded-none rounded-t-lg" 
            onClick={onZoomIn}
          >
            <i className="ri-zoom-in-line text-gray-700"></i>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Zoom In</TooltipContent>
      </Tooltip>
      
      <div className="border-t border-gray-200"></div>
      
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            className="p-2 hover:bg-gray-100 rounded-none" 
            onClick={onZoomOut}
          >
            <i className="ri-zoom-out-line text-gray-700"></i>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Zoom Out</TooltipContent>
      </Tooltip>
      
      <div className="border-t border-gray-200"></div>
      
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            className="p-2 hover:bg-gray-100 rounded-none" 
            onClick={onFitGraph}
          >
            <i className="ri-fullscreen-line text-gray-700"></i>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Fit Graph</TooltipContent>
      </Tooltip>
      
      <div className="border-t border-gray-200"></div>
      
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            className="p-2 hover:bg-gray-100 rounded-none rounded-b-lg md:hidden" 
            onClick={onToggleSidebar}
          >
            <i className="ri-menu-line text-gray-700"></i>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Toggle Sidebar</TooltipContent>
      </Tooltip>
    </div>
  );
}
