import React, { useEffect, useRef } from 'react';
import cytoscape from 'cytoscape';
import qtip from 'cytoscape-qtip';

cytoscape.use(qtip);

const GraphView = ({ data }) => {
  const cyRef = useRef(null);

  useEffect(() => {
    if (!data || !cyRef.current) return;

    const cy = cytoscape({
      container: cyRef.current,
      elements: data.elements,
      style: [
        {
          selector: 'node',
          style: {
            label: 'data(label)',
            width: 40,
            height: 40,
            'background-color': 'data(color)',
            shape: 'data(shape)',
            'font-size': 10,
            'text-valign': 'center',
            'text-halign': 'center',
          },
        },
        {
          selector: 'edge',
          style: {
            label: 'data(label)',
            width: 2,
            'line-color': 'data(color)',
            'target-arrow-color': 'data(color)',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'font-size': 8,
          },
        },
      ],
      layout: { name: 'cose' },
    });

    cy.nodes().forEach((node) => {
      node.qtip({
        content: node.data('tooltip'),
        position: {
          my: 'top center',
          at: 'bottom center',
        },
        style: {
          classes: 'qtip-bootstrap',
        },
      });
    });

    cy.edges().forEach((edge) => {
      edge.qtip({
        content: edge.data('tooltip'),
        position: {
          my: 'top center',
          at: 'bottom center',
        },
        style: {
          classes: 'qtip-bootstrap',
        },
      });
    });

    return () => {
      cy.destroy();
    };
  }, [data]);

  return <div ref={cyRef} style={{ width: '100%', height: '500px' }} />;
};

export default GraphView;
