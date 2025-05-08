import React, { useState, useEffect, useRef } from 'react';
import Controls from './Controls';
import GraphRenderer from './GraphRenderer';
import DetailsPanel from './DetailsPanel';
import StatisticsPanel from './StatisticsPanel';

const GraphViewer = ({ data }) => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [layout, setLayout] = useState("force");
  const svgRef = useRef(null);

  const getSvgPoint = (clientX, clientY) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const point = svgRef.current.createSVGPoint();
    point.x = clientX;
    point.y = clientY;
    return point.matrixTransform(svgRef.current.getScreenCTM().inverse());
  };

  useEffect(() => {
    if (!data) return;

    let initialNodes = data.nodes.map((node, index) => {
      let x, y;
      if (layout === "force") {
        x = 150 + Math.random() * 700;
        y = 150 + Math.random() * 300;
      } else if (layout === "circle") {
        const angle = (2 * Math.PI * index) / data.nodes.length;
        const radius = Math.min(400, 200);
        x = 500 + radius * Math.cos(angle);
        y = 300 + radius * Math.sin(angle);
      } else if (layout === "grid") {
        const cols = Math.ceil(Math.sqrt(data.nodes.length));
        const col = index % cols;
        const row = Math.floor(index / cols);
        x = 200 + col * 200;
        y = 150 + row * 150;
      }
      return { ...node, x, y, fx: null, fy: null, vx: 0, vy: 0 };
    });

    setNodes(initialNodes);
    setEdges(data.edges);

    if (layout === "force") {
      const simulation = setInterval(() => {
        setNodes(currentNodes => {
          if (layout !== "force") {
            clearInterval(simulation);
            return currentNodes;
          }
          const repulsionForce = 300;
          const attractionForce = 0.05;
          const damping = 0.8;
          const updatedNodes = currentNodes.map(node => ({ ...node }));

          for (let i = 0; i < updatedNodes.length; i++) {
            const nodeA = updatedNodes[i];
            if (nodeA.fx !== null && nodeA.fy !== null) {
              nodeA.x = nodeA.fx;
              nodeA.y = nodeA.fy;
              nodeA.vx = 0;
              nodeA.vy = 0;
              continue;
            }
            for (let j = 0; j < updatedNodes.length; j++) {
              if (i === j) continue;
              const nodeB = updatedNodes[j];
              const dx = nodeA.x - nodeB.x;
              const dy = nodeA.y - nodeB.y;
              const distance = Math.sqrt(dx * dx + dy * dy) + 0.1;
              const force = repulsionForce / (distance * distance);
              nodeA.vx += (dx / distance) * force;
              nodeA.vy += (dy / distance) * force;
            }
            const boundaryForce = 0.05;
            if (nodeA.x < 100) nodeA.vx += boundaryForce;
            if (nodeA.x > 900) nodeA.vx -= boundaryForce;
            if (nodeA.y < 100) nodeA.vy += boundaryForce;
            if (nodeA.y > 500) nodeA.vy -= boundaryForce;
          }

          data.edges.forEach(edge => {
            const source = updatedNodes.find(n => n.id === edge.source);
            const target = updatedNodes.find(n => n.id === edge.target);
            if (source && target) {
              const dx = source.x - target.x;
              const dy = source.y - target.y;
              const distance = Math.sqrt(dx * dx + dy * dy) + 0.1;
              const force = distance * attractionForce;
              if (source.fx === null && source.fy === null) {
                source.vx -= (dx / distance) * force;
                source.vy -= (dy / distance) * force;
              }
              if (target.fx === null && target.fy === null) {
                target.vx += (dx / distance) * force;
                target.vy += (dy / distance) * force;
              }
            }
          });

          updatedNodes.forEach(node => {
            if (node.fx === null && node.fy === null) {
              node.vx *= damping;
              node.vy *= damping;
              node.x += node.vx;
              node.y += node.vy;
            }
          });

          return updatedNodes;
        });
      }, 30);
      return () => clearInterval(simulation);
    }
  }, [data, layout]);

  const handleNodeMouseDown = (node, e) => {
    e.stopPropagation();
    setSelectedElement({ ...node, type: 'node' });
    setIsDragging(true);
    const svgPoint = getSvgPoint(e.clientX, e.clientY);
    setDragStart({ x: svgPoint.x - node.x, y: svgPoint.y - node.y });
  };

  const handleEdgeClick = (edge, e) => {
    e.stopPropagation();
    const sourceNode = nodes.find(n => n.id === edge.source);
    const targetNode = nodes.find(n => n.id === edge.target);
    setSelectedElement({ 
      ...edge, 
      type: 'edge',
      sourceLabel: sourceNode?.label,
      targetLabel: targetNode?.label
    });
  };

  const handleSvgClick = () => setSelectedElement(null);

  const handleMouseMove = (e) => {
    if (!isDragging || !selectedElement || selectedElement.type !== 'node') return;
    const svgPoint = getSvgPoint(e.clientX, e.clientY);
    setNodes(currentNodes => 
      currentNodes.map(node => 
        node.id === selectedElement.id 
          ? { 
              ...node, 
              x: svgPoint.x - dragStart.x, 
              y: svgPoint.y - dragStart.y,
              fx: svgPoint.x - dragStart.x,
              fy: svgPoint.y - dragStart.y,
              vx: 0,
              vy: 0
            }
          : node
      )
    );
  };

  const handleMouseUp = () => {
    if (isDragging && selectedElement && selectedElement.type === 'node') {
      setNodes(currentNodes => 
        currentNodes.map(node => 
          node.id === selectedElement.id 
            ? { ...node, fx: null, fy: null }
            : node
        )
      );
    }
    setIsDragging(false);
  };

  const handleZoomIn = () => setZoom(z => Math.min(z + 0.2, 3));
  const handleZoomOut = () => setZoom(z => Math.max(z - 0.2, 0.5));
  const handleResetView = () => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  };
  const handleChangeLayout = (newLayout) => setLayout(newLayout);

  return (
    <div className="flex flex-col w-full h-full">
      <div className="bg-gray-800 p-4 shadow-md rounded-lg mb-4">
        <h2 className="text-xl font-bold text-gray-100">{data?.meta?.title || "Knowledge Graph Viewer"}</h2>
        <p className="text-sm text-gray-200">{data?.meta?.description || "Interactive visualization of graph data"}</p>
        <Controls 
          layout={layout} 
          onLayoutChange={handleChangeLayout}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onResetView={handleResetView}
        />
      </div>
      <div className="flex flex-1 gap-4">
        <div className="w-3/4 h-96 border rounded-lg shadow-md bg-gray-900 overflow-hidden">
          <GraphRenderer
            svgRef={svgRef}
            nodes={nodes}
            edges={edges}
            selectedElement={selectedElement}
            onNodeMouseDown={handleNodeMouseDown}
            onEdgeClick={handleEdgeClick}
            onSvgClick={handleSvgClick}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            zoom={zoom}
            offset={offset}
          />
        </div>
        <div className="w-1/4">
          <div className="bg-gray-800 p-4 rounded-lg shadow-md h-full">
            <h3 className="font-bold text-lg mb-2 text-slate-100">Element Details</h3>
            <DetailsPanel selectedElement={selectedElement} />
          </div>
        </div>
      </div>
      <StatisticsPanel data={data} />
    </div>
  );
};

export default GraphViewer;