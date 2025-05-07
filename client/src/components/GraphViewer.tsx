import { useEffect, useRef, useState } from 'react';
import { GraphData, GraphNode, CytoscapeNodeData, CytoscapeEdgeData, LayoutType, GroupByType } from '@/types/graph';
import { getColorForNodeType, getShapeForNodeType, getConnectedNodes } from '@/lib/graphUtils';
import GraphControls from '@/components/GraphControls';
import cytoscape from 'cytoscape';

interface GraphViewerProps {
  graphData: GraphData;
  filters: Record<string, boolean>;
  groupBy: GroupByType;
  layout: LayoutType;
  searchTerm: string;
  onNodeSelect: (node: GraphNode | null) => void;
  toggleSidebar: () => void;
  cyRef?: React.MutableRefObject<cytoscape.Core | null>;
}

export default function GraphViewer({
  graphData,
  filters,
  groupBy,
  layout,
  searchTerm,
  onNodeSelect,
  toggleSidebar,
  cyRef: parentCyRef
}: GraphViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<cytoscape.Core | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Setup Cytoscape
  useEffect(() => {
    if (!containerRef.current) return;

    const cy = cytoscape({
      container: containerRef.current,
      style: [
        {
          selector: 'node',
          style: {
            'label': 'data(label)',
            'text-valign': 'center',
            'text-halign': 'center',
            'color': '#FFFFFF',
            'text-outline-width': 2,
            'text-outline-color': 'data(color)',
            'background-color': 'data(color)',
            'shape': 'data(shape)',
            'width': 50,
            'height': 50,
            'font-size': 14,
            'font-weight': 'bold',
            'z-index': 10
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 2,
            'curve-style': 'bezier',
            'line-color': 'data(color)',
            'target-arrow-color': 'data(color)',
            'target-arrow-shape': (ele) => {
              return ele.data('direction') === '->' ? 'triangle' : 'none';
            },
            'line-style': (ele) => {
              return ele.data('lineType') === 'dotted' ? 'dotted' : 
                     ele.data('lineType') === 'dashed' ? 'dashed' : 'solid';
            },
            'label': 'data(label)',
            'font-size': 12,
            'text-rotation': 'autorotate',
            'color': '#666',
            'text-background-color': '#FFFFFF',
            'text-background-opacity': 0.7,
            'text-background-padding': 2,
            'text-background-shape': 'roundrectangle'
          }
        },
        {
          selector: 'node:selected',
          style: {
            'border-width': 4,
            'border-color': '#FFC107',
            'text-outline-color': '#FFC107',
            'z-index': 20
          }
        },
        {
          selector: 'edge:selected',
          style: {
            'width': 4,
            'line-color': '#FFC107',
            'target-arrow-color': '#FFC107'
          }
        },
        {
          selector: '.hover',
          style: {
            'border-width': 2,
            'border-color': '#64B5F6'
          }
        }
      ],
      minZoom: 0.1,
      maxZoom: 3
    });

    // Node selection handler
    cy.on('tap', 'node', function(evt) {
      const node = evt.target;
      const nodeId = node.id();
      setSelectedNodeId(nodeId);
      
      // Find the corresponding node in the graph data
      const selectedNode = graphData.nodes.find(n => n.id === nodeId) || null;
      onNodeSelect(selectedNode);
    });
    
    // Background tap to clear selection
    cy.on('tap', function(evt) {
      if (evt.target === cy) {
        setSelectedNodeId(null);
        onNodeSelect(null);
      }
    });
    
    // Node hover effects
    cy.on('mouseover', 'node', function(evt) {
      const node = evt.target;
      node.addClass('hover');
    });
    
    cy.on('mouseout', 'node', function(evt) {
      const node = evt.target;
      node.removeClass('hover');
    });

    cyRef.current = cy;
    
    // Share the cytoscape instance with the parent component if a ref was provided
    if (parentCyRef) {
      parentCyRef.current = cy;
    }

    return () => {
      cy.destroy();
    };
  }, [parentCyRef]);

  // Update graph data when it changes
  useEffect(() => {
    if (!cyRef.current || !graphData) return;

    const cy = cyRef.current;
    
    // Clear existing graph
    cy.elements().remove();
    
    // Create filtered node list based on filters and search
    let filteredNodes = graphData.nodes.filter(node => 
      filters[node.type] === true
    );
    
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filteredNodes = filteredNodes.filter(node => 
        node.label.toLowerCase().includes(lowerSearchTerm) || 
        node.id.toLowerCase().includes(lowerSearchTerm) ||
        node.type.toLowerCase().includes(lowerSearchTerm)
      );
    }
    
    // Create nodes
    const cyNodes = filteredNodes.map(node => {
      return {
        data: {
          id: node.id,
          label: node.label,
          type: node.type,
          properties: node.properties,
          color: node.style?.color ? node.style.color : getColorForNodeType(node.type),
          shape: node.style?.shape ? node.style.shape : getShapeForNodeType(node.type),
          group: node.group
        }
      };
    });
    
    // Filter edges to only include those connecting visible nodes
    const filteredNodeIds = new Set(filteredNodes.map(node => node.id));
    const filteredEdges = graphData.edges.filter(edge => 
      filteredNodeIds.has(edge.source) && filteredNodeIds.has(edge.target)
    );
    
    // Create edges
    const cyEdges = filteredEdges.map(edge => {
      return {
        data: {
          id: `${edge.source}-${edge.target}`,
          source: edge.source,
          target: edge.target,
          label: edge.label,
          direction: edge.direction,
          color: edge.style?.color || '#555',
          lineType: edge.style?.lineType || 'solid'
        }
      };
    });
    
    // Add elements to graph
    cy.add([...cyNodes, ...cyEdges]);
    
    // Apply layout
    applyLayout(layout);
    
    // If there's a selected node, update the selection
    if (selectedNodeId && filteredNodeIds.has(selectedNodeId)) {
      const selectedNode = cy.getElementById(selectedNodeId);
      if (selectedNode.length > 0) {
        selectedNode.select();
        
        // Find connected nodes for details panel
        const connectedNodes = getConnectedNodes(selectedNodeId, graphData);
        // Update the details panel with connected nodes here
      }
    } else {
      setSelectedNodeId(null);
      onNodeSelect(null);
    }
  }, [graphData, filters, searchTerm, layout, groupBy]);

  // Apply layout
  const applyLayout = (layoutName: LayoutType) => {
    if (!cyRef.current) return;
    
    const cy = cyRef.current;
    const layoutOptions: cytoscape.LayoutOptions = {
      name: layoutName,
      fit: true,
      padding: 50,
      animate: true,
      randomize: false
    };
    
    // Additional options for specific layouts
    if (layoutName === 'cose') {
      Object.assign(layoutOptions, {
        idealEdgeLength: 100,
        nodeOverlap: 20,
        refresh: 20,
        componentSpacing: 100,
        nodeRepulsion: 400000,
        edgeElasticity: 100,
        nestingFactor: 5,
        gravity: 80,
        numIter: 1000,
        initialTemp: 200,
        coolingFactor: 0.95,
        minTemp: 1.0
      });
    }
    
    cy.layout(layoutOptions).run();
  };

  // Zoom controls
  const handleZoomIn = () => {
    if (!cyRef.current) return;
    const cy = cyRef.current;
    cy.zoom({
      level: cy.zoom() * 1.2,
      renderedPosition: { x: cy.width() / 2, y: cy.height() / 2 }
    });
  };

  const handleZoomOut = () => {
    if (!cyRef.current) return;
    const cy = cyRef.current;
    cy.zoom({
      level: cy.zoom() * 0.8,
      renderedPosition: { x: cy.width() / 2, y: cy.height() / 2 }
    });
  };

  const handleFitGraph = () => {
    if (!cyRef.current) return;
    cyRef.current.fit();
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden relative">
      {/* Graph Canvas */}
      <div id="graph-container" ref={containerRef} className="flex-1 bg-white"></div>
      
      {/* Graph Controls Overlay */}
      <GraphControls
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onFitGraph={handleFitGraph}
        onToggleSidebar={toggleSidebar}
      />
    </div>
  );
}
