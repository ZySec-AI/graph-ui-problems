import React, { useEffect, useRef, useState } from 'react';
import cytoscape from 'cytoscape';
import { Users, Move, Tally5, ZoomIn, ZoomOut } from "lucide-react";

const GraphView = ({ data }) => {
  const cyRef = useRef(null);
  const cyInstance = useRef(null);
  const [tooltip, setTooltip] = useState({ visible: false, content: {}, x: 0, y: 0 });
  const [isHandCursor, setIsHandCursor] = useState(false);  
  const [selectedDetails, setSelectedDetails] = useState({});
  const [zoomLevel, setZoomLevel] = useState(1);
  const [nodeFixed, setNodeFixed] = useState(false);

  const formatElements = (data) => {
    const groupMap = {};
    let xSpacing = 150;
    let ySpacing = 100;
  
    const nodes = data.nodes?.map((node, index) => {
      const group = node.group || 'default';
      if (!groupMap[group]) {
        groupMap[group] = [];
      }
      const groupIndex = groupMap[group].length;
      groupMap[group].push(node);
  
      const tooltipData = {
        id: node.id,
        label: node.label,
        type: node.type,
        group: group,
        ...node.properties,
      };
  
      return {
        data: {
          id: node.id,
          label: node.label,
          ...node.properties,
          tooltip: tooltipData,
        },
        position: {
          x: Object.keys(groupMap).indexOf(group) * xSpacing,
          y: groupIndex * ySpacing,
        },
        classes: node.type || '',
        style: {
          backgroundColor: node.style?.color || '#0074D9',
          shape: node.style?.shape || 'ellipse',
        },
      };
    }) || [];
  
    const edges = data.edges?.map((edge, index) => {
      const isDirected = edge.direction === '->' || edge.direction === 'one-way';
  
      const tooltipData = {
        source: edge.source,
        target: edge.target,
        label: edge.label,
        direction: edge.direction,
        ...edge.style,
      };
  
      return {
        data: {
          id: `edge-${index}`,
          source: edge.source,
          target: edge.target,
          label: edge.label,
          tooltip: tooltipData,
        },
        classes: isDirected ? 'directed' : 'undirected',
        style: {
          width: 1.5,
          lineColor: edge.style?.color || '#FF851B',
          targetArrowColor: edge.style?.color || '#FF851B',
          targetArrowShape: isDirected ? 'triangle' : 'none',
          lineStyle: edge.style?.lineType === 'dashed'
            ? 'dashed'
            : edge.style?.lineType === 'dotted'
            ? 'dotted'
            : 'solid',
        },
      };
    }) || [];
  
    return [...nodes, ...edges];
  };
  

  useEffect(() => {
    if (!data || !cyRef.current) return;
    cyRef.current.innerHTML = '';

    const cy = cytoscape({
      container: cyRef.current,
      elements: formatElements(data),
      layout: {
        name: 'preset',
        fit: true,
        padding: 30,
      },
      
      style: [
        {
          selector: 'node',
          style: {
            label: 'data(label)',
            textValign: 'center',
            textHalign: 'center',
            color: '#fff',
            fontSize: 9,
            textWrap: 'wrap',
            textMaxWidth: 50,
            width: 40,
            height: 40,
            borderWidth: 0.5,
            borderColor: 'black',
            shape: 'data(shape)',
          },
        },
        {
          selector: 'edge',
          style: {
            label: ele => `  ${ele.data('label')}  `,
            fontSize: 9,
            color: '#fff',
            curveStyle: 'bezier',
            lineColor: '#888',
            targetArrowColor: '#888',
            targetArrowShape: 'triangle',
            textBackgroundColor: '#000',
            textBackgroundOpacity: 1,
            textBackgroundShape: 'roundrectangle',
            textMarginX: 6,
            textMarginY: 4,
            textWrap: 'wrap',
            textMaxWidth: 80,
          },
        },
      ],
    });
    cyInstance.current = cy;
    cy.on('mouseover', 'node, edge', handleMouseOver);
    cy.on('mouseout', 'node, edge', handleMouseOut);
    cy.on('click', 'node, edge', handleClick);

    return () => {
      cy.destroy();
    };
  }, [data]);

  const handleMouseOver = (e) => {
    const pos = e.renderedPosition || e.target.renderedPosition();
    const rect = cyRef.current.getBoundingClientRect();
    const tooltipData = e.target.data('tooltip');

    setTooltip({
      visible: true,
      content: tooltipData,
      x: rect.left + pos.x + 10,
      y: rect.top + pos.y - 10,
    });

    setIsHandCursor(true);
  };

  const handleMouseOut = () => {
    setTooltip({ visible: false, content: {}, x: 0, y: 0 });
    setIsHandCursor(false);
  };

  const handleClick = (e) => {
    const tooltipData = e.target.data('tooltip');
    if (tooltipData) {
      const type = e.target.isNode() ? 'node' : 'edge';
      const color = e.target.isNode() ? e.target.style('background-color') : e.target.style('line-color');

      setSelectedDetails({
        ...tooltipData,
        label: e.target.data('label'),
        type,
        color,
      });
    }
  };

  const zoomIn = () => {
    if (cyInstance.current) {
      const newZoom = zoomLevel + 0.1;
      cyInstance.current.zoom(newZoom);
      cyInstance.current.center();
      setZoomLevel(newZoom);
    }
  };
  
  const zoomOut = () => {
    if (cyInstance.current) {
      const newZoom = zoomLevel - 0.1;
      cyInstance.current.zoom(newZoom);
      cyInstance.current.center();
      setZoomLevel(newZoom);
    }
  };
  
  return (
    <div className="w-full relative">
      <div className="flex flex-wrap md:flex-nowrap items-start justify-between space-x-2 m-2 gap-y-2">
        {/* Title Card */}
        <div className="bg-gray-900 p-4 rounded-lg shadow-md w-full md:w-1/3 h-40 flex flex-col space-y-1">
          <div className="text-lg font-semibold text-white">
            {data.meta?.title || 'Graph Visualizer'}
          </div>
          <div className="text-md font-medium text-gray-300 overflow-y-auto">
            {data.meta?.description || 'Visualize your graph data here.'}
          </div>
        </div>

        {/* Details */}
        <div className="bg-gray-900 p-4 rounded-lg shadow-md w-full md:w-1/3 h-40 flex flex-col overflow-y-auto text-sm text-white">
          {Object.keys(selectedDetails).length > 0 ? (
            <div className='flex items-center gap-2 mb-2 justify-between'>
              <div className='flex items-center gap-2'>
                {selectedDetails.type === 'node' && selectedDetails.color && (
                  <div
                    className='rounded-full w-3 h-3 border'
                    style={{ backgroundColor: selectedDetails.color }}
                  />
                )}
                <p className="text-lg font-semibold text-white  ">{selectedDetails.label}</p>
              </div>
              {selectedDetails.type=='node' ?
                (
                  <span className={`px-2 py-0.5 text-xs rounded-full font-semibold`} style={{ backgroundColor: selectedDetails.color }}>
                    {selectedDetails.group?.toUpperCase()}
                  </span>
                ) : (
                  <span className={`px-2 py-0.5 text-xs rounded-full font-semibold`} style={{ backgroundColor: selectedDetails.color }}>
                    {selectedDetails.type?.toUpperCase()}
                  </span>
                )}
            </div>
          ) : (
            <p className="text-lg font-semibold mb-2 text-white ">Details</p>
          )}
          <div className="overflow-y-auto pr-1 custom-scrollbar max-h-40">
            {Object.keys(selectedDetails).length > 0 ? (
              <table className="table-auto w-full text-sm text-left">
                <tbody>
                  {Object.entries(selectedDetails).map(([key, value]) =>
                    key !== 'label' && key !== 'type' && key !== 'color' && key !='group' && key != 'id' ? (
                      <tr key={key} className="border-b border-gray-700 last:border-0">
                        <td className="py-1 pr-2 text-gray-300 font-medium capitalize">{key}</td>
                        <td className="py-1 text-gray-100 max-w-[60%] truncate" title={String(value)}>
                          {String(value)}
                        </td>
                      </tr>
                    ) : null
                  )}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-400 italic">Click on a node or edge to see details here.</p>
            )}
          </div>

      </div>


        {/* Stats Table */}
        <div className="bg-gray-900 p-2 rounded-md w-full md:w-1/3 shadow h-40">
          <table className="table-auto w-full text-gray-300 text-md">
            <thead>
              <tr className="border-b border-gray-700 text-left">
                <th className="p-1">Type</th>
                <th className="text-center">Count</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-gray-800 transition">
                <td className="p-1 flex items-center gap-2">
                  <Users size={16} /> Nodes
                </td>
                <td className="py-1 text-center">{data.nodes?.length || 0}</td>
              </tr>
              <tr className="hover:bg-gray-800 transition">
                <td className="p-1 flex items-center gap-2">
                  <Move size={16} /> Edges
                </td>
                <td className="p-1 text-center">{data.edges?.length || 0}</td>
              </tr>
              <tr className="hover:bg-gray-800 transition font-semibold">
                <td className="p-1 flex items-center gap-2">
                  <Tally5 size={16} /> Total
                </td>
                <td className="p-1 text-center">
                  {(data.nodes?.length || 0) + (data.edges?.length || 0)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Graph Canvas */}
      <div className="shadow-lg rounded-lg border-slate-400 m-2">
        <div className="overflow-auto rounded-lg bg-gray-900">
          <div
            ref={cyRef}
            className="w-full h-[500px] rounded-md border relative cy-bg-dots"
            style={{
              cursor: isHandCursor ? 'pointer' : 'default',
            }}
          />
        </div>
      </div>

      {/* Tooltip */}
      {tooltip.visible && (
        <div
          className="fixed bg-black text-white text-xs p-2 rounded shadow-lg z-50 max-w-xs"
          style={{
            top: tooltip.y,
            left: tooltip.x,
            pointerEvents: 'none',
          }}
        >
          <pre className="whitespace-pre-wrap">
            {Object.entries(tooltip.content).map(([key, value]) => (
              <div key={key}>
                <strong>{key}:</strong> {JSON.stringify(value, null, 2)}
              </div>
            ))}
          </pre>
        </div>
      )}

      {/* Zoom Controls */}
      <div className="absolute bottom-4 right-4 flex flex-col z-10">
        <button
          onClick={zoomIn}
          className="text-white px-3 py-1 shadow hover:text-gray-400 cursor-pointer"
        >
          <ZoomIn size={18} />
        </button>
        <button
          onClick={zoomOut}
          className="text-white px-3 py-1 shadow hover:text-gray-400 cursor-pointer"
        >
          <ZoomOut size={18} />
        </button>

      </div>

    </div>
  );
};

export default GraphView;
