import React, { useEffect, useState } from "react";
import CytoscapeComponent from "react-cytoscapejs";
import cytoscape from "cytoscape";
import tippy from "tippy.js";
import "tippy.js/dist/tippy.css"; // Tooltip styling

import sampleData from "../sample.json";
import './App.css';

const style = {
  width: "100%",
  height: "100vh",
  backgroundColor: "#f5f7fa",
};

const getShape = (type) => {
  switch (type) {
    case "Person":
    case "User":
      return "ellipse";
    case "Document":
      return "rectangle";
    case "Policy":
      return "diamond";
    case "Infrastructure":
      return "hexagon";
    case "Group":
      return "roundrectangle";
    default:
      return "ellipse";
  }
};

function App() {
  const [elements, setElements] = useState([]);

  useEffect(() => {
    const nodes = sampleData.nodes.map((node) => ({
      data: {
        id: node.id,
        label: node.label,
        title: Object.entries(node.properties || {})
          .map(([k, v]) => `${k}: ${v}`)
          .join("<br/>"),
        shape: getShape(node.type),
      },
      style: {
        backgroundColor: node.style?.color || "#ccc",
        width: 30,
        height: 30,
      },
    }));

    const edges = sampleData.edges.map((edge, index) => ({
      data: {
        id: `edge-${index}`,
        source: edge.source,
        target: edge.target,
        label: edge.label,
      },
      classes: edge.style?.dashed
        ? "dashed"
        : edge.style?.lineType === "dotted"
        ? "dotted"
        : "",
      style: {
        "line-color": edge.style?.color || "#888",
        "target-arrow-color": edge.style?.color || "#888",
      },
    }));

    setElements([...nodes, ...edges]);
  }, []);

  const handleLayout = (cy) => {
    if (!cy) return;

    cy.layout({
      name: "grid",
      animate: true,
      padding: 50,
      nodeRepulsion: 5000,
      idealEdgeLength: 100,
      edgeElasticity: 0.5,
    }).run();

    const tooltips = [];

    cy.nodes().forEach((node) => {
      const content = document.createElement("div");
      content.innerHTML = `<strong>${node.data("label")}</strong><br/>${node.data("title")}`;

      const tip = tippy(document.createElement("div"), {
        content,
        allowHTML: true,
        placement: "bottom",
        trigger: "manual",
        theme: "light-border",
        arrow: true,
      });

      tooltips.push({ node, tip });
    });

    cy.on("mouseover", "node", (event) => {
      const t = tooltips.find((t) => t.node.id() === event.target.id());
      if (t) {
        const pos = event.target.renderedPosition();
        t.tip.setProps({
          getReferenceClientRect: () => ({
            width: 0,
            height: 0,
            top: pos.y,
            bottom: pos.y,
            left: pos.x,
            right: pos.x,
          }),
        });
        t.tip.show();
      }
    });

    cy.on("mouseout", "node", (event) => {
      const t = tooltips.find((t) => t.node.id() === event.target.id());
      if (t) t.tip.hide();
    });
  };

  return (
    <div className="graph-wrapper">
      <CytoscapeComponent
        elements={elements}
        style={style}
        layout={{ name: "cose", animate: true, padding: 20 }}
        cy={handleLayout}
        stylesheet={[
          {
            selector: "node",
            style: {
              label: "data(label)",
              shape: "data(shape)",
              color: "#fff",
              "text-valign": "center",
              "text-halign": "center",
              "background-opacity": 1,
              "font-size": "12px",
              "text-outline-color": "#000",
              "text-outline-width": 1.5,
              "overlay-padding": "6px",
              "z-index": 10,
              "border-width": 2,
              "border-color": "#333",
            },
          },
          {
            selector: "node:hover",
            style: {
              "border-color": "#000",
              "border-width": 3,
              cursor: "pointer",
            },
          },
          {
            selector: "edge",
            style: {
              label: "data(label)",
              "curve-style": "bezier",
              "target-arrow-shape": "triangle",
              "arrow-scale": 1,
              "font-size": "10px",
              "text-rotation": "autorotate",
              "line-style": "solid",
              width: 2,
              "text-margin-y": -5,
            },
          },
          {
            selector: ".dashed",
            style: {
              "line-style": "dashed",
            },
          },
          {
            selector: ".dotted",
            style: {
              "line-style": "dotted",
            },
          },
          {
            selector: "edge:hover",
            style: {
              width: 3,
              "line-color": "#000",
              "target-arrow-color": "#000",
              "font-weight": "bold",
              cursor: "pointer",
            },
          },
        ]}
      />
    </div>
  );
}

export default App;
