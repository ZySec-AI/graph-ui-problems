import React, { useState, useEffect, useRef } from 'react';
import { ZoomIn, ZoomOut, Move } from 'lucide-react';

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
  
  useEffect(() => {
    if (!data) return;
    
    // Initialize node positions based on layout
    let initialNodes = data.nodes.map((node, index) => {
      let x, y;
      
      if (layout === "force") {
        // Seed with random positions for force-directed layout
        x = 150 + Math.random() * 700;
        y = 150 + Math.random() * 300;
      } else if (layout === "circle") {
        // Position nodes in a circle
        const angle = (2 * Math.PI * index) / data.nodes.length;
        const radius = Math.min(400, 200);
        x = 500 + radius * Math.cos(angle);
        y = 300 + radius * Math.sin(angle);
      } else if (layout === "grid") {
        // Position nodes in a grid
        const cols = Math.ceil(Math.sqrt(data.nodes.length));
        const col = index % cols;
        const row = Math.floor(index / cols);
        x = 200 + col * 200;
        y = 150 + row * 150;
      }
      
      return {
        ...node,
        x,
        y,
        fx: null,
        fy: null, // fixed positions (null means not fixed)
        vx: 0,
        vy: 0 // velocity for simulation
      };
    });
    
    setNodes(initialNodes);
    setEdges(data.edges);
    
    // Apply force-directed layout simulation
    if (layout === "force") {
      const simulation = setInterval(() => {
        setNodes(currentNodes => {
          // Skip simulation if not using force layout
          if (layout !== "force") {
            clearInterval(simulation);
            return currentNodes;
          }
          
          // Calculate forces between nodes (repulsion)
          const repulsionForce = 300;
          const attractionForce = 0.05;
          const damping = 0.8;
          
          // Copy nodes to avoid direct state mutation
          const updatedNodes = currentNodes.map(node => ({ ...node }));
          
          // Apply repulsion forces between all nodes
          for (let i = 0; i < updatedNodes.length; i++) {
            const nodeA = updatedNodes[i];
            
            // Skip fixed nodes
            if (nodeA.fx !== null && nodeA.fy !== null) {
              nodeA.x = nodeA.fx;
              nodeA.y = nodeA.fy;
              nodeA.vx = 0;
              nodeA.vy = 0;
              continue;
            }
            
            // Apply forces from other nodes
            for (let j = 0; j < updatedNodes.length; j++) {
              if (i === j) continue;
              
              const nodeB = updatedNodes[j];
              const dx = nodeA.x - nodeB.x;
              const dy = nodeA.y - nodeB.y;
              const distance = Math.sqrt(dx * dx + dy * dy) + 0.1; // Avoid division by zero
              
              // Repulsion force (inverse square law)
              const force = repulsionForce / (distance * distance);
              nodeA.vx += (dx / distance) * force;
              nodeA.vy += (dy / distance) * force;
            }
            
            // Apply boundary forces to keep nodes in view
            const boundaryForce = 0.05;
            if (nodeA.x < 100) nodeA.vx += boundaryForce;
            if (nodeA.x > 900) nodeA.vx -= boundaryForce;
            if (nodeA.y < 100) nodeA.vy += boundaryForce;
            if (nodeA.y > 500) nodeA.vy -= boundaryForce;
          }
          
          // Apply attraction forces for edges
          data.edges.forEach(edge => {
            const source = updatedNodes.find(n => n.id === edge.source);
            const target = updatedNodes.find(n => n.id === edge.target);
            
            if (source && target) {
              const dx = source.x - target.x;
              const dy = source.y - target.y;
              const distance = Math.sqrt(dx * dx + dy * dy) + 0.1;
              
              // Apply force proportional to distance
              const force = distance * attractionForce;
              
              // Only move unfixed nodes
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
          
          // Update positions with velocity and damping
          updatedNodes.forEach(node => {
            if (node.fx === null && node.fy === null) {
              // Apply velocity with damping
              node.vx *= damping;
              node.vy *= damping;
              
              // Update position
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
    
    // Start dragging the node
    setIsDragging(true);
    const svgPoint = svgRef.current.createSVGPoint();
    svgPoint.x = e.clientX;
    svgPoint.y = e.clientY;
    const point = svgPoint.matrixTransform(svgRef.current.getScreenCTM().inverse());
    setDragStart({ x: point.x - node.x, y: point.y - node.y });
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
  
  const handleMouseMove = (e) => {
    if (!isDragging || !selectedElement || selectedElement.type !== 'node') return;
    
    const svgPoint = svgRef.current.createSVGPoint();
    svgPoint.x = e.clientX;
    svgPoint.y = e.clientY;
    const point = svgPoint.matrixTransform(svgRef.current.getScreenCTM().inverse());
    
    setNodes(currentNodes => 
      currentNodes.map(node => 
        node.id === selectedElement.id 
          ? { 
              ...node, 
              x: point.x - dragStart.x, 
              y: point.y - dragStart.y,
              fx: point.x - dragStart.x, // Fix the position while dragging
              fy: point.y - dragStart.y,
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
            ? { 
                ...node,
                fx: null, // Release the fixed position when dragging ends
                fy: null
              }
            : node
        )
      );
    }
    setIsDragging(false);
  };
  
  const handleSvgClick = () => {
    setSelectedElement(null);
  };
  
  const handleZoomIn = () => {
    setZoom(z => Math.min(z + 0.2, 3));
  };
  
  const handleZoomOut = () => {
    setZoom(z => Math.max(z - 0.2, 0.5));
  };
  
  const handleResetView = () => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  };
  
  const handleChangeLayout = (newLayout) => {
    setLayout(newLayout);
  };
  
  // Calculate node radius and other visual parameters based on zoom level
  const nodeRadius = 20;
  const fontSize = 12;
  
  // Helper to get node shape path
  const getNodeShape = (node) => {
    const shape = node.style?.shape || 'circle';
    const r = nodeRadius;
    
    if (shape === 'rectangle') {
      return `M${node.x - r} ${node.y - r} h${r*2} v${r*2} h${-r*2} z`;
    }
    
    return null; // Default to circle (rendered using <circle> element)
  };
  
  // Calculate edge path with arrow for one-way edges
  const getEdgePath = (edge) => {
    const source = nodes.find(n => n.id === edge.source);
    const target = nodes.find(n => n.id === edge.target);
    
    if (!source || !target) return '';
    
    // Calculate angle to position the arrow correctly
    const dx = target.x - source.x;
    const dy = target.y - source.y;
    const angle = Math.atan2(dy, dx);
    
    // Adjust start and end points to be at the edge of the nodes
    const startX = source.x + nodeRadius * Math.cos(angle);
    const startY = source.y + nodeRadius * Math.sin(angle);
    
    // Leave space for the arrow
    const arrowLength = edge.direction === 'one-way' ? nodeRadius : 0;
    const endX = target.x - (nodeRadius + arrowLength) * Math.cos(angle);
    const endY = target.y - (nodeRadius + arrowLength) * Math.sin(angle);
    
    return `M${startX},${startY} L${endX},${endY}`;
  };
  
  // Generate arrow marker for directed edges
  const getEdgeArrow = (edge) => {
    if (edge.direction !== 'one-way') return null;
    
    const source = nodes.find(n => n.id === edge.source);
    const target = nodes.find(n => n.id === edge.target);
    
    if (!source || !target) return null;
    
    const dx = target.x - source.x;
    const dy = target.y - source.y;
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    
    // Position at the end of the line, before it reaches the target node
    const arrowSize = 6;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const scaleFactor = (distance - nodeRadius) / distance;
    
    const endX = source.x + dx * scaleFactor;
    const endY = source.y + dy * scaleFactor;
    
    return (
      <polygon 
        points={`0,-${arrowSize} ${arrowSize*1.5},0 0,${arrowSize}`}
        transform={`translate(${endX},${endY}) rotate(${angle})`}
        fill={edge.style?.color || "#555"}
      />
    );
  };
  
  // Calculate label position for edges
  const getEdgeLabelPosition = (edge) => {
    const source = nodes.find(n => n.id === edge.source);
    const target = nodes.find(n => n.id === edge.target);
    
    if (!source || !target) return { x: 0, y: 0 };
    
    return {
      x: (source.x + target.x) / 2,
      y: (source.y + target.y) / 2 - 10
    };
  };
  
  const renderPropertyList = (properties) => {
    if (!properties || Object.keys(properties).length === 0) return null;
    
    return (
      <div className="mt-2">
        <h4 className="text-sm font-semibold">Properties:</h4>
        <ul className="text-xs mt-1">
          {Object.entries(properties).map(([key, value]) => (
            <li key={key} className="flex justify-between">
              <span className="font-medium">{key}:</span> 
              <span className="ml-2">{value}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  // Adjust viewBox based on zoom and offset
  const centerX = 500;
  const centerY = 300;
  const width = 1000 / zoom;
  const height = 600 / zoom;
  const adjustedViewBox = `${centerX - width/2 + offset.x} ${centerY - height/2 + offset.y} ${width} ${height}`;
  
  return (
    <div className="flex flex-col w-full h-full">
      <div className="bg-gray-800 p-4 shadow-md rounded-lg mb-4">
        <h2 className="text-xl font-bold text-gray-800">{data?.meta?.title || "Knowledge Graph Viewer"}</h2>
        <p className="text-sm text-gray-600">{data?.meta?.description || "Interactive visualization of graph data"}</p>
        
        <div className="flex mt-3 space-x-2">
          <div>
            <label className="text-sm font-medium text-gray-700 mr-2">Layout:</label>
            <select 
              className="border rounded py-1 px-2 text-sm bg-gray-50"
              value={layout}
              onChange={(e) => handleChangeLayout(e.target.value)}
            >
              <option value="force">Force-directed</option>
              <option value="circle">Circular</option>
              <option value="grid">Grid</option>
            </select>
          </div>
          
          <div className="flex space-x-1">
            <button 
              className="p-1 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
              onClick={handleZoomIn}
              title="Zoom In"
            >
              <ZoomIn size={16} />
            </button>
            <button 
              className="p-1 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
              onClick={handleZoomOut}
              title="Zoom Out"
            >
              <ZoomOut size={16} />
            </button>
            <button 
              className="p-1 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
              onClick={handleResetView}
              title="Reset View"
            >
              <Move size={16} />
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex flex-1 gap-4">
        <div className="w-3/4 h-96 border rounded-lg shadow-md bg-gray-50 overflow-hidden">
          <svg 
            ref={svgRef}
            width="100%" 
            height="100%" 
            viewBox={adjustedViewBox}
            onClick={handleSvgClick}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* Edges */}
            {edges.map((edge) => {
              const isSelected = selectedElement?.type === 'edge' && selectedElement?.source === edge.source && selectedElement?.target === edge.target;
              const labelPos = getEdgeLabelPosition(edge);
              
              return (
                <g key={`${edge.source}-${edge.target}`}>
                  <path 
                    d={getEdgePath(edge)}
                    stroke={isSelected ? "#ff7700" : (edge.style?.color || "#555")}
                    strokeWidth={isSelected ? 3 : 2}
                    strokeDasharray={edge.style?.dashed ? "5,5" : "none"}
                    fill="none"
                    onClick={(e) => handleEdgeClick(edge, e)}
                    style={{ cursor: 'pointer' }}
                  />
                  
                  {/* Edge Label */}
                  <g transform={`translate(${labelPos.x}, ${labelPos.y})`}>
                    <rect 
                      x="-20" 
                      y="-10" 
                      width={edge.label ? edge.label.length * 6 + 10 : 0} 
                      height="16" 
                      fill="white" 
                      fillOpacity="0.8" 
                      rx="3"
                    />
                    <text 
                      textAnchor="middle" 
                      fontSize={fontSize} 
                      fill="#333"
                    >
                      {edge.label}
                    </text>
                  </g>
                  
                  {/* Arrow for directed edges */}
                  {getEdgeArrow(edge)}
                </g>
              );
            })}
            
            {/* Nodes */}
            {nodes.map((node) => {
              const isSelected = selectedElement?.type === 'node' && selectedElement?.id === node.id;
              const nodeShape = getNodeShape(node);
              const color = node.style?.color || "#666";
              
              return (
                <g 
                  key={node.id}
                  onMouseDown={(e) => handleNodeMouseDown(node, e)}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Node Shape */}
                  {node.style?.shape === 'rectangle' ? (
                    <rect 
                      x={node.x - nodeRadius} 
                      y={node.y - nodeRadius} 
                      width={nodeRadius * 2} 
                      height={nodeRadius * 2}
                      fill={color}
                      stroke={isSelected ? "#ff5500" : "#333"}
                      strokeWidth={isSelected ? 3 : 2}
                      rx="3"
                    />
                  ) : (
                    <circle 
                      cx={node.x} 
                      cy={node.y} 
                      r={nodeRadius}
                      fill={color}
                      stroke={isSelected ? "#ff5500" : "#333"}
                      strokeWidth={isSelected ? 3 : 2}
                    />
                  )}
                  
                  {/* Node Label */}
                  <text 
                    x={node.x} 
                    y={node.y} 
                    textAnchor="middle" 
                    dominantBaseline="middle" 
                    fill="white"
                    fontSize={fontSize}
                    fontWeight="bold"
                    pointerEvents="none"
                  >
                    {node.label}
                  </text>
                  
                  {/* Node Type (below the node) */}
                  <text 
                    x={node.x} 
                    y={node.y + nodeRadius + 15} 
                    textAnchor="middle" 
                    fill="#333"
                    fontSize={fontSize - 2}
                    pointerEvents="none"
                  >
                    {node.type}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
        
        <div className="w-1/4">
          <div className="bg-gray-800 p-4 rounded-lg shadow-md h-full">
            <h3 className="font-bold text-lg mb-2">Element Details</h3>
            
            {selectedElement ? (
              <div className="text-sm">
                <div className="font-semibold">
                  {selectedElement.type === 'node' ? 'Node' : 'Edge'} Details:
                </div>
                <div className="mt-1">
                  {selectedElement.type === 'node' ? (
                    <>
                      <p><span className="font-medium">ID:</span> {selectedElement.id}</p>
                      <p><span className="font-medium">Label:</span> {selectedElement.label}</p>
                      <p><span className="font-medium">Type:</span> {selectedElement.type}</p>
                      <p><span className="font-medium">Group:</span> {selectedElement.group}</p>
                      {renderPropertyList(selectedElement.properties)}
                    </>
                  ) : (
                    <>
                      <p><span className="font-medium">Relationship:</span> {selectedElement.label}</p>
                      <p><span className="font-medium">From:</span> {selectedElement.sourceLabel} ({selectedElement.source})</p>
                      <p><span className="font-medium">To:</span> {selectedElement.targetLabel} ({selectedElement.target})</p>
                      <p><span className="font-medium">Direction:</span> {selectedElement.direction}</p>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-gray-500 italic">Click on a node or edge to view details</p>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-4 p-4 bg-gray-800 rounded-lg shadow-md">
        <h3 className="font-bold text-lg mb-2">Graph Statistics</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-3 rounded-md">
            <div className="text-sm font-medium text-gray-700">Nodes</div>
            <div className="text-xl font-bold">{data?.nodes?.length || 0}</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-md">
            <div className="text-sm font-medium text-gray-700">Edges</div>
            <div className="text-xl font-bold">{data?.edges?.length || 0}</div>
          </div>
        </div>
        
        {data?.nodes && data.nodes.length > 0 && (
          <div className="mt-4">
            <h4 className="font-medium text-sm mb-1">Node Types</h4>
            <div className="flex flex-wrap gap-2">
              {[...new Set(data.nodes.map(node => node.type))].map(type => (
                <span key={type} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                  {type}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {data?.nodes && data.nodes.length > 0 && (
          <div className="mt-4">
            <h4 className="font-medium text-sm mb-1">Groups</h4>
            <div className="flex flex-wrap gap-2">
              {[...new Set(data.nodes.map(node => node.group))].map(group => (
                <span key={group} className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                  {group}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function App() {
  // Parse the data from the original JSON
  const graphData = {
    "nodes": [
      {
        "id": "user_1",
        "label": "Alice",
        "type": "Person",
        "properties": {
          "email": "alice@example.com",
          "role": "Analyst"
        },
        "style": {
          "color": "#4CAF50",
          "shape": "circle"
        },
        "group": "Team A"
      },
      {
        "id": "doc_1",
        "label": "Report Q1",
        "type": "Document",
        "properties": {
          "created": "2024-03-01",
          "status": "approved"
        },
        "style": {
          "color": "#2196F3",
          "shape": "rectangle"
        },
        "group": "Documents"
      }
    ],
    "edges": [
      {
        "source": "user_1",
        "target": "doc_1",
        "label": "authored",
        "direction": "one-way",
        "style": {
          "dashed": false,
          "color": "#555"
        }
      }
    ],
    "meta": {
      "title": "Knowledge Graph - Access Control",
      "description": "Sample graph representing users, documents, and policies."
    }
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <GraphViewer data={graphData} />
    </div>
  );
}