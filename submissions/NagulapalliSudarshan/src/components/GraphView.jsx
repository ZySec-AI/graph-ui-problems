import React, { useEffect, useRef } from "react";
import cytoscape from "cytoscape";

const GraphView = ({ data }) => {
  const cyRef = useRef(null);

  const formatElements = (data) => {
    const nodes = data.nodes.map((node) => ({
      data: {
        id: node.id,
        label: node.label,
        ...node.properties,
      },
      classes: node.type,
      style: {
        backgroundColor: node.style?.color || "#888",
        shape: node.style?.shape || "ellipse",
        color: "#fff",
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
        lineColor: edge.style?.color || "#ccc",
        targetArrowColor: edge.style?.color || "#ccc",
        targetArrowShape: edge.direction === "one-way" ? "triangle" : "none",
        lineStyle: edge.style?.dashed ? "dashed" : "solid",
      },
    }));

    return [...nodes, ...edges];
  };

  useEffect(() => {
    if (!data || !cyRef.current) return;

    cyRef.current.innerHTML = ""; // Clear previous

    cytoscape({
      container: cyRef.current,
      elements: formatElements(data),
      layout: { name: "cose" },
      style: [
        {
          selector: "node",
          style: {
            label: "data(label)",
            textValign: "center",
            textHalign: "center",
            color: "#fff",
            fontSize: 12,
            textWrap: "wrap",
            width: 50,
            height: 50,
          },
        },
        {
          selector: "edge",
          style: {
            label: "data(label)",
            fontSize: 10,
            curveStyle: "bezier",
            targetArrowShape: "triangle",
          },
        },
      ],
    });
  }, [data]);

  return (
    <div>
      <h2>{data.meta?.title || "Graph"}</h2>
      <p>{data.meta?.description}</p>
      <div ref={cyRef} className="cy-container" />
    </div>
  );
};

export default GraphView;
