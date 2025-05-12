import { type FC, useEffect, useRef, useState } from "react";
import type { Graph, Node, Edge } from "../types/graph";
import InfoText from "./InfoText";
import * as d3 from "d3";
import ControlPanel from "./ControlPanel";
import NodeDetails from "./NodeDetails";
import { useTheme } from "../contexts/ThemeContext";

type GraphCrafterProps = {
  loading: boolean;
  error: string;
  graphData?: Graph;
};

interface SimulationNode extends Node {
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
  index?: number;
}

interface SimulationEdge extends Omit<Edge, "source" | "target"> {
  source: string | SimulationNode;
  target: string | SimulationNode;
}

const GraphCrafter: FC<GraphCrafterProps> = ({ loading, error, graphData }) => {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const { theme } = useTheme();

  const svgRef = useRef(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef(null);

  const toolTipHtml = (d: SimulationNode) => `
            <div class="tooltip-header font-bold ${theme === "dark" ? "text-white" : "text-gray-800"}">
              <strong>${d.label}</strong> (${d.type})
            </div>
            <div class="tooltip-content">
              ${Object.entries(d.properties || {})
                .map(
                  ([key, value]) => `
                <div class="${theme === "dark" ? "text-gray-200" : "text-gray-700"}"><strong>${key}:</strong> ${value}</div>
              `,
                )
                .join("")}
              ${d.group ? `<div class="${theme === "dark" ? "text-gray-200" : "text-gray-700"}"><strong>Group:</strong> ${d.group}</div>` : ""}
            </div>
          `;

  useEffect(() => {
    if (!graphData || !svgRef.current) return;

    // Clear graph
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current);
    const container = svg.append("g");
    const width = containerRef.current?.clientWidth || 800;
    const height = containerRef.current?.clientHeight || 600;

    svg.attr("class", theme === "dark" ? "bg-gray-900" : "bg-white");

    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on("zoom", (event: d3.D3ZoomEvent<SVGSVGElement, unknown>) => {
        container.attr("transform", event.transform.toString());
      });

    svg.call(zoom as any);

    const simulationNodes = graphData.nodes as SimulationNode[];
    const simulationEdges = graphData.edges.map((edge) => ({
      ...edge,
      source: edge.source,
      target: edge.target,
    })) as SimulationEdge[];

    const simulation = d3
      .forceSimulation<SimulationNode>(simulationNodes)
      .force(
        "link",
        d3
          .forceLink<SimulationNode, SimulationEdge>(simulationEdges)
          .id((d) => d.id)
          .distance(100),
      )
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius(50));

    const tooltip = d3.select(tooltipRef.current);

    // Create the edges with arrows
    const edge = container
      .selectAll(".edge")
      .data(simulationEdges)
      .enter()
      .append("g")
      .attr("class", "edge");

    const link = edge
      .append("path")
      .attr(
        "stroke",
        (d) => d.style?.color || (theme === "dark" ? "#aaa" : "#999"),
      )
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", (d) => (d.style?.dashed ? "5,5" : "none"))
      .attr("marker-end", (d) =>
        d.direction === "one-way" || d.direction === "->"
          ? "url(#arrow)"
          : null,
      )
      .attr("fill", "none");

    const edgeLabel = edge
      .append("text")
      .attr("class", "edge-label")
      .attr("dy", -5)
      .attr("text-anchor", "middle")
      .attr("fill", theme === "dark" ? "#ddd" : "#666")
      .attr("font-size", "10px")
      .text((d) => d.label);

    svg
      .append("defs")
      .selectAll("marker")
      .data(["arrow"])
      .enter()
      .append("marker")
      .attr("id", "arrow")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 20)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("fill", theme === "dark" ? "#ccc" : "#999")
      .attr("d", "M0,-5L10,0L0,5"); // This code creates Arrow

    // Create the nodes
    const nodeGroup = container
      .selectAll(".node")
      .data(simulationNodes)
      .enter()
      .append("g")
      .attr("class", "node")
      .call(
        d3
          .drag<SVGGElement, SimulationNode>()
          .on("start", dragStarted)
          .on("drag", dragged)
          .on("end", dragEnded) as any,
      )
      .on("mouseover", (event: MouseEvent, d: SimulationNode) => {
        tooltip
          .style("opacity", 1)
          .html(toolTipHtml(d))
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 28 + "px");
      })
      .on("mouseout", () => {
        tooltip.style("opacity", 0);
      })
      .on("click", (event: MouseEvent, d: SimulationNode) => {
        event.stopPropagation();
        setSelectedNode(d);
        tooltip.style("opacity", 0);
      });

    // Add shapes for nodes based on style
    nodeGroup.each(function (d) {
      const shape = d.style?.shape || "circle";
      const node = d3.select(this);

      if (shape === "circle") {
        node
          .append("circle")
          .attr("r", 15)
          .attr("fill", d.style?.color || "#999");
      } else if (shape === "rectangle") {
        node
          .append("rect")
          .attr("x", -15)
          .attr("y", -15)
          .attr("width", 30)
          .attr("height", 30)
          .attr("fill", d.style?.color || "#999");
      } else if (shape === "diamond") {
        node
          .append("path")
          .attr("d", d3.symbol().type(d3.symbolDiamond).size(400))
          .attr("fill", d.style?.color || "#999");
      }
    });

    // Add node labels
    nodeGroup
      .append("text")
      .attr("dx", 0)
      .attr("dy", 25)
      .attr("text-anchor", "middle")
      .attr("fill", theme === "dark" ? "#fff" : "#333")
      .attr("font-size", "10px")
      .text((d) => d.label);

    // Add type labels
    nodeGroup
      .append("text")
      .attr("dx", 0)
      .attr("dy", 35)
      .attr("text-anchor", "middle")
      .attr("fill", theme === "dark" ? "#bbb" : "#666")
      .attr("font-size", "8px")
      .text((d) => d.type);

    simulation.on("tick", () => {
      link.attr("d", (d) => {
        const sourceNode =
          typeof d.source === "object"
            ? d.source
            : (graphData.nodes.find(
                (node) => node.id === d.source,
              ) as SimulationNode);

        const targetNode =
          typeof d.target === "object"
            ? d.target
            : (graphData.nodes.find(
                (node) => node.id === d.target,
              ) as SimulationNode);

        if (!sourceNode || !targetNode) return "";

        const sourceX = sourceNode.x || 0;
        const sourceY = sourceNode.y || 0;
        const targetX = targetNode.x || 0;
        const targetY = targetNode.y || 0;

        return `M${sourceX},${sourceY}L${targetX},${targetY}`;
      });

      // Update edge labels
      edgeLabel.attr("transform", (d) => {
        const sourceNode =
          typeof d.source === "object"
            ? d.source
            : (graphData.nodes.find(
                (node) => node.id === d.source,
              ) as SimulationNode);
        const targetNode =
          typeof d.target === "object"
            ? d.target
            : (graphData.nodes.find(
                (node) => node.id === d.target,
              ) as SimulationNode);

        if (!sourceNode || !targetNode) return "";

        const sourceX = sourceNode.x || 0;
        const sourceY = sourceNode.y || 0;
        const targetX = targetNode.x || 0;
        const targetY = targetNode.y || 0;

        const x = (sourceX + targetX) / 2;
        const y = (sourceY + targetY) / 2;

        return `translate(${x},${y})`;
      });

      // Update node positions
      nodeGroup.attr("transform", (d) => `translate(${d.x || 0},${d.y || 0})`);
    });

    function dragStarted(
      event: d3.D3DragEvent<SVGGElement, SimulationNode, SimulationNode>,
      d: SimulationNode,
    ) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(
      event: d3.D3DragEvent<SVGGElement, SimulationNode, SimulationNode>,
      d: SimulationNode,
    ) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragEnded(
      event: d3.D3DragEvent<SVGGElement, SimulationNode, SimulationNode>,
      d: SimulationNode,
    ) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    svg.on("click", () => {
      setSelectedNode(null);
    });

    const handleResize = () => {
      if (!containerRef.current) return;

      simulation.force(
        "center",
        d3.forceCenter(
          containerRef.current.clientWidth / 2,
          containerRef.current.clientHeight / 2,
        ),
      );
      simulation.alpha(0.3).restart();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      simulation.stop();
    };
  }, [graphData, theme, setSelectedNode]);

  const onSidebarClose = () => {
    setSelectedNode(null);
  };

  if (loading) {
    return <InfoText title="Loading graph..." />;
  }

  if (error) {
    return <InfoText type="error" title={error} />;
  }

  if (graphData === undefined) {
    return <InfoText title={"Please upload a json file"} />;
  }

  return (
    <main className="flex flex-1 overflow-hidden">
      <div className="relative flex-1" ref={containerRef}>
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          className={theme === "dark" ? "bg-gray-900" : "bg-white"}
        ></svg>

        <div
          ref={tooltipRef}
          className={`pointer-events-none absolute z-10 max-w-xs rounded border p-2 text-sm opacity-0 shadow-lg transition-opacity duration-200 ${
            theme === "dark"
              ? "border-gray-700 bg-gray-800 text-white"
              : "border-gray-200 bg-white text-gray-800"
          }`}
        ></div>
      </div>

      <NodeDetails nodeDetails={selectedNode} onClose={onSidebarClose} />
      <ControlPanel />
    </main>
  );
};

export default GraphCrafter;
