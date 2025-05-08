import type { GraphNode } from "../types"

interface NodeTooltipProps {
  node: GraphNode
  position: { x: number; y: number }
}

export default function NodeTooltip({ node, position }: NodeTooltipProps) {
  if (!node.properties || Object.keys(node.properties).length === 0) {
    return null
  }

  return (
    <div
      className="absolute z-50 p-3 rounded-lg bg-slate-800/95 backdrop-blur-sm border border-slate-700 shadow-xl text-white max-w-xs"
      style={{
        left: `${position.x + 20}px`,
        top: `${position.y - 20}px`,
        transform: "translate(0, -100%)",
      }}
    >
      <div className="font-semibold mb-2 pb-2 border-b border-slate-700 flex items-center gap-2">
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: node.style?.color || "#64748b" }} />
        {node.label}
      </div>

      <div className="grid gap-1">
        {Object.entries(node.properties).map(([key, value]) => (
          <div key={key} className="grid grid-cols-[1fr,auto] gap-2 text-sm">
            <span className="text-slate-400">{key}:</span>
            <span className="font-medium">{String(value)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
