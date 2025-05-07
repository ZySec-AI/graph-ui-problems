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
            'background-opacity': 0.9,
            'shape': 'data(shape)',
            'width': 68,
            'height': 68,
            'font-size': 14,
            'font-weight': 'bold',
            'z-index': 10,
            'border-width': 3,
            'border-color': 'data(color)',
            'border-opacity': 0.7,
            'text-outline-opacity': 0.9,
            'transition-property': 'background-color, border-color, width, height, background-opacity, border-opacity',
            'transition-duration': '300ms',
            'text-margin-y': -2,
            'text-wrap': 'wrap',
            'text-max-width': 120,
            'overlay-padding': 6,
            'min-zoomed-font-size': 8
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 4,
            'curve-style': 'unbundled-bezier',
            'control-point-distances': [60, -60],
            'control-point-weights': [0.3, 0.7],
            'line-color': 'data(color)',
            'line-opacity': 0.85,
            'target-arrow-color': 'data(color)',
            'target-arrow-shape': (ele) => {
              return ele.data('direction') === '->' ? 'triangle' : 'none';
            },
            'target-arrow-fill': 'filled',
            'arrow-scale': 1.8,
            'source-endpoint': 'outside-to-node-or-label',
            'target-endpoint': 'outside-to-node-or-label',
            'line-style': (ele) => {
              return ele.data('lineType') === 'dotted' ? 'dotted' : 
                    ele.data('lineType') === 'dashed' ? 'dashed' : 'solid';
            },
            'label': 'data(label)',
            'font-size': 13,
            'text-rotation': 'autorotate',
            'color': '#FFF',
            'text-background-color': 'rgba(0, 10, 30, 0.7)',
            'text-background-opacity': 0.9,
            'text-background-padding': 5,
            'text-background-shape': 'roundrectangle',
            'text-border-opacity': 0.8,
            'text-border-width': 1,
            'text-border-color': 'data(color)',
            'transition-property': 'line-color, target-arrow-color, opacity, width',
            'transition-duration': '300ms'
          }
        },
        {
          selector: 'node:selected',
          style: {
            'width': 72,
            'height': 72,
            'border-width': 3,
            'border-color': '#ffffff',
            'border-opacity': 0.8,
            'background-opacity': 0.9,
            'z-index': 20,
            'text-outline-color': function(ele: any) {
              return ele.data('color');
            },
            'text-outline-width': 2,
            'text-outline-opacity': 0.9,
            'font-size': 14
          }
        },
        {
          selector: 'edge:selected',
          style: {
            'width': 6,
            'line-color': '#ffffff',
            'line-opacity': 0.95,
            'target-arrow-color': '#ffffff',
            'text-background-color': 'rgba(0, 0, 0, 0.8)',
            'text-border-color': '#ffffff',
            'opacity': 1,
            'z-index': 15,
            'font-size': 14
          }
        },
        {
          selector: '.hover',
          style: {
            'border-width': 4,
            'border-color': '#ffffff',
            'border-opacity': 0.6,
            'background-opacity': 0.85,
            'transition-property': 'border-width, border-color, border-opacity, background-opacity',
            'transition-duration': '200ms'
          }
        },
        {
          selector: 'edge.hover',
          style: {
            'width': 5,
            'line-color': '#ffffff',
            'line-opacity': 0.9,
            'target-arrow-color': '#ffffff',
            'z-index': 14,
            'transition-property': 'width, line-color, target-arrow-color, line-opacity',
            'transition-duration': '150ms'
          }
        },
        // Type-specific styling for different node types
        {
          selector: 'node[type = "User"]',
          style: {
            'background-color': 'hsl(221, 83%, 65%)',
            'border-color': 'hsl(221, 83%, 75%)',
            'border-width': 5,
            'border-opacity': 0.6
          }
        },
        {
          selector: 'node[type = "Document"]',
          style: {
            'background-color': 'hsl(142, 76%, 36%)',
            'border-color': 'hsl(142, 76%, 46%)',
            'border-width': 5,
            'border-opacity': 0.6
          }
        },
        {
          selector: 'node[type = "Policy"]',
          style: {
            'background-color': 'hsl(35, 92%, 65%)',
            'border-color': 'hsl(35, 92%, 75%)',
            'border-width': 5,
            'border-opacity': 0.6
          }
        },
        {
          selector: 'node[type = "Infrastructure"]',
          style: {
            'background-color': 'hsl(354, 70%, 54%)',
            'border-color': 'hsl(354, 70%, 64%)',
            'border-width': 5,
            'border-opacity': 0.6
          }
        },
        {
          selector: 'node[type = "Group"]',
          style: {
            'background-color': 'hsl(267, 83%, 60%)',
            'border-color': 'hsl(267, 83%, 70%)',
            'border-width': 5,
            'border-opacity': 0.6
          }
        }
      ],
      minZoom: 0.1,
      maxZoom: 3,
      wheelSensitivity: 0.3,
      motionBlur: true,
      motionBlurOpacity: 0.2,
      pixelRatio: 'auto'
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
    
    // Edge hover effects
    cy.on('mouseover', 'edge', function(evt) {
      const edge = evt.target;
      edge.addClass('hover');
    });
    
    cy.on('mouseout', 'edge', function(evt) {
      const edge = evt.target;
      edge.removeClass('hover');
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
    } else if (layoutName === 'concentric') {
      Object.assign(layoutOptions, {
        minNodeSpacing: 120, // Increase the minimum spacing between nodes
        concentric: function(node: any) {
          // Define how nodes are arranged in concentric circles
          // Higher values = placed more toward the center
          if (node.data('type') === 'Policy') return 5; // Central node
          return 2; // Outer nodes
        },
        levelWidth: function(nodes: any) {
          // Define how many nodes to put in each concentric level
          return 2;
        },
        spacingFactor: 1.5,  // More space between levels
        avoidOverlap: true,  // Prevent node overlap
        nodeDimensionsIncludeLabels: true // Include labels in layout calculations
      });
    } else if (layoutName === 'circle') {
      Object.assign(layoutOptions, {
        // Circular layout options
        radius: 250,  // Circle radius
        startAngle: 3 / 2 * Math.PI, // Start at top (in radians)
        sweep: 2 * Math.PI, // Full circle
        clockwise: true,
        avoidOverlap: true
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
      <div id="graph-container" ref={containerRef} className="flex-1"></div>
      
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
