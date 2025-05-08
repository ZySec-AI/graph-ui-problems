import { useCallback, useMemo, useState } from "react"
import ReactFlow, {
  Background,
  Controls,
  type Edge,
  type Node,
  type NodeTypes,
  type EdgeTypes,
  useNodesState,
  useEdgesState,
  Panel,
  type NodeMouseHandler,
  type EdgeMouseHandler,
  useReactFlow,
  ReactFlowProvider,
} from "reactflow"
import "reactflow/dist/style.css"

import type { GraphData, GraphNode, GraphEdge } from "../types"
import CustomNode from "./CustomNode"
import CustomEdge from "./CustomEdge"
import { Search, ZoomIn, ZoomOut } from "lucide-react"
import { useLayoutStore } from '../store/layout'



interface GraphVisualizationProps {
  data: GraphData
}

const nodeTypes: NodeTypes = {
  custom: CustomNode,
}

const edgeTypes: EdgeTypes = {
  custom: CustomEdge,
}




function GraphVisualizationInner({ data }: GraphVisualizationProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [selectedGroups, setSelectedGroups] = useState<Set<string>>(new Set())
  const [searchTerm, setSearchTerm] = useState("")
  const [tooltipNode, setTooltipNode] = useState<GraphNode | null>(null)
  const [tooltipEdge, setTooltipEdge] = useState<GraphEdge | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })

  const { fitView, zoomIn, zoomOut } = useReactFlow()
  const layoutMode = useLayoutStore((state) => state.layoutMode)
  
  useMemo(() => {
    if (!data) return

    // const graphNodes: Node[] = data.nodes.map((node,i) => ({
    //   id: node.id,
    //   type: "custom",
    //   position: {
    //     x: (i % 5) * 200, 
    //     y: Math.floor(i / 5) * 150,
    //   },
    //   data: {
    //     ...node,
    //     selected: selectedGroups.size === 0 || selectedGroups.has(node.group || ""),
    //     searchMatch:
    //       searchTerm === "" ||
    //       node.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //       node.type.toLowerCase().includes(searchTerm.toLowerCase()),
    //   },
    // }))

    const graphNodes: Node[] = data.nodes.map((node, i) => {
      const position =
        layoutMode === "column"
          ? { x: (i % 5) * 200, y: Math.floor(i / 5) * 150 }
          : { x: Math.random() * 800, y: Math.random() * 600 }
    
      return {
        id: node.id,
        type: "custom",
        position,
        data: {
          ...node,
          selected: selectedGroups.size === 0 || selectedGroups.has(node.group || ""),
          searchMatch:
            searchTerm === "" ||
            node.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
            node.type.toLowerCase().includes(searchTerm.toLowerCase()),
        },
      }
    })
    

    const graphEdges: Edge[] = data.edges.map((edge) => ({
      id: `${edge.source}-${edge.target}`,
      source: edge.source,
      target: edge.target,
      type: "custom",
      data: {
        ...edge,
      },
      animated: edge.style?.animated || false,
    }))

    setNodes(graphNodes)
    setEdges(graphEdges)

    setTimeout(() => {
      fitView({ padding: 0.2 })
    }, 100)
  }, [data, selectedGroups, searchTerm, fitView, setNodes, setEdges,layoutMode])

  const groups = useMemo(() => {
    if (!data) return []
    const groupSet = new Set<string>()
    data.nodes.forEach((node) => {
      if (node.group) {
        groupSet.add(node.group)
      }
    })
    return Array.from(groupSet)
  }, [data])

  const onNodeMouseEnter: NodeMouseHandler = useCallback(
    (_, node) => {
      const originalNode = data.nodes.find((n) => n.id === node.id)
      if (originalNode) {
        setTooltipNode(originalNode)
        setTooltipPosition({ x: node.position.x, y: node.position.y })
      }
    },
    [data.nodes],
  )

  const onNodeMouseLeave: NodeMouseHandler = useCallback(() => {
    setTooltipNode(null)
  }, [])

  const onEdgeMouseEnter: EdgeMouseHandler = useCallback(
    (event, edge) => {
      const originalEdge = data.edges.find((e) => e.source === edge.source && e.target === edge.target)
      if (originalEdge) {
        setTooltipEdge(originalEdge)
        setTooltipPosition({ x: event.clientX, y: event.clientY })
      }
    },
    [data.edges],
  )

  const onEdgeMouseLeave: EdgeMouseHandler = useCallback(() => {
    setTooltipEdge(null)
  }, [])

  const toggleGroup = useCallback((group: string) => {
    setSelectedGroups((prev) => {
      const newGroups = new Set(prev)
      if (newGroups.has(group)) {
        newGroups.delete(group)
      } else {
        newGroups.add(group)
      }
      return newGroups
    })
  }, [])

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodeMouseEnter={onNodeMouseEnter}
        onNodeMouseLeave={onNodeMouseLeave}
        onEdgeMouseEnter={onEdgeMouseEnter}
        onEdgeMouseLeave={onEdgeMouseLeave}
        fitView
        minZoom={0.1}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#334155" gap={16} size={1} />
        <Controls className="bg-slate-800 border-slate-700 rounded-lg shadow-xl" />

        <Panel
          position="top-left"
          className="bg-slate-800/90 backdrop-blur-sm p-3 rounded-lg border border-slate-700 shadow-xl"
        >
          <div className="flex flex-col gap-3">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search nodes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-full bg-slate-700 border border-slate-600 rounded-md py-2 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {groups.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-slate-400 mb-2">GROUPS</h3>
                <div className="flex flex-wrap gap-2">
                  {groups.map((group) => (
                    <button
                      key={group}
                      className={`px-2 py-1 text-xs rounded-full cursor-pointer transition-colors ${
                        selectedGroups.has(group)
                          ? "bg-emerald-500 text-white"
                          : "bg-transparent border border-slate-600 text-slate-300 hover:bg-slate-700"
                      }`}
                      onClick={() => toggleGroup(group)}
                    >
                      {group}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Panel>

        <Panel position="bottom-right" className="flex gap-2">
          <button
            onClick={() => zoomIn()}
            className="p-2 rounded-full bg-slate-800/90 backdrop-blur-sm border border-slate-700 shadow-lg hover:bg-slate-700 transition-colors"
          >
            <ZoomIn size={18} />
          </button>
          <button
            onClick={() => zoomOut()}
            className="p-2 rounded-full bg-slate-800/90 backdrop-blur-sm border border-slate-700 shadow-lg hover:bg-slate-700 transition-colors"
          >
            <ZoomOut size={18} />
          </button>
        </Panel>
      </ReactFlow>

      {tooltipNode && (
        <div
          className="absolute z-50 p-3 rounded-lg bg-slate-800/95 backdrop-blur-sm border border-slate-700 shadow-xl text-white max-w-xs"
          style={{
            left: `${tooltipPosition.x + 20}px`,
            top: `${tooltipPosition.y - 20}px`,
            transform: "translate(0, -100%)",
          }}
        >
          <div className="font-semibold mb-2 pb-2 border-b border-slate-700 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tooltipNode.style?.color || "#64748b" }} />
            {tooltipNode.label}
          </div>

          {tooltipNode.properties && Object.keys(tooltipNode.properties).length > 0 && (
            <div className="grid gap-1">
              {Object.entries(tooltipNode.properties).map(([key, value]) => (
                <div key={key} className="grid grid-cols-[1fr,auto] gap-2 text-sm">
                  <span className="text-slate-400">{key}:</span>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tooltipEdge && (
        <div
          className="absolute z-50 p-3 rounded-lg bg-slate-800/95 backdrop-blur-sm border border-slate-700 shadow-xl text-white max-w-xs"
          style={{
            left: `${tooltipPosition.x }px`,
            top: `${tooltipPosition.y}px`,
          }}
        >
          <div className="font-semibold mb-2 pb-2 border-b border-slate-700">{tooltipEdge.label || "Relationship"}</div>

          <div className="grid gap-1 text-sm">
            <div className="grid grid-cols-[1fr,auto] gap-2">
              <span className="text-slate-400">From:</span>
              <span className="font-medium">{tooltipEdge.source}</span>
            </div>
            <div className="grid grid-cols-[1fr,auto] gap-2">
              <span className="text-slate-400">To:</span>
              <span className="font-medium">{tooltipEdge.target}</span>
            </div>
            <div className="grid grid-cols-[1fr,auto] gap-2">
              <span className="text-slate-400">Direction:</span>
              <span className="font-medium">{tooltipEdge.direction || "two-way"}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function GraphVisualization(props: GraphVisualizationProps) {
  return (
    <ReactFlowProvider>
      <GraphVisualizationInner {...props} />
    </ReactFlowProvider>
  )
}
