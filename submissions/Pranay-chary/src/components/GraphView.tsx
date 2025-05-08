import React, { useCallback, useMemo, useState, useEffect } from 'react';
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  useNodesState,
  useEdgesState,
  MarkerType,
  Position,
  MiniMap,
  Panel,
  useReactFlow,
  BaseEdge,
  getBezierPath,
  Handle,
} from 'reactflow';
import type { Node, Edge, NodeProps, EdgeProps } from 'reactflow';
import 'reactflow/dist/style.css';
import type { GraphData, NodeData, EdgeData } from '../types/graph';

const CustomNode = ({ data }: NodeProps) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'healthy': return 'bg-green-400';
      case 'warning': return 'bg-yellow-400';
      case 'error': return 'bg-red-400';
      default: return 'bg-gray-400';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'gateway': return '🌐';
      case 'service': return '⚙️';
      case 'database': return '💾';
      case 'cache': return '⚡';
      case 'queue': return '📨';
      case 'monitoring': return '📊';
      case 'security-group': return '🛡️';
      default: return '📦';
    }
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div 
        className={`px-4 py-3 shadow-lg rounded-lg bg-white dark:bg-gray-800 border-2 transition-all duration-300 ${showTooltip ? 'scale-110 shadow-xl' : ''}`}
        style={{ borderColor: data.style.color }}
      >
        <Handle
          type="target"
          position={Position.Left}
          id="left"
          className="w-3 h-3 !bg-gray-200 border-2 transition-colors duration-300"
          style={{ borderColor: data.style.color }}
        />
        <Handle
          type="source"
          position={Position.Right}
          id="right"
          className="w-3 h-3 !bg-gray-200 border-2 transition-colors duration-300"
          style={{ borderColor: data.style.color }}
        />
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0 text-xl" role="img" aria-label={data.type}>
            {getTypeIcon(data.type)}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <div className="text-sm font-bold dark:text-white" style={{ color: data.style.color }}>
                {data.label}
              </div>
              {data.properties.status && (
                <div className={`w-2 h-2 rounded-full ${getStatusColor(data.properties.status)}`} />
              )}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {data.properties.version || data.type}
            </div>
          </div>
        </div>
      </div>
      {showTooltip && (
        <div className="absolute z-50 p-2 text-sm bg-black text-white rounded shadow-lg -translate-y-full -translate-x-1/4 mb-2 w-48">
          <div className="font-bold mb-1">{data.label}</div>
          <div className="text-gray-300 text-xs mb-1">Type: {data.type}</div>
          <div className="text-gray-300 text-xs mb-1">Group: {data.group}</div>
          {Object.entries(data.properties).map(([key, value]) => (
            <div key={key} className="text-gray-300 text-xs">
              {key}: {String(value)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const CustomEdge = ({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style, markerEnd, markerStart, label }: EdgeProps) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} markerStart={markerStart} style={style} />
      {label && (
        <text
          x={labelX}
          y={labelY}
          className="text-xs fill-gray-600"
          textAnchor="middle"
          dominantBaseline="middle"
          style={{ pointerEvents: 'none' }}
        >
          {label}
        </text>
      )}
    </>
  );
};

const nodeTypes = {
  custom: CustomNode,
};

const edgeTypes = {
  default: CustomEdge,
  bidirectional: CustomEdge,
};

interface GraphSettings {
  showLabels: boolean;
  showIcons: boolean;
  layout: 'horizontal' | 'vertical' | 'radial';
  nodePadding: number;
  nodeSpacing: number;
  zoomLevel: number;
}

interface GraphViewProps {
  data: GraphData;
  settings: GraphSettings;
  searchQuery: string;
}

const GraphView: React.FC<GraphViewProps> = ({ data, settings, searchQuery }: GraphViewProps) => {
  const reactFlowInstance = useReactFlow();
  const proOptions = { hideAttribution: true };
  const [selectedGroup, setSelectedGroup] = useState<string>('all');

  const groups = useMemo(() => [
    'all',
    ...new Set(data.nodes.map((node) => node.group))
  ], [data.nodes]);

  // Update layout when data changes
  useEffect(() => {
    const updateLayout = async () => {
      // Wait for nodes to be rendered
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Get current viewport
      const { x = 0, y = 0 } = reactFlowInstance.getViewport();
      
      // Calculate layout based on settings
      let layout = { x, y };
      switch (settings.layout) {
        case 'horizontal':
          layout = {
            x: window.innerWidth / 2,
            y: window.innerHeight / 4
          };
          break;
        case 'vertical':
          layout = {
            x: window.innerWidth / 4,
            y: window.innerHeight / 2
          };
          break;
        case 'radial':
          layout = {
            x: window.innerWidth / 2,
            y: window.innerHeight / 2
          };
          break;
      }
      
      // Apply new viewport
      reactFlowInstance.setViewport({
        x: layout.x,
        y: layout.y,
        zoom: settings.zoomLevel
      });

      // Fit view with padding
      reactFlowInstance.fitView({
        padding: 0.2,
        includeHiddenNodes: false,
        duration: 800
      });
    };

    updateLayout();
  }, [data, settings.layout, settings.zoomLevel, reactFlowInstance]);



  const initialNodes: Node[] = useMemo(() => {
    const searchLower = searchQuery.toLowerCase();
    const groupPositions: { [key: string]: { count: number, baseY: number } } = {};
    let groupIndex = 0;

    data.nodes.forEach((node) => {
      if (!groupPositions[node.group]) {
        groupPositions[node.group] = {
          count: 0,
          baseY: groupIndex * 300
        };
        groupIndex++;
      }
      groupPositions[node.group].count++;
    });

    return data.nodes.map((node: NodeData) => {
      const pos = groupPositions[node.group];
      const x = 150 + (pos.count % 3) * 250;
      const y = pos.baseY + Math.floor(pos.count / 3) * 100;
      pos.count--;

      const matchesSearch = searchQuery
        ? node.label.toLowerCase().includes(searchLower) ||
          node.type.toLowerCase().includes(searchLower) ||
          Object.entries(node.properties).some(
            ([key, value]) =>
              key.toLowerCase().includes(searchLower) ||
              String(value).toLowerCase().includes(searchLower)
          )
        : true;

      return {
        id: node.id,
        type: 'custom',
        position: { x, y },
        data: node,
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
        hidden: (selectedGroup !== 'all' && selectedGroup !== node.group) || !matchesSearch,
        sourceHandle: 'right',
        targetHandle: 'left',
        handleBounds: {
          source: [{ id: 'right', position: Position.Right }],
          target: [{ id: 'left', position: Position.Left }],
        },
        selected: false,
      };
    });
  }, [data.nodes, selectedGroup, searchQuery]);

  const getEdgeType = (direction: string) => {
    switch (direction) {
      case '->':
        return 'default';
      case '<->':
        return 'bidirectional';
      default:
        return 'default';
    }
  };

  const initialEdges: Edge[] = useMemo(() => {
    return data.edges.map((edge: EdgeData) => {
      const sourceNode = data.nodes.find(n => n.id === edge.source);
      const targetNode = data.nodes.find(n => n.id === edge.target);
      const isVisible = 
        selectedGroup === 'all' || 
        (sourceNode?.group === selectedGroup && targetNode?.group === selectedGroup);

      const edgeType = getEdgeType(edge.direction);
      const lineType = edge.style.lineType || 'solid';

      return {
        id: `${edge.source}-${edge.target}`,
        source: edge.source,
        target: edge.target,
        sourceHandle: 'right',
        targetHandle: 'left',
        label: edge.label,
        type: edgeType,
        animated: false,
        hidden: !isVisible,
        style: {
          strokeWidth: 2,
          strokeDasharray: lineType === 'dotted' ? '5,5' : lineType === 'dashed' ? '10,10' : undefined,
          stroke: edge.style.color || '#555',
        },
        markerEnd: edge.direction.includes('>') ? {
          type: MarkerType.ArrowClosed,
          color: edge.style.color || '#555',
        } : undefined,
        markerStart: edge.direction.includes('<') ? {
          type: MarkerType.ArrowClosed,
          color: edge.style.color || '#555',
        } : undefined,
      };
    });
  }, [data.edges, data.nodes, selectedGroup]);

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    console.log('Node clicked:', node.id);
  }, []);

  useEffect(() => {
    reactFlowInstance.setViewport({
      x: 0,
      y: 0,
      zoom: settings.zoomLevel,
    });
  }, [settings.zoomLevel, reactFlowInstance]);



  return (
    <div style={{ width: '100%', height: '700px', position: 'relative' }} className="react-flow-wrapper">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{ padding: 0.5, includeHiddenNodes: false }}
        defaultViewport={{ x: 0, y: 0, zoom: settings.zoomLevel }}
        proOptions={proOptions}
        className="react-flow"
        style={{ gap: settings.nodeSpacing }}
      >
        <Controls />
        <MiniMap />
        <Background
          variant={BackgroundVariant.Dots}
          gap={12}
          size={1}
          color="#e5e7eb"
        />
        <Panel position="top-right">
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="px-3 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white border-gray-300 dark:bg-gray-700 dark:text-white dark:border-gray-600"
          >
            <option value="all">All Groups</option>
            {groups.map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
        </Panel>
      </ReactFlow>
    </div>
  );
};

export default GraphView; 