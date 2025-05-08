import { memo } from "react"
import { type EdgeProps, getSmoothStepPath, EdgeLabelRenderer } from "reactflow"
import type { GraphEdge } from "../types"

function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  style = {},
}: EdgeProps<GraphEdge>) {
  const edgeStyle = data?.style || {}
  const { color = "#64748b", dashed = false, width = 2 } = edgeStyle

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  const isDirectional = data?.direction === "one-way"

  return (
    <>
      <path
        id={id}
        style={{
          stroke: color,
          strokeWidth: width,
          strokeDasharray: dashed ? "5,5" : "none",
          ...style,
        }}
        className="react-flow__edge-path transition-all duration-200 hover:stroke-2"
        d={edgePath}
        markerEnd={isDirectional ? "url(#arrow)" : undefined}
      />

      {data?.label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: "all",
            }}
            className="px-2 py-1 rounded-md bg-slate-800/90 backdrop-blur-sm text-xs text-white border border-slate-700 shadow-md"
          >
            {data.label}
          </div>
        </EdgeLabelRenderer>
      )}

      <defs>
        <marker
          id="arrow"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill={color} />
        </marker>
      </defs>
    </>
  )
}

export default memo(CustomEdge)
