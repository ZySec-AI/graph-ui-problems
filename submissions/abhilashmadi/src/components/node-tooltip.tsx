import React from "react";
import { createPortal } from "react-dom";

type SimulationNode = {
  label: string;
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  properties?: Record<string, any>;
  group?: string;
  x?: number;
  y?: number;
};

interface INodeTooltipProps {
  node: SimulationNode | null;
  position: { x: number; y: number } | null;
  visible: boolean;
};

export const NodeTooltip: React.FC<INodeTooltipProps> = (props) => {
  const { node, position, visible } = props;
  if (!visible || !node || !position) return null;

  return createPortal(<div
    className="absolute z-50 max-w-sm rounded border p-2 bg-background text-xs"
    style={{
      top: position.y,
      left: position.x,
      pointerEvents: "none",
    }}>
    <div>
      <strong className="text-primary">{node.label}</strong>
      <span className="text-muted-foreground"> ({node.type})</span>
    </div>

    <div>
      {Object.entries(node.properties || {}).map(([key, value]) => (
        <div key={key}>
          <strong className="capitalize">{key}:</strong> {String(value)}
        </div>
      ))}
      {node.group && (
        <div>
          <strong>Group:</strong> {node.group}
        </div>
      )}
    </div>
  </div>,
    document.getElementById('node-tooltip') || document.body);
};

export default NodeTooltip;