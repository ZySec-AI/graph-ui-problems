import { memo } from "react"
import { Handle, Position, type NodeProps } from "reactflow"
import type { GraphNode } from "../types"

function CustomNode({ data }: NodeProps<GraphNode>) {
  if (!data.selected || !data.searchMatch) {
    return null
  }

  const { label, type, style = {} } = data
  const { color = "#64748b", shape = "circle" } = style

  const getNodeShape = () => {
    switch (shape.toLowerCase()) {
      case "rectangle":
        return "rounded-md"
      case "diamond":
        return "transform "
      case "hexagon":
        return "clip-path-[polygon(25%_0%,75%_0%,100%_50%,75%_100%,25%_100%,0%_50%)]"
      default:
        return "rounded-full"
    }
  }

  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-slate-700 border-2"
        style={{ borderColor: color }}
      />

      <div
        className={`px-4 py-2 shadow-lg border-2 flex flex-col items-center justify-center min-w-[100px] min-h-[40px] transition-all duration-200 hover:shadow-xl ${getNodeShape()}`}
        style={{
          backgroundColor: `${color}20`,
          borderColor: color,
        }}
      >
        <div className="font-medium text-center">{label}</div>
        {type && (
          <div className="mt-1 text-xs px-2 py-0.5 rounded-full border" style={{ borderColor: color, color }}>
            {type}
          </div>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-slate-700 border-2"
        style={{ borderColor: color }}
      />
    </>
  )
}

export default memo(CustomNode)
