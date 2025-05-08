import type { GraphEdge } from "../types"

interface EdgeTooltipProps {
  edge: GraphEdge
  position: { x: number; y: number }
}

export default function EdgeTooltip({ edge, position }: EdgeTooltipProps) {
  return (
    <div
      className="absolute z-50 p-3 rounded-lg bg-slate-800/95 backdrop-blur-sm border border-slate-700 shadow-xl text-white max-w-xs"
      style={{
        left: `${position.x + 10}px`,
        top: `${position.y + 10}px`,
      }}
    >
      <div className="font-semibold mb-2 pb-2 border-b border-slate-700">{edge.label || "Relationship"}</div>

      <div className="grid gap-1 text-sm">
        <div className="grid grid-cols-[1fr,auto] gap-2">
          <span className="text-slate-400">From:</span>
          <span className="font-medium">{edge.source}</span>
        </div>
        <div className="grid grid-cols-[1fr,auto] gap-2">
          <span className="text-slate-400">To:</span>
          <span className="font-medium">{edge.target}</span>
        </div>
        <div className="grid grid-cols-[1fr,auto] gap-2">
          <span className="text-slate-400">Direction:</span>
          <span className="font-medium">{edge.direction || "two-way"}</span>
        </div>
      </div>
    </div>
  )
}
