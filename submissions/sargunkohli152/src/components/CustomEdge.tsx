import React from 'react';
import { BaseEdge, EdgeLabelRenderer, type EdgeProps, getSimpleBezierPath } from 'reactflow';
import { useThemeStore } from '../store/themeStore';

// Add keyframes animation for the dashed line
const dashAnimation = `
  @keyframes dash {
    to {
      stroke-dashoffset: -20;
    }
  }
`;

const CustomEdge: React.FC<EdgeProps> = ({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  markerStart,
  label,
  data, // Add data prop to access custom edge properties
}) => {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const isDashed = data?.dashed;

  // Calculate the bezier curve path and label position for the edge
  const [edgePath, labelX, labelY] = getSimpleBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  // Apply theme-aware styling to the edge with conditional animation
  const edgeStyle = {
    ...style,
    stroke: isDarkMode ? 'rgb(156, 163, 175)' : style.stroke || '#000', // gray-400 in dark mode
    strokeWidth: style.strokeWidth || 2,
    ...(isDashed && {
      strokeDasharray: '5,5', // Creates the dash pattern
      animation: 'dash 1s linear infinite', // Applies the animation
    }),
  };

  // Update arrow markers based on current theme
  const updatedMarkerEnd = markerEnd
    ? `url(#${isDarkMode ? 'dark-arrow' : 'light-arrow'})`
    : undefined;

  const updatedMarkerStart = markerStart
    ? `url(#${isDarkMode ? 'dark-arrow' : 'light-arrow'})`
    : undefined;

  return (
    <>
      {/* Only add animation styles if there are dashed edges */}
      {isDashed && <style>{dashAnimation}</style>}

      {/* Base edge with theme-aware styling and conditional animation */}
      <BaseEdge
        path={edgePath}
        markerEnd={updatedMarkerEnd}
        markerStart={updatedMarkerStart}
        style={edgeStyle}
      />
      {/* Render edge label if provided */}
      {label && (
        <EdgeLabelRenderer>
          <div
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              fontWeight: 500,
              // Theme-aware label styling
              background: isDarkMode ? 'rgba(31, 41, 55, 0.75)' : 'rgba(255, 255, 255, 0.75)',
              color: isDarkMode ? 'rgb(229, 231, 235)' : 'rgb(31, 41, 55)',
              border: isDarkMode
                ? '1px solid rgba(75, 85, 99, 0.5)'
                : '1px solid rgba(0, 0, 0, 0.1)',
              position: 'absolute',
              fontSize: '0.75rem',
              padding: '0.25rem 0.5rem',
              borderRadius: '0.25rem',
              boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            }}
          >
            {label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
};

export default CustomEdge;
