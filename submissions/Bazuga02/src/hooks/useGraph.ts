import { useState, useCallback, useMemo } from 'react';
import { GraphData, GraphNode, LayoutType, GroupByType } from '@/types/graph';
import sampleData from '@/lib/graphUtils';

export function useGraph() {
  const [graphData, setGraphData] = useState<GraphData>(sampleData);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [activeFilters, setActiveFilters] = useState<Record<string, boolean>>({});
  const [groupBy, setGroupBy] = useState<GroupByType>('type');
  const [layout, setLayout] = useState<LayoutType>('cose');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Initialize filters based on node types in the data
  useMemo(() => {
    if (graphData && graphData.nodes.length > 0) {
      const nodeTypes = Array.from(new Set(graphData.nodes.map(node => node.type)));
      const initialFilters: Record<string, boolean> = {};
      nodeTypes.forEach(type => {
        initialFilters[type] = true;
      });
      setActiveFilters(initialFilters);
    }
  }, [graphData]);

  const loadGraph = useCallback((data: GraphData) => {
    setGraphData(data);
    setSelectedNode(null);
  }, []);

  const getFilteredNodes = useCallback(() => {
    if (!graphData || !graphData.nodes) return [];
    
    // Apply type filters
    let filteredNodes = graphData.nodes.filter(node => 
      activeFilters[node.type] === true
    );
    
    // Apply search filter if there's a search term
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filteredNodes = filteredNodes.filter(node => 
        node.label.toLowerCase().includes(lowerSearchTerm) || 
        node.id.toLowerCase().includes(lowerSearchTerm) ||
        node.type.toLowerCase().includes(lowerSearchTerm)
      );
    }
    
    return filteredNodes;
  }, [graphData, activeFilters, searchTerm]);

  const getFilteredEdges = useCallback(() => {
    if (!graphData || !graphData.edges) return [];
    
    const filteredNodes = getFilteredNodes();
    const filteredNodeIds = new Set(filteredNodes.map(node => node.id));
    
    // Only keep edges where both source and target nodes are visible
    return graphData.edges.filter(edge => 
      filteredNodeIds.has(edge.source) && filteredNodeIds.has(edge.target)
    );
  }, [graphData, getFilteredNodes]);

  return {
    graphData,
    loadGraph,
    selectedNode,
    setSelectedNode,
    activeFilters,
    setActiveFilters,
    groupBy,
    setGroupBy,
    layout,
    setLayout,
    searchTerm,
    setSearchTerm,
    getFilteredNodes,
    getFilteredEdges
  };
}
