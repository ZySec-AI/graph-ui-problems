import React, { useEffect, useRef, useState, useMemo } from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import cytoscape from 'cytoscape';
import coseBilkent from 'cytoscape-cose-bilkent';
import { GraphData, Node, Edge } from '../types/graph';
import { useGraphStyles } from '../hooks/useGraphStyles';
import NodeTooltip from './NodeTooltip';

// Register the layout extension
cytoscape.use(coseBilkent);

interface GraphVisualizationProps {
  data: GraphData;
}

const GraphVisualization: React.FC<GraphVisualizationProps> = ({ data }) => {
  const cyRef = useRef<cytoscape.Core | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltipData, setTooltipData] = useState<{
    content: React.ReactNode;
    position: { x: number; y: number };
    visible: boolean;
  }>({
    content: null,
    position: { x: 0, y: 0 },
    visible: false,
  });

  const { getNodeStyle, getEdgeStyle } = useGraphStyles();
  
  // Convert GraphData to Cytoscape elements
  const elements = useMemo(() => {
    const cyElements: cytoscape.ElementDefinition[] = [];
    
    // Add nodes
    data.nodes.forEach((node: Node) => {
      cyElements.push({
        data: {
          id: node.id,
          label: node.label,
          type: node.type,
          properties: node.properties,
          style: node.style,
          group: node.group
        },
        group: 'nodes'
      });
    });
    
    // Add edges
    data.edges.forEach((edge: Edge) => {
      cyElements.push({
        data: {
          id: `${edge.source}-${edge.target}`,
          source: edge.source,
          target: edge.target,
          label: edge.label,
          direction: edge.direction,
          style: edge.style,
          properties: edge.properties || {}
        },
        group: 'edges'
      });
    });
    
    return cyElements;
  }, [data]);

  const cytoscapeStylesheet = useMemo(() => [
    {
      selector: 'node',
      style: {
        'label': 'data(label)',
        'text-valign': 'center',
        'text-halign': 'center',
        'font-size': '12px',
        'background-color': 'data(style.color)',
        'text-outline-width': 2,
        'text-outline-color': '#fff',
        'z-index': 10
      }
    },
    {
      selector: 'node[style.shape="circle"]',
      style: {
        'shape': 'ellipse'
      }
    },
    {
      selector: 'node[style.shape="rectangle"]',
      style: {
        'shape': 'rectangle'
      }
    },
    {
      selector: 'node[style.shape="diamond"]',
      style: {
        'shape': 'diamond'
      }
    },
    {
      selector: 'node[style.shape="hexagon"]',
      style: {
        'shape': 'hexagon'
      }
    },
    {
      selector: 'edge',
      style: {
        'width': 2,
        'line-color': 'data(style.color)',
        'target-arrow-color': 'data(style.color)',
        'curve-style': 'bezier',
        'label': 'data(label)',
        'font-size': '10px',
        'text-rotation': 'autorotate',
        'text-background-color': '#fff',
        'text-background-opacity': 0.8,
        'text-background-padding': '2px',
        'text-background-shape': 'rectangle'
      }
    },
    {
      selector: 'edge[direction="one-way"]',
      style: {
        'target-arrow-shape': 'triangle'
      }
    },
    {
      selector: 'edge[style.dashed=true]',
      style: {
        'line-style': 'dashed'
      }
    }
  ], []);

  useEffect(() => {
    if (cyRef.current) {
      // Initialize layout
      const layout = cyRef.current.layout({
        name: 'cose-bilkent',
        animate: false,
        nodeDimensionsIncludeLabels: true,
        fit: true,
        padding: 30,
        randomize: false,
        nodeRepulsion: 8000,
        idealEdgeLength: 150,
        edgeElasticity: 0.8,
        nestingFactor: 0.2,
        gravity: 0.4,
        numIter: 3000,
        tile: true,
        tilingPaddingVertical: 10,
        tilingPaddingHorizontal: 10
      });
      
      layout.run();

      // Setup event handlers
      cyRef.current.on('mouseover', 'node, edge', (event) => {
        const target = event.target;
        const position = event.renderedPosition || event.position;
        const element = target.data();
        
        const content = (
          <div>
            <div className="font-bold">{element.label}</div>
            <div className="text-sm text-gray-600">{element.type}</div>
            <div className="mt-2">
              {Object.entries(element.properties).map(([key, value]) => (
                <div key={key} className="text-sm">
                  <span className="font-medium">{key}: </span>
                  <span>{String(value)}</span>
                </div>
              ))}
            </div>
          </div>
        );
        
        setTooltipData({
          content,
          position: { x: position.x, y: position.y },
          visible: true
        });
      });
      
      cyRef.current.on('mouseout', 'node, edge', () => {
        setTooltipData(prev => ({ ...prev, visible: false }));
      });
    }
  }, [data]);

  return (
    <div ref={containerRef} className="w-full h-full relative">
      <CytoscapeComponent
        elements={elements}
        stylesheet={cytoscapeStylesheet as any}
        style={{ width: '100%', height: '100%' }}
        cy={(cy) => { cyRef.current = cy; }}
        wheelSensitivity={0.3}
      />
      <NodeTooltip 
        content={tooltipData.content}
        position={tooltipData.position}
        visible={tooltipData.visible}
      />
    </div>
  );
};

export default GraphVisualization;