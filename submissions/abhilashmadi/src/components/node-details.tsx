import { type FC } from 'react';
import type { SimulationNode } from "@components/graph-canvas";
import { SplinePointer } from "lucide-react";

interface INodeDetailsProps {
  details: SimulationNode;
}

const NodeDetails: FC<INodeDetailsProps> = ({ details }) => {
  const {
    id,
    label,
    type,
    group,
    properties,
    style,
  } = details;

  return (
    <div className="absolute bottom-8 right-8 max-w-sm bg-background shadow border p-2 text-sm rounded">
      <h3 className="text-sm text-center font-semibold p-2 bg-muted rounded"><SplinePointer className="inline-block" size={20} /> Node Details</h3>
      <ul className="p-2">
        <li><span>ID:</span> <span>{id}</span></li>
        <li><span>Label:</span> <span>{label}</span></li>
        <li><span>Type:</span> <span>{type}</span></li>
        <li><span>Group:</span> <span>{group}</span></li>
        <li><span>Manufacturer:</span> <span>{properties?.manufacturer || 'N/A'}</span></li>
        <li><span>Color:</span> <span className="capitalize" style={{ color: style?.color }}>{style?.color || 'N/A'}</span></li>
        <li><span>Shape:</span> <span className="capitalize">{style?.shape || 'N/A'}</span></li>
      </ul>
    </div>
  );
};

export default NodeDetails;
