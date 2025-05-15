import { useEffect, useRef, useState } from 'react';
import cytoscape from 'cytoscape';
import Controls from './ui/Graph/Controls';
import TitleCard from './ui/Graph/TitleCard';
import Properties from './ui/Graph/Properties';
import SummaryTable from './ui/Graph/SummaryTable';

const GraphView = ({ data, search }) => {
  const cyRef = useRef(null);
  const cyInstance = useRef(null);
  const animationRef = useRef(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isHandCursor, setIsHandCursor] = useState(false);  
  const [selectedDetails, setSelectedDetails] = useState({});
  const [edgeAnimationEnabled, setEdgeAnimationEnabled] = useState(false);
  const [tooltip, setTooltip] = useState({ visible: false, content: {}, x: 0, y: 0 });

  const isSearchMatch = node => {
    return (
      search &&
      (node.id.toLowerCase().includes(search.toLowerCase()) ||
        node.label?.toLowerCase().includes(search.toLowerCase()))
    );
  };

  const formatElements = data => {
    const groupMap = {};
    let xSpacing = 150;
    let ySpacing = 100;
  
    const nodes = data.nodes?.map((node) => {
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
      const direction = edge.direction;
      const isBidirectional = direction === '<->' || direction === 'two-way';
      const isDirected = direction === '->' || direction === 'one-way' || isBidirectional;
  
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
        classes: isBidirectional ? 'bidirectional' : isDirected ? 'directed': 'undirected',
        style: {
          width: 1.5,
          lineColor: edge.style?.color || '#888',
          sourceArrowColor: edge.style?.color || '#888',
          targetArrowColor: edge.style?.color || '#888',
          targetArrowShape: isDirected ? 'triangle' : 'none',
          sourceArrowShape: isBidirectional ? 'triangle' : 'none',
          lineStyle: edge.style?.lineType === 'dashed'
                    ? 'dashed'
                    : edge.style?.lineType === 'dotted'
                    ? 'dotted'
                    : edge.style?.dashed
                    ? 'dashed'
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
        {
          selector: '.search-highlight',
          style: {
            borderColor: 'cyan',
            borderOpacity: 0.8,
            borderStyle: 'double',
            borderWidth: 4,
          },
        },
        {
          selector: '.animated-edge',
          style: {
            lineStyle: 'dashed',
            lineDashPattern: [6, 3],
            lineCap: 'butt',
            lineColor: '#888',
            targetArrowColor: '#888',
            targetArrowShape: 'triangle',
          },
        },
      ],
    });

    cyInstance.current = cy;
    cy.on('mouseover', 'node, edge', handleMouseOver);
    cy.on('mouseout', 'node, edge', handleMouseOut);
    cy.on('click', 'node, edge', handleClick);

    cy.edges().forEach(edge => {
      const isBidirectional = edge.hasClass('bidirectional');
      const lineStyle = edge.style('line-style');
      if (!isBidirectional && lineStyle !== 'solid') {
        edge.addClass('animated-edge');
      }
    });

    let offset = 0;
    const animate = () => {
      offset = (offset - 0.5) % 1000;
      cy.edges('.animated-edge').forEach(edge => {
        edge.style('line-dash-offset', offset);
      });
      animationRef.current = requestAnimationFrame(animate);
    };
    if (edgeAnimationEnabled) {
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      cy.destroy();
    };

  }, [data, edgeAnimationEnabled]);

  useEffect(() => {
    if (!cyInstance.current) return;
    const cy = cyInstance.current;
    cy.nodes().removeClass('search-highlight');
    if (!search || search.trim() === "") return;
    const matchedNodes = cy.nodes().filter((node) =>
      isSearchMatch(node.data())
    );
    if (matchedNodes.length > 0) {
      matchedNodes.addClass('search-highlight');
      cy.center(matchedNodes[0]);
      cy.zoom(1.2);
      setZoomLevel(1.2);
    }
  }, [search]);

  useEffect(() => {
    setSelectedDetails({});
  }, [data]);

  const handleMouseOver = e => {
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

  const handleClick = e => {
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

  return (
    <div className="w-full relative">
      <div className="flex flex-wrap md:flex-nowrap items-start justify-between space-x-2 m-2 gap-y-2">
        <TitleCard data={data} />
        <Properties selectedDetails={selectedDetails} />
        <SummaryTable data={data} />
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
          className="fixed bg-black/75 text-white text-xs p-2 rounded shadow-lg z-50 max-w-xs max-h-30 overflow-auto custom-scrollbar"
          style={{
            top: tooltip.y,
            left: tooltip.x,
            pointerEvents: 'auto',
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
      
      <Controls 
        cyInstance={cyInstance} 
        zoomLevel={zoomLevel} 
        setZoomLevel={setZoomLevel} 
        edgeAnimationEnabled={edgeAnimationEnabled} 
        setEdgeAnimationEnabled={setEdgeAnimationEnabled}
      />
    </div>
  );
};

export default GraphView;
