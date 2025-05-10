import React from 'react';
import { getBezierPath, BaseEdge,EdgeLabelRenderer  } from '@xyflow/react';

const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
  markerEnd,
}) => {

  const [edgePath,labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const lineType = data.style?.lineType;
  const strokeDasharray = lineType === 'dashed' ? '6,4' : lineType === 'dotted' ? '2,2' : '0';

  

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          ...style,
          strokeDasharray,
          stroke: '#fff',
        }}
        markerEnd={markerEnd}
      />
      <EdgeLabelRenderer>
        <div
        className={`absolute text-xs bg-white px-1 py-0.5 rounded border border-gray-300 pointer-events-auto`}
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
          }}
        >
          {data?.label}
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

export default CustomEdge;
