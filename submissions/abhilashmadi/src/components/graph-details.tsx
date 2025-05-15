import useGraphyEditorContext from "@/hooks/use-graphy-store";
import { Hexagon, Workflow } from "lucide-react";
import { type FC } from 'react';

const GraphDetails: FC = () => {
  const { state } = useGraphyEditorContext();

  return (<div className="absolute top-8 left-8 flex text-xs flex-col gap-1">
    <p><Hexagon size={14} className="inline-block mr-1" /><span>[NODES]: </span><span>{state?.nodes?.length ?? 0}</span></p>
    <p><Workflow size={14} className="inline-block mr-1" /><span>[EDGES]: </span><span>{state?.edges?.length ?? 0}</span></p>
  </div>)
}

export default GraphDetails;