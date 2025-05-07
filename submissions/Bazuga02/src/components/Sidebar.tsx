import { useState, useEffect } from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { GraphData, LayoutType, GroupByType } from "@/types/graph";
import { typeBgColorClass } from "@/lib/graphUtils";

interface SidebarProps {
  graphData: GraphData;
  filters: Record<string, boolean>;
  onFilterChange: (filters: Record<string, boolean>) => void;
  groupBy: GroupByType;
  onGroupChange: (groupBy: GroupByType) => void;
  layout: LayoutType;
  onLayoutChange: (layout: LayoutType) => void;
  onExportImage?: () => void;
}

export default function Sidebar({
  graphData,
  filters,
  onFilterChange,
  groupBy,
  onGroupChange,
  layout,
  onLayoutChange
}: SidebarProps) {
  const [visible, setVisible] = useState(false);
  
  // Animated entrance effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Extract node types from graph data
  const nodeTypes = Array.from(new Set(graphData.nodes.map(node => node.type)));

  const handleFilterChange = (type: string, checked: boolean) => {
    onFilterChange({
      ...filters,
      [type]: checked
    });
  };

  return (
    <aside 
      className={`w-72 glass-panel backdrop-blur-md border-r border-white/10 flex-shrink-0 hidden md:block transform transition-all duration-500 ease-in-out ${
        visible ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
      }`}
    >
      <div className="h-full flex flex-col">
        <div className="p-5 border-b border-white/10">
          <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
            Graph Settings
          </h2>
        </div>
        
        {/* Filters Section */}
        <div className="p-5 border-b border-white/10 flex-shrink-0 animate-slide-in" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-white/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <h3 className="text-sm font-semibold text-white/90">Node Types</h3>
          </div>
          <div className="space-y-3 pl-1">
            {nodeTypes.map(type => (
              <label key={type} className="flex items-center group cursor-pointer">
                <Checkbox 
                  checked={filters[type]} 
                  onCheckedChange={(checked) => handleFilterChange(type, !!checked)}
                  className="h-4 w-4 bg-white/10 border-white/20 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                />
                <span className="ml-3 text-sm text-white/80 group-hover:text-white transition-colors flex items-center">
                  <span className={`h-3 w-3 rounded-sm ${typeBgColorClass[type]} mr-2 shadow-sm shadow-black/20`}></span>
                  <span className="capitalize">{type}s</span>
                </span>
              </label>
            ))}
          </div>
        </div>
        
        {/* Grouping Section */}
        <div className="p-5 border-b border-white/10 flex-shrink-0 animate-slide-in" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-white/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
            </svg>
            <h3 className="text-sm font-semibold text-white/90">Grouping</h3>
          </div>
          <Select value={groupBy} onValueChange={(value) => onGroupChange(value as GroupByType)}>
            <SelectTrigger className="w-full text-sm bg-white/5 border-white/10 text-white/80 hover:bg-white/10 transition-colors">
              <SelectValue placeholder="Select grouping" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-white/10 text-white/80">
              <SelectItem value="none" className="hover:bg-white/5">No Grouping</SelectItem>
              <SelectItem value="type" className="hover:bg-white/5">By Type</SelectItem>
              <SelectItem value="group" className="hover:bg-white/5">By Group</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Layout Section */}
        <div className="p-5 border-b border-white/10 flex-shrink-0 animate-slide-in" style={{ animationDelay: '300ms' }}>
          <div className="flex items-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-white/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="3" y1="9" x2="21" y2="9" />
              <line x1="9" y1="21" x2="9" y2="9" />
            </svg>
            <h3 className="text-sm font-semibold text-white/90">Layout</h3>
          </div>
          <Select value={layout} onValueChange={(value) => onLayoutChange(value as LayoutType)}>
            <SelectTrigger className="w-full text-sm bg-white/5 border-white/10 text-white/80 hover:bg-white/10 transition-colors">
              <SelectValue placeholder="Select layout" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-white/10 text-white/80">
              <SelectItem value="cose" className="hover:bg-white/5">Force-Directed</SelectItem>
              <SelectItem value="concentric" className="hover:bg-white/5">Concentric</SelectItem>
              <SelectItem value="grid" className="hover:bg-white/5">Grid</SelectItem>
              <SelectItem value="circle" className="hover:bg-white/5">Circle</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Graph Info Section */}
        <div className="p-5 border-b border-white/10 flex-1 overflow-y-auto animate-slide-in" style={{ animationDelay: '400ms' }}>
          <div className="flex items-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-white/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            <h3 className="text-sm font-semibold text-white/90">Graph Information</h3>
          </div>
          
          <div className="space-y-3 text-sm">
            <h4 className="font-bold text-white/90 mt-1">
              {graphData.meta.title || "Untitled Graph"}
            </h4>
            <p className="text-xs text-white/60 leading-relaxed">
              {graphData.meta.description || "No description provided for this graph."}
            </p>
            
            <div className="mt-5 pt-5 border-t border-white/10">
              <div className="flex justify-between items-center py-1.5 group">
                <span className="text-white/60 group-hover:text-white/90 transition-colors flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-2 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                  Nodes
                </span>
                <Badge variant="outline" className="bg-white/5 border-white/10 text-white/80 font-mono">
                  {graphData.nodes.length}
                </Badge>
              </div>
              
              <div className="flex justify-between items-center py-1.5 group">
                <span className="text-white/60 group-hover:text-white/90 transition-colors flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-2 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
                  </svg>
                  Edges
                </span>
                <Badge variant="outline" className="bg-white/5 border-white/10 text-white/80 font-mono">
                  {graphData.edges.length}
                </Badge>
              </div>
              
              <div className="flex justify-between items-center py-1.5 group">
                <span className="text-white/60 group-hover:text-white/90 transition-colors flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-2 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Groups
                </span>
                <Badge variant="outline" className="bg-white/5 border-white/10 text-white/80 font-mono">
                  {Array.from(new Set(graphData.nodes.filter(n => n.group).map(n => n.group))).length}
                </Badge>
              </div>
            </div>
          </div>
        </div>
        
        {/* Controls Section */}
        {/* Removed Export as Image button from here */}
      </div>
    </aside>
  );
}
