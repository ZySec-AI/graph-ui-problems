import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
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
  onResetView: () => void;
  onExportImage?: () => void;
}

export default function Sidebar({
  graphData,
  filters,
  onFilterChange,
  groupBy,
  onGroupChange,
  layout,
  onLayoutChange,
  onResetView
}: SidebarProps) {
  // Extract node types from graph data
  const nodeTypes = Array.from(new Set(graphData.nodes.map(node => node.type)));

  const handleFilterChange = (type: string, checked: boolean) => {
    onFilterChange({
      ...filters,
      [type]: checked
    });
  };

  return (
    <aside className="w-64 border-r border-gray-200 bg-white flex-shrink-0 hidden md:block">
      <div className="h-full flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Graph Settings</h2>
        </div>
        
        {/* Filters Section */}
        <div className="p-4 border-b border-gray-200 flex-shrink-0">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Node Types</h3>
          <div className="space-y-2">
            {nodeTypes.map(type => (
              <label key={type} className="flex items-center">
                <Checkbox 
                  checked={filters[type]} 
                  onCheckedChange={(checked) => handleFilterChange(type, !!checked)}
                  className="h-4 w-4"
                />
                <span className="ml-2 text-sm text-gray-700 flex items-center">
                  <span className={`h-3 w-3 rounded-full ${typeBgColorClass[type]} mr-2`}></span>
                  {type}s
                </span>
              </label>
            ))}
          </div>
        </div>
        
        {/* Grouping Section */}
        <div className="p-4 border-b border-gray-200 flex-shrink-0">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Grouping</h3>
          <Select value={groupBy} onValueChange={(value) => onGroupChange(value as GroupByType)}>
            <SelectTrigger className="w-full text-sm">
              <SelectValue placeholder="Select grouping" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No Grouping</SelectItem>
              <SelectItem value="type">By Type</SelectItem>
              <SelectItem value="group">By Group</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Layout Section */}
        <div className="p-4 border-b border-gray-200 flex-shrink-0">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Layout</h3>
          <Select value={layout} onValueChange={(value) => onLayoutChange(value as LayoutType)}>
            <SelectTrigger className="w-full text-sm">
              <SelectValue placeholder="Select layout" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cose">Force-Directed</SelectItem>
              <SelectItem value="concentric">Concentric</SelectItem>
              <SelectItem value="grid">Grid</SelectItem>
              <SelectItem value="circle">Circle</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Graph Info Section */}
        <div className="p-4 border-b border-gray-200 flex-1 overflow-y-auto">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Graph Information</h3>
          <div className="space-y-2 text-xs text-gray-600">
            <p className="font-medium text-sm text-gray-800">
              {graphData.meta.title || "Untitled Graph"}
            </p>
            <p className="text-xs text-gray-500">
              {graphData.meta.description || "No description"}
            </p>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex justify-between mb-1">
                <span>Nodes:</span>
                <span className="font-mono">{graphData.nodes.length}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span>Edges:</span>
                <span className="font-mono">{graphData.edges.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Groups:</span>
                <span className="font-mono">
                  {Array.from(new Set(graphData.nodes.filter(n => n.group).map(n => n.group))).length}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Controls Section */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <Button
            variant="secondary"
            className="w-full mb-2"
            onClick={onResetView}
          >
            <i className="ri-restart-line mr-1"></i> Reset View
          </Button>
          <Button
            variant="outline"
            className="w-full"
          >
            <i className="ri-image-line mr-1"></i> Export as Image
          </Button>
        </div>
      </div>
    </aside>
  );
}
