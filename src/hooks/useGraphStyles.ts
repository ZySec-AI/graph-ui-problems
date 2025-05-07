import { useCallback } from 'react';
import { Node, Edge } from '../types/graph';

export const useGraphStyles = () => {
  // Get styling for a node based on its type and custom style
  const getNodeStyle = useCallback((node: Node) => {
    const defaultStyle = {
      backgroundColor: '#888888',
      shape: 'ellipse',
      width: 40,
      height: 40,
      borderWidth: 1,
      borderColor: '#333333'
    };
    
    const customStyle = {
      backgroundColor: node.style?.color || defaultStyle.backgroundColor,
      shape: mapNodeShape(node.style?.shape || 'circle'),
      borderColor: darkenColor(node.style?.color || defaultStyle.backgroundColor, 20)
    };
    
    return { ...defaultStyle, ...customStyle };
  }, []);
  
  // Get styling for an edge based on its custom style
  const getEdgeStyle = useCallback((edge: Edge) => {
    const defaultStyle = {
      lineColor: '#888888',
      lineStyle: 'solid',
      width: 2,
      arrowShape: edge.direction === 'one-way' ? 'triangle' : 'none'
    };
    
    const customStyle = {
      lineColor: edge.style?.color || defaultStyle.lineColor,
      lineStyle: edge.style?.dashed ? 'dashed' : 'solid'
    };
    
    return { ...defaultStyle, ...customStyle };
  }, []);
  
  return { getNodeStyle, getEdgeStyle };
};

// Helper function to map node shape names to Cytoscape shape names
function mapNodeShape(shape: string): string {
  const shapeMap: Record<string, string> = {
    'circle': 'ellipse',
    'rectangle': 'rectangle',
    'diamond': 'diamond',
    'triangle': 'triangle',
    'hexagon': 'hexagon',
    'star': 'star'
  };
  
  return shapeMap[shape] || 'ellipse';
}

// Helper function to darken a color by a given percentage
function darkenColor(color: string, percent: number): string {
  if (!color) return '#333333';
  
  // Remove the # if present
  let hex = color.replace('#', '');
  
  // Convert to RGB
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);
  
  // Darken
  r = Math.floor(r * (100 - percent) / 100);
  g = Math.floor(g * (100 - percent) / 100);
  b = Math.floor(b * (100 - percent) / 100);
  
  // Convert back to hex
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}