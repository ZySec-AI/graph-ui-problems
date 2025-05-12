import useEditorStore from "@/hooks/use-app-store";
import NodeTooltip from '@components/node-tooltip';
import { useTheme } from '@hooks/use-theme';
import type { Edge, Node } from "@schema/input-json-schema";
import * as d3 from "d3";
import { type FC, useEffect, useRef, useState } from "react";
import GraphToolbox from "./graph-toolbox";

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

const GraphCanvas: FC = () => {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);

  const { data: graphData } = useEditorStore();
  const { theme } = useTheme();

  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!graphData || !svgRef.current || !containerRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // clear previous content

    const container = svg.append("g");
    const width = containerRef.current.clientWidth || 800;
    const height = containerRef.current.clientHeight || 600;

    svg
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("class", theme === "dark" ? "bg-gray-900" : "bg-white");

    svg.call(
      d3.zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.1, 4])
        .on("zoom", (event) => {
          container.attr("transform", event.transform.toString());
        })
    );

    const nodes: SimulationNode[] = graphData.nodes.map((n: Node) => ({ ...n }));
    const edges: SimulationEdge[] = graphData.edges.map((e: Edge) => ({ ...e }));

    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(edges).id(d => d.id).distance(120))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius(50));

    svg.append("defs").append("marker")
      .attr("id", "arrow")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 20)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("fill", theme === "dark" ? "#ccc" : "#999")
      .attr("d", "M0,-5L10,0L0,5");

    const edgeGroup = container
      .selectAll(".edge")
      .data(edges)
      .enter()
      .append("g")
      .attr("class", "edge");

    const links = edgeGroup
      .append("path")
      .attr("stroke", d => d.style?.color || (theme === "dark" ? "#aaa" : "#999"))
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", d => d.style?.lineType === "dashed" ? "6,4" : d.style?.lineType === "dotted" ? "2,4" : "0")
      .attr("marker-end", d =>
        d.direction === "->"
          ? "url(#arrow)"
          : null)
      .attr("fill", "none");

    const edgeLabel = edgeGroup
      .append("text")
      .attr("class", "edge-label")
      .attr("dy", -5)
      .attr("text-anchor", "middle")
      .attr("fill", theme === "dark" ? "#ddd" : "#666")
      .attr("font-size", "10px")
      .text(d => d.label);

    const nodeGroup = container
      .selectAll(".node")
      .data(nodes)
      .enter()
      .append("g")
      .attr("class", "node")
      .call(d3.drag<SVGGElement, SimulationNode>()
        .on("start", (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on("drag", (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on("end", (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }))
      .on("mouseover", function (_, d) {
        if (!svgRef.current || !containerRef.current) return;

        const pt = svgRef.current.createSVGPoint();
        pt.x = d.x!;
        pt.y = d.y!;

        const screenCTM = (svgRef.current.querySelector("g") as SVGGElement).getScreenCTM();
        if (!screenCTM) return;

        const transformed = pt.matrixTransform(screenCTM);
        const containerRect = containerRef.current.getBoundingClientRect();

        setHoveredNode(d);
        setTooltipPosition({
          x: transformed.x + 20,
          y: transformed.y - containerRect.top - 40
        });
      })
      .on("mouseout", () => {
        setHoveredNode(null);
        setTooltipPosition(null);
      })
      .on("click", (event, d) => {
        event.stopPropagation();
        setSelectedNode(d);
      });

    // Node shape rendering
    nodeGroup.each(function (d) {
      const shape = d.style?.shape ?? "circle";
      const node = d3.select(this);

      if (shape === "rectangle") {
        node.append("rect")
          .attr("x", -15)
          .attr("y", -15)
          .attr("width", 30)
          .attr("height", 30)
          .attr("fill", d.style?.color || "#999");
      } else if (shape === "diamond") {
        node.append("path")
          .attr("d", d3.symbol().type(d3.symbolDiamond).size(400))
          .attr("fill", d.style?.color || "#999");
      } else {
        node.append("circle")
          .attr("r", 15)
          .attr("fill", d.style?.color || "#999");
      }
    });

    // Node label
    nodeGroup.append("text")
      .attr("dy", 25)
      .attr("text-anchor", "middle")
      .attr("fill", theme === "dark" ? "#fff" : "#333")
      .attr("font-size", "10px")
      .text(d => d.label);

    // Type label
    nodeGroup.append("text")
      .attr("dy", 35)
      .attr("text-anchor", "middle")
      .attr("fill", theme === "dark" ? "#bbb" : "#666")
      .attr("font-size", "8px")
      .text(d => d.type);


    let tickCount = 0;
    simulation.on("tick", () => {
      tickCount++;

      // update link paths
      links.attr("d", (d) => {
        const source = typeof d.source === "object" ? d.source : nodes.find(n => n.id === d.source);
        const target = typeof d.target === "object" ? d.target : nodes.find(n => n.id === d.target);

        if (!source || !target) return "";
        return `M${source.x},${source.y}L${target.x},${target.y}`;
      });

      // update edge labels
      edgeLabel.attr("transform", (d) => {
        const source = typeof d.source === "object" ? d.source : nodes.find(n => n.id === d.source);
        const target = typeof d.target === "object" ? d.target : nodes.find(n => n.id === d.target);

        if (!source || !target) return "";
        const x = (source.x + target.x) / 2;
        const y = (source.y + target.y) / 2;
        return `translate(${x},${y})`;
      });

      // update node positions
      nodeGroup.attr("transform", d => `translate(${d.x},${d.y})`);

      // Auto fit graph after 50 ticks
      if (tickCount === 50 && containerRef.current && svgRef.current) {
        const bounds = containerRef.current.getBoundingClientRect();
        const minX = Math.min(...nodes.map((n) => n.x ?? 0));
        const maxX = Math.max(...nodes.map((n) => n.x ?? 0));
        const minY = Math.min(...nodes.map((n) => n.y ?? 0));
        const maxY = Math.max(...nodes.map((n) => n.y ?? 0));

        const graphWidth = maxX - minX;
        const graphHeight = maxY - minY;

        const scale = 0.9 / Math.max(graphWidth / bounds.width, graphHeight / bounds.height);
        const translate = [
          (bounds.width - scale * (minX + maxX)) / 2,
          (bounds.height - scale * (minY + maxY)) / 2,
        ];

        d3.select(svgRef.current)
          .transition()
          .duration(500)
          .call(
            d3.zoom<SVGSVGElement, unknown>().transform,
            d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale)
          );
      }
    });

    svg.on("click", () => setSelectedNode(null));

    const handleResize = () => {
      if (!containerRef.current) return;
      simulation.force("center", d3.forceCenter(
        containerRef.current.clientWidth / 2,
        containerRef.current.clientHeight / 2
      ));
      simulation.alpha(0.3).restart();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      simulation.stop();
    };
  }, [graphData, theme]);

  if (!graphData) {
    return <div className="p-4 text-center">Please upload a JSON file to view the graph.</div>;
  }

  return (
    <main className="flex flex-1 overflow-hidden min-h-dvh">
      <div className="relative flex-1" ref={containerRef}>
        <svg ref={svgRef} className="w-full h-full" />
        <GraphToolbox />
        <NodeTooltip
          visible={true}
          node={hoveredNode}
          position={tooltipPosition} />
      </div>
    </main>
  );
};

export default GraphCanvas;
