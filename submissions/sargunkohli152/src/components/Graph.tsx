import React, { useMemo, useEffect } from 'react';
import ReactFlow, { Controls, MiniMap, useNodesState, useEdgesState, MarkerType } from 'reactflow';
import type { Node, Edge, NodeTypes, EdgeTypes } from 'reactflow';
import CustomNode from './CustomNode';
import CustomEdge from './CustomEdge';
import NodePropertiesPopup from './NodePropertiesPopup';
import { getLayoutedElements } from '../utils/layout';
import { Select, MenuItem, FormControl, InputLabel, useMediaQuery } from '@mui/material';
import 'reactflow/dist/style.css';

// Type definitions for raw graph data structure
type RawNode = {
  id: string;
  label: string;
  type: string;
  properties?: Record<string, any>;
  style?: {
    color?: string;
    shape?: 'circle' | 'rectangle';
  };
  group?: string;
};

type RawEdge = {
  source: string;
  target: string;
  label?: string;
  direction?: string;
  style?: {
    dashed?: boolean;
    color?: string;
    lineType?: string;
  };
};

type GraphData = {
  nodes: RawNode[];
  edges: RawEdge[];
};

interface GraphProps {
  rawData: GraphData;
  layoutDirection?: 'LR' | 'TB';
  setLayoutDirection: (direction: 'LR' | 'TB') => void;
  isSidebarOpen: boolean;
}

const Graph: React.FC<GraphProps> = ({
  rawData,
  layoutDirection = 'LR',
  setLayoutDirection,
  isSidebarOpen,
}) => {
  const isSmallScreen = useMediaQuery('(max-width:768px)');

  // Transform raw nodes into ReactFlow node format with default styling
  const initialNodes: Node[] = useMemo(
    () =>
      rawData.nodes.map((n) => ({
        id: n.id,
        type: 'custom',
        data: {
          label: n.label,
          type: n.type,
          group: n.group,
          properties: n.properties,
          color: n.style?.color,
          shape: n.style?.shape,
        },
        style: { width: 172 },
        width: 172,
        height: 200,
        position: { x: 0, y: 0 },
      })),
    [rawData]
  );

  // Transform raw edges into ReactFlow edge format with custom styling
  const initialEdges: Edge[] = useMemo(
    () =>
      rawData.edges.map((e, i) => {
        // Handle different line types (dashed, dotted)
        let strokeDasharray: string | undefined;
        if (e.style?.lineType === 'dashed') {
          strokeDasharray = '6,6';
        } else if (e.style?.lineType === 'dotted') {
          strokeDasharray = '1.5,1.5';
        }
        const isBidirectional = e.direction === '<->';
        return {
          id: `e-${e.source}-${e.target}-${i}`,
          source: e.source,
          target: e.target,
          label: e.label,
          type: 'custom',
          animated: false,
          data: {
            dashed: e.style?.lineType === 'dashed',
          },
          style: {
            stroke: e.style?.color || '#000',
            strokeDasharray,
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: e.style?.color || '#000',
          },
          // Add start marker for bidirectional edges
          ...(isBidirectional && {
            markerStart: {
              type: MarkerType.ArrowClosed,
              color: e.style?.color || '#000',
            },
          }),
        };
      }),
    [rawData]
  );

  // Apply layout algorithm to position nodes and edges
  const { nodes: layoutedNodes, edges: layoutedEdges } = useMemo(() => {
    return getLayoutedElements(initialNodes, initialEdges, layoutDirection);
  }, [initialNodes, initialEdges, layoutDirection]);

  // State management for nodes and edges with ReactFlow hooks
  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);

  // Update node and edge positions when layout changes
  useEffect(() => {
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, [layoutedNodes, layoutedEdges, setNodes, setEdges, layoutDirection]);

  return (
    <div className="w-full h-[calc(100vh-4rem)] md:p-4 flex flex-col space-y-4">
      <div className="w-full h-full relative bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-800/50 p-4">
        {/* Layout direction selector with theme-aware styling */}
        <div className="md:flex hidden items-center mb-2 absolute top-4 right-4 z-10">
          <FormControl
            size="small"
            sx={{
              minWidth: 200,
              '& .MuiInputLabel-root': {
                color: 'rgb(107, 114, 128)', // gray-500
                '&.Mui-focused': {
                  color: 'rgb(59, 130, 246)', // blue-500
                },
                '@media (prefers-color-scheme: dark)': {
                  color: 'rgb(156, 163, 175)', // gray-400
                  '&.Mui-focused': {
                    color: 'rgb(96, 165, 250)', // blue-400
                  },
                },
              },
            }}
          >
            <InputLabel>Layout Direction</InputLabel>
            <Select
              value={layoutDirection}
              label="Layout Direction"
              onChange={(e) => setLayoutDirection(e.target.value as 'LR' | 'TB')}
              sx={{
                '& .MuiSelect-select': {
                  fontSize: '0.875rem',
                  color: 'inherit',
                },
                backgroundColor: 'white',
                color: 'inherit',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgb(156, 163, 175)', // gray-400
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgb(107, 114, 128)', // gray-500
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgb(59, 130, 246)', // blue-500
                },
                // Dark mode styles using class
                '.dark &': {
                  backgroundColor: 'rgb(17, 24, 39)', // gray-900
                  color: 'rgb(229, 231, 235)', // gray-200
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgb(75, 85, 99)', // gray-600
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgb(107, 114, 128)', // gray-500
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgb(96, 165, 250)', // blue-400
                  },
                },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    backgroundColor: 'white',
                    color: 'rgb(17, 24, 39)', // gray-900
                    // Dark mode using class
                    '.dark &': {
                      backgroundColor: 'rgb(17, 24, 39)', // gray-900
                      color: 'rgb(229, 231, 235)', // gray-200
                    },
                  },
                },
                MenuListProps: {
                  sx: {
                    // Dark mode using class
                    '.dark &': {
                      backgroundColor: 'rgb(17, 24, 39)', // gray-900
                    },
                  },
                },
              }}
            >
              <MenuItem
                value="LR"
                sx={{
                  fontSize: '0.875rem',
                  // Dark mode using class
                  '.dark &': {
                    color: 'rgb(229, 231, 235)', // gray-200
                    '&:hover': {
                      backgroundColor: 'rgba(75, 85, 99, 0.1)', // gray-600 with opacity
                    },
                  },
                }}
              >
                Left to Right
              </MenuItem>
              <MenuItem
                value="TB"
                sx={{
                  fontSize: '0.875rem',
                  // Dark mode using class
                  '.dark &': {
                    color: 'rgb(229, 231, 235)', // gray-200
                    '&:hover': {
                      backgroundColor: 'rgba(75, 85, 99, 0.1)', // gray-600 with opacity
                    },
                  },
                }}
              >
                Top to Bottom
              </MenuItem>
            </Select>
          </FormControl>
        </div>

        {/* Node properties popup for displaying node details */}
        <NodePropertiesPopup isSidebarOpen={isSidebarOpen} />

        {/* Main ReactFlow component with custom node and edge types */}
        <ReactFlow
          className="bg-white dark:bg-gray-800 h-[calc(100%-4rem)]"
          key={layoutDirection}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          proOptions={{ hideAttribution: true }}
        >
          {/* MiniMap for navigation (hidden on small screens) */}
          {!isSmallScreen && (
            <MiniMap
              className="!bg-white/50 dark:!bg-gray-900/50 !backdrop-blur-sm !rounded-md !shadow-md dark:!shadow-gray-800/50 border border-black/10 dark:border-gray-700/50 !text-sm"
              style={{ width: 120, height: 120 }}
            />
          )}
          {/* Graph controls for zoom and fit */}
          <Controls className="dark:!bg-gray-800 dark:!border-gray-700" />
        </ReactFlow>
      </div>
    </div>
  );
};

// Register custom node and edge types for ReactFlow
const nodeTypes: NodeTypes = {
  custom: CustomNode,
};

const edgeTypes: EdgeTypes = {
  custom: CustomEdge,
};

export default Graph;
