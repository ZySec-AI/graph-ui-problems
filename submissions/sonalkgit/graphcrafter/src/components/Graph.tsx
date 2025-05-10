/** 
 * This component renders a graph using Cytoscape.js and the Dagre layout. 
 * It displays nodes and edges based on the provided graph data and applies 
 * a grid layout to position the nodes. Tooltips are also shown for additional information.
 */

import React, { useEffect, useRef, useState } from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';
import Tooltip from './Tooltip';

cytoscape.use(dagre);

import type { GraphData } from '../types';

interface Props {
  graphData: GraphData;
}

const Graph: React.FC<Props> = ({ graphData }) => {
  const cyRef = useRef<cytoscape.Core | null>(null);

  const [cyReady, setCyReady] = useState(false);

  const elements = [
    /** Map nodes to Cytoscape elements */
    ...graphData.nodes.map((node) => ({
      data: {
        id: node.id,
        label: node.label,
        type: node.type,
        ...node.properties,
      },
      style: {
        backgroundColor: node.style?.color || '#888',
        shape: node.style?.shape || 'ellipse',
        label: node.label,
        color: '#fff',
        textValign: 'center',
        textHalign: 'center',
        fontSize: 10,
        padding: 10,
      },
    })),
    /** Map edges to Cytoscape elements */
    ...graphData.edges.map((edge, index) => ({
      data: {
        id: `e${index}`,
        source: edge.source,
        target: edge.target,
        label: edge.label,
      },
      style: {
        width: 3,
        lineColor: edge.style?.color || '#999',
        lineStyle: edge.style?.lineType || 'solid',
        lineDashPattern: edge.style?.lineType === 'dashed' ? [6, 3] : undefined,
        targetArrowShape: 'triangle',
        targetArrowColor: edge.style?.color || '#999',
        curveStyle: 'unbundled-bezier',
        edgeTextRotation: 'autorotate',
        label: edge.label,
        fontSize: 10,
        color: '#fff',
      },
    })),
  ];

  /** Layout configuration for graph */
  const layout = {
    name: 'grid',
    rows: 5,
    cols: 5,
    padding: 50,
    fit: true,
    animate: true,
    nodeOverlap: 10,
  };

  useEffect(() => {
    if (cyRef.current) {
      cyRef.current.layout(layout as any).run();
    }
  }, [elements]);

  return (
    <div style={{ height: '100vh', width: '100%', position: 'relative' }}>
      {/* Render Cytoscape component with the elements and layout */}
      <CytoscapeComponent
        elements={elements}
        style={{ width: '100%', height: '100%' }}
        cy={(cy) => {
          cyRef.current = cy;
          setCyReady(true);
        }}
      />
      {/* Show the tooltip once Cytoscape is ready */}
      {cyReady && cyRef.current && <Tooltip cy={cyRef.current} />}
    </div>
  );
};

export default Graph;
