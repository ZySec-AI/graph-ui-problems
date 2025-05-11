import React, { useEffect, useRef } from 'react';
import cytoscape from 'cytoscape';

const GraphView = ({ data }) => {
  const cyRef = useRef(null);

  const formatElements = (data) => {
    const nodes = data.nodes.map((node) => ({
      data: { id: node.id, label: node.label, ...node.properties },
      classes: node.type,
      style: {
        backgroundColor: node.style?.color || '#ff6600',
        shape: node.style?.shape || 'ellipse',
        color: '#fff',
      },
    }));

    const edges = data.edges.map((edge, index) => ({
      data: {
        id: `edge-${index}`,
        source: edge.source,
        target: edge.target,
        label: edge.label,
      },
      style: {
        width: 2,
        lineColor: edge.style?.color || '#ff6600',
        targetArrowColor: edge.style?.color || '#ff6600',
        targetArrowShape: edge.direction === 'one-way' ? 'triangle' : 'none',
        lineStyle: edge.style?.dashed ? 'dashed' : 'solid',
      },
    }));

    return [...nodes, ...edges];
  };

  useEffect(() => {
    if (!data || !cyRef.current) return;
    cyRef.current.innerHTML = '';

    cytoscape({
      container: cyRef.current,
      elements: formatElements(data),
      layout: { name: 'cose' },
      style: [
        {
          selector: 'node',
          style: {
            label: 'data(label)',
            textValign: 'center',
            textHalign: 'center',
            color: '#fff',
            fontSize: 14,
            textWrap: 'wrap',
            width: 50,
            height: 50,
          },
        },
        {
          selector: 'edge',
          style: {
            label: 'data(label)',
            fontSize: 12,
            curveStyle: 'bezier',
            targetArrowShape: 'triangle',
          },
        },
      ],
    });
  }, [data]);

  return (
    <div className="w-full ">
      <div className="bg-white shadow-lg rounded-lg p-8 border border-gray-300">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">
          {data.meta?.title || 'Graph'}
        </h2>
        <p className="text-gray-600 mb-6">{data.meta?.description}</p>

        <div className="overflow-hidden rounded-lg">
          <div
            ref={cyRef}
            className="w-full h-[500px] bg-gray-900 rounded-md border border-orange-500"
          />
        </div>
      </div>
    </div>
  );
};

export default GraphView;
