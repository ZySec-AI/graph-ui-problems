/* eslint-disable react-hooks/exhaustive-deps */

import { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  Panel,
  ReactFlowProvider,
  useReactFlow,
  BackgroundVariant,
  MarkerType,
  useNodesState,
  useEdgesState,
  ControlButton,
  MiniMap,
} from 'reactflow';
import type { Edge, Node, NodeTypes } from 'reactflow';
import 'reactflow/dist/style.css';
import type { GraphData as AppGraphData, Node as AppNode } from '../types/graph';
import dagre from '@dagrejs/dagre';

// Custom node components
import CustomNode from './nodes/CustomNode';
import CustomNodeDetails from './nodes/CustomNodeDetails';

interface CustomNodeData extends AppNode {
  isHighlighted?: boolean;
}

const nodeTypes: NodeTypes = {
  custom: CustomNode,
};

// Layout types
type LayoutType = 'dagre' | 'force' | 'radial' | 'grid';

// Graph layout settings
const NODE_WIDTH = 150;
const NODE_HEIGHT = 80;
const LAYOUT_OPTIONS = {
  dagre: {
    rankdir: 'LR', // 'TB' (top to bottom) or 'LR' (left to right)
    align: 'UL', // Alignment for rank nodes
    ranker: 'network-simplex', // Type of optimization, options are 'network-simplex', 'tight-tree' or 'longest-path'
    nodesep: 80, // Distance between nodes on the same rank
    ranksep: 120, // Distance between ranks
  },
  force: {
    nodeDistance: 150,
    centerStrength: 0.5,
  },
  grid: {
    spacing: 50,
  },
  radial: {
    nodeDistance: 200,
    centerStrength: 0.5,
  }
};

// Function to get layout based on the specified type
const getLayoutedElements = (nodes: Node[], edges: Edge[], layout: LayoutType = 'dagre') => {
  if (nodes.length === 0) return { nodes, edges };

  if (layout === 'dagre') {
    // Dagre layout (hierarchical)
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));
    dagreGraph.setGraph(LAYOUT_OPTIONS.dagre);

    // Set nodes
    nodes.forEach((node) => {
      dagreGraph.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
    });

    // Set edges
    edges.forEach((edge) => {
      dagreGraph.setEdge(edge.source, edge.target);
    });

    // Calculate layout
    dagre.layout(dagreGraph);

    // Apply layout positions to nodes
    const layoutedNodes = nodes.map((node) => {
      const nodeWithPosition = dagreGraph.node(node.id);
      return {
        ...node,
        position: {
          x: nodeWithPosition.x - NODE_WIDTH / 2,
          y: nodeWithPosition.y - NODE_HEIGHT / 2,
        },
      };
    });

    return { nodes: layoutedNodes, edges };
  }

  // Will implement other layouts if needed
  return { nodes, edges };
};

interface GraphProps {
  graphData: AppGraphData | null;
  searchResults?: string[];
}

const GraphInner = ({ graphData, searchResults = [] }: GraphProps) => {
  const [selectedNode, setSelectedNode] = useState<AppNode | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [layoutType, setLayoutType] = useState<LayoutType>('dagre');
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { fitView, project } = useReactFlow();

  // Convert app graph data to React Flow nodes and edges
  useEffect(() => {
    if (!graphData) {
      setNodes([]);
      setEdges([]);
      setLoading(false);
      return;
    }

    try {
      const initialNodes: Node[] = graphData.nodes.map((node) => {
        // Check if the node is in search results
        const isHighlighted = searchResults.includes(node.id);
        
        return {
          id: node.id,
          data: {
            ...node,
            isHighlighted,
          },
          position: { x: 0, y: 0 },
          type: 'custom',
          className: isHighlighted ? 'search-highlight' : '',
        };
      });

      // Process edges
      const initialEdges: Edge[] = graphData.edges.map((edge) => {
        return {
          id: `${edge.source}-${edge.target}`,
          source: edge.source,
          target: edge.target,
          label: edge.label,
          animated: edge.style.dashed,
          style: {
            stroke: edge.style.color,
            strokeWidth: 2,
            strokeDasharray: edge.style.dashed ? '5,5' : '',
          },
          labelStyle: {
            fontSize: 12,
            fill: edge.style.color,
            fontWeight: 500,
          },
          labelBgStyle: {
            fill: '#ffffff',
            fillOpacity: 0.8,
            rx: 4,
            ry: 4,
          },
          markerEnd: edge.direction === 'one-way' 
            ? { type: MarkerType.Arrow, color: edge.style.color }
            : undefined,
        };
      });

      // Get layouted elements
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
        initialNodes, 
        initialEdges, 
        layoutType
      );

      setNodes(layoutedNodes);
      setEdges(layoutedEdges);
      setLoading(false);
      console.log(project);

      // Fit view after a short delay to ensure rendering
      setTimeout(() => {
        fitView({ padding: 0.2, includeHiddenNodes: false });
      }, 100);

    } catch (error) {
      console.error('Error processing graph data:', error);
      setError('Failed to process graph data');
      setLoading(false);
    }
  }, [graphData, searchResults, layoutType, setNodes, setEdges, fitView]);


  const onLayoutChange = useCallback((type: LayoutType) => {
    setLayoutType(type);
  }, []);


  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    if (!graphData) return;
    
    const appNode = graphData.nodes.find(n => n.id === node.id);
    setSelectedNode(appNode || null);
  }, [graphData]);


  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full bg-gray-50 dark:bg-gray-900 rounded-lg animate-pulse">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading graph data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-full bg-red-50 dark:bg-red-900/20 text-red-500 rounded-lg">
        <div className="text-center p-6">
          <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <p className="font-medium">{error}</p>
        </div>
      </div>
    );
  }

  if (!nodes.length) {
    return (
      <div className="flex justify-center items-center h-full bg-white dark:bg-gray-800 rounded-lg">
        <div className="text-center p-6">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <p className="text-gray-600 dark:text-gray-400">No graph data available</p>
          <p className="text-sm text-gray-500 mt-1">Please load data using the controls above</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-200px)] lg:h-full w-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-lg relative bg-white dark:bg-gray-800">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.2}
        maxZoom={4}
        proOptions={{ hideAttribution: true }}
        className="react-flow-graph"
        elementsSelectable={true}
        selectNodesOnDrag={false}
        snapToGrid={true}
        snapGrid={[15, 15]}
      >
        <Background color="#aaa" variant={BackgroundVariant.Dots} gap={20} />
        
        <Controls position="bottom-right">
          <ControlButton 
            onClick={() => fitView({ padding: 0.2, includeHiddenNodes: false })}
            title="Fit View"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </ControlButton>
        </Controls>
        
        <MiniMap 
          nodeColor={(node) => {
            const nodeData = node.data as CustomNodeData;
            return nodeData.style?.color || '#eee';
          }}
        //   maskColor="rgba(49, 130, 206, 0.3)"
          style={{
            height: 120,
            right: 40,
            bottom: 80,
          }}
          zoomable
          pannable
        />
        
        {/* Top Panel - Layout Controls */}
        <Panel position="top-right" className="bg-white dark:bg-gray-800 shadow-md p-2 rounded-md m-2">
          <div className="flex flex-col gap-2">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Layout</div>
            <div className="flex gap-1">
              <button
                onClick={() => onLayoutChange('dagre')}
                className={`text-xs px-2 py-1 rounded ${
                  layoutType === 'dagre' 
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
                title="Hierarchical layout"
              >
                <span className="hidden sm:inline">Hierarchical</span>
                <span className="sm:hidden">H</span>
              </button>
              <button
                onClick={() => {
                  if (layoutType === 'dagre') {
                    // Toggle direction for dagre layout
                    LAYOUT_OPTIONS.dagre.rankdir = LAYOUT_OPTIONS.dagre.rankdir === 'LR' ? 'TB' : 'LR';
                    onLayoutChange('dagre');
                  }
                }}
                className={`text-xs px-2 py-1 rounded ${
                  layoutType === 'dagre'
                    ? 'bg-indigo-600/80 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                }`}
                title="Toggle direction"
                disabled={layoutType !== 'dagre'}
              >
                {LAYOUT_OPTIONS.dagre.rankdir === 'LR' ? 'L→R' : 'T→B'}
              </button>
              <button
                onClick={() => setNodes(nodes => nodes.map(node => ({ ...node, position: { x: Math.random() * 800, y: Math.random() * 600 } })))}
                className="text-xs px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                title="Randomize positions"
              >
                <span className="hidden sm:inline">Randomize</span>
                <span className="sm:hidden">R</span>
              </button>
            </div>
          </div>
        </Panel>
        
        {/* Bottom left panel - Search info */}
        {searchResults.length > 0 && (
          <Panel position="bottom-left" className="bg-white dark:bg-gray-800 shadow-md p-2 rounded-md m-2">
            <div className="bg-indigo-100 dark:bg-indigo-900/40 px-3 py-2 rounded-md text-xs text-indigo-800 dark:text-indigo-200 flex items-center shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {searchResults.length} matches found
            </div>
          </Panel>
        )}
      </ReactFlow>

      {/* Node details panel */}
      {selectedNode && <CustomNodeDetails node={selectedNode} onClose={() => setSelectedNode(null)} />}
    </div>
  );
};

const Graph = (props: GraphProps) => {
  return (
    <ReactFlowProvider>
      <GraphInner {...props} />
    </ReactFlowProvider>
  );
};

export default Graph; 