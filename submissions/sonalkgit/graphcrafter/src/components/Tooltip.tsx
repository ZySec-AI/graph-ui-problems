/** 
 * Tooltip component for displaying custom data when hovering over nodes in a Cytoscape graph. 
 * It listens to mouse events on the nodes, extracts relevant data, and shows it in a styled tooltip.
 */

import React, { useEffect, useState } from 'react';
import cytoscape from 'cytoscape';

interface Props {
  cy: cytoscape.Core;
}

const Tooltip: React.FC<Props> = ({ cy }) => {
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    content: string[];
  } | null>(null);

  useEffect(() => {
    const showTooltip = (event: cytoscape.EventObject) => {
      const node = event.target;
      const position = node.renderedPosition();
      const data = node.data();

      const excludeKeys = ['id', 'label', 'group', 'style', 'type'];
      const content: string[] = [];

      for (const [key, value] of Object.entries(data)) {
        if (!excludeKeys.includes(key)) {
          content.push(`${key}: ${value}`);
        }
      }

      if (data.properties && typeof data.properties === 'object') {
        for (const [key, value] of Object.entries(data.properties)) {
          content.push(`${key}: ${value}`);
        }
      }

      setTooltip({
        x: position.x,
        y: position.y,
        content,
      });
    };

    const hideTooltip = () => {
      setTooltip(null);
    };

    cy.on('mouseover', 'node', showTooltip);
    cy.on('mouseout', 'node', hideTooltip);

    return () => {
      cy.off('mouseover', 'node', showTooltip);
      cy.off('mouseout', 'node', hideTooltip);
    };
  }, [cy]);

  if (!tooltip) return null;

  return (
    <div
      style={{
        position: 'absolute',
        left: tooltip.x + 10,
        top: tooltip.y + 10,
        background: 'rgba(0, 0, 0, 0.75)',
        color: 'white',
        padding: '6px 10px',
        borderRadius: '4px',
        fontSize: '12px',
        pointerEvents: 'none',
        whiteSpace: 'pre-line',
        zIndex: 9999,
      }}
    >
      {tooltip.content.map((line, index) => (
        <div key={index}>{line}</div>
      ))}
    </div>
  );
};

export default Tooltip;
