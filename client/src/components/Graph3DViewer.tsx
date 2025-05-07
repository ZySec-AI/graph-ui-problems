import { useRef, useEffect, useState } from 'react';
import ForceGraph3D from '3d-force-graph';
import { GraphData, GraphNode } from '@/types/graph';
import { getColorForNodeType, getShapeForNodeType } from '@/lib/graphUtils';

interface Graph3DViewerProps {
  graphData: GraphData;
  filters: Record<string, boolean>;
  searchTerm: string;
  onNodeSelect: (node: GraphNode | null) => void;
  cyRef?: React.MutableRefObject<any | null>;
}

export default function Graph3DViewer({
  graphData,
  filters,
  searchTerm,
  onNodeSelect,
  cyRef
}: Graph3DViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<any>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Initialize 3D force graph
  useEffect(() => {
    if (!containerRef.current) return;

    // Clear container first
    containerRef.current.innerHTML = '';

    // Create new 3D force graph
    const ForceGraph3DInstance = ForceGraph3D as any;
    const graph = ForceGraph3DInstance()(containerRef.current)
      .backgroundColor('#111827')
      .showNavInfo(false)
      .nodeLabel((node: any) => `${node.label} (${node.type})`)
      .nodeAutoColorBy('type')
      .nodeRelSize(8) // Larger nodes
      .linkDirectionalParticles(4) // More particles
      .linkDirectionalParticleWidth(2.0) // Wider particles
      .linkDirectionalParticleSpeed(0.01) // Faster particles
      .linkWidth(1.5) // Wider links
      .linkOpacity(0.8) // More opaque links
      .onNodeClick((node: any) => {
        const nodeId = node.id;
        setSelectedNodeId(nodeId);
        
        // Find the corresponding node in the original graph data
        const selectedNode = graphData.nodes.find(n => n.id === nodeId) || null;
        onNodeSelect(selectedNode);
        
        // Aim camera at node with a fancy transition
        const distance = 40;
        const distRatio = 1 + distance/Math.hypot(node.x, node.y, node.z);
        
        // First zoom out a bit
        graph.cameraPosition(
          { x: node.x * distRatio * 1.5, y: node.y * distRatio * 1.5, z: node.z * distRatio * 1.5 }, // farther position
          node, // lookAt
          1000  // transition duration
        );
        
        // Then zoom in closer after a delay
        setTimeout(() => {
          graph.cameraPosition(
            { x: node.x * distRatio * 0.8, y: node.y * distRatio * 0.8, z: node.z * distRatio * 0.8 }, // closer position
            node, // lookAt
            2000  // transition duration
          );
        }, 1000);
      })
      .linkDirectionalArrowLength(4) // Longer arrows
      .linkDirectionalArrowRelPos(1)
      .linkCurvature(0.3) // More curved links
      .linkLabel((link: any) => link.label)
      .cooldownTicks(100)
      .onEngineStop(() => graph.zoomToFit(400, 20));

    graphRef.current = graph;
    
    // Share the graph instance with the parent component if a ref was provided
    if (cyRef) {
      cyRef.current = graph;
    }
    
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [onNodeSelect]);

  // Update graph data when it changes
  useEffect(() => {
    if (!graphRef.current || !graphData) return;
    
    const graph = graphRef.current;
    
    // Create filtered node list based on filters and search
    let filteredNodes = graphData.nodes.filter(node => 
      filters[node.type] === true
    );
    
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filteredNodes = filteredNodes.filter(node => 
        node.label.toLowerCase().includes(lowerSearchTerm) || 
        node.id.toLowerCase().includes(lowerSearchTerm) ||
        node.type.toLowerCase().includes(lowerSearchTerm)
      );
    }
    
    // Filter edges to only include those connecting visible nodes
    const filteredNodeIds = new Set(filteredNodes.map(node => node.id));
    const filteredEdges = graphData.edges.filter(edge => 
      filteredNodeIds.has(edge.source) && filteredNodeIds.has(edge.target)
    );
    
    // Prepare 3D graph data
    const nodes3D = filteredNodes.map(node => {
      const color = node.style?.color || getColorForNodeType(node.type);
      
      // Convert node type to 3D shape
      let shape: string;
      switch (node.type.toLowerCase()) {
        case 'user':
          shape = 'sphere';
          break;
        case 'document':
          shape = 'cube';
          break;
        case 'policy':
          shape = 'pyramid';
          break;
        case 'infrastructure':
          shape = 'diamond';
          break;
        case 'group':
          shape = 'cylinder';
          break;
        default:
          shape = 'sphere';
      }
      
      return {
        ...node,
        id: node.id,
        type: node.type,
        label: node.label,
        color,
        shape,
        val: 1.5, // Size scale factor - bigger nodes
        group: node.group
      };
    });
    
    const links3D = filteredEdges.map(edge => {
      // Determine arrow direction
      const hasArrow = edge.direction === '->';
      
      return {
        id: `${edge.source}-${edge.target}`,
        source: edge.source,
        target: edge.target,
        label: edge.label,
        color: edge.style?.color || '#aaa',
        curvature: 0.3,
        hasArrow
      };
    });
    
    // Update graph data with simpler approach that doesn't rely directly on THREE.js
    graph
      .nodeColor((node: any) => node.color)
      .nodeVal((node: any) => node.val * 15) // Make nodes bigger
      .linkColor((link: any) => link.color)
      .linkCurvature((link: any) => link.curvature)
      .linkDirectionalArrowLength(6)
      .linkDirectionalArrowRelPos(1)
      .linkDirectionalParticles(6)
      .linkDirectionalParticleWidth(2.5)
      .linkDirectionalParticleSpeed(0.015)
      .graphData({ nodes: nodes3D, links: links3D });

    // Add node hover effect
    graph
      .onNodeHover((node: any) => {
        if (node) {
          // Highlight on hover
          const distance = 80;
          const distRatio = 1 + distance/Math.hypot(node.x, node.y, node.z);
          
          // Gentle camera movement on hover
          graph.cameraPosition(
            { 
              x: node.x * distRatio * 0.2 + graph.cameraPosition().x * 0.8, 
              y: node.y * distRatio * 0.2 + graph.cameraPosition().y * 0.8, 
              z: node.z * distRatio * 0.2 + graph.cameraPosition().z * 0.8
            },
            node,
            2000
          );
        }
      });
      
  }, [graphData, filters, searchTerm, selectedNodeId]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (graphRef.current) {
        graphRef.current.width(window.innerWidth);
        graphRef.current.height(window.innerHeight);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Helper function to create text texture for labels
  const createTextTexture = (text: string, type: string) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    // Set canvas dimensions
    canvas.width = 512;
    canvas.height = 256;
    
    if (context) {
      // Clear canvas
      context.clearRect(0, 0, canvas.width, canvas.height);
      
      // Text settings
      context.font = "Bold 48px Arial";
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      
      // Add text shadow
      context.shadowColor = 'black';
      context.shadowBlur = 7;
      context.shadowOffsetX = 3;
      context.shadowOffsetY = 3;
      
      // Fill with white text
      context.fillStyle = 'white';
      context.fillText(text, canvas.width / 2, canvas.height / 2);
      
      // Add type in smaller font below
      context.font = "32px Arial";
      context.fillText(type, canvas.width / 2, canvas.height / 2 + 48);
    }
    
    const texture = new (window as any).THREE.Texture(canvas);
    texture.needsUpdate = true;
    
    return texture;
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden relative">
      <div ref={containerRef} className="flex-1" style={{ position: 'relative' }}></div>
    </div>
  );
}