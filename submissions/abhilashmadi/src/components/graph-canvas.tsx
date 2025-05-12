import useGraphyEditorContext from "@/hooks/use-graphy-store";
import NodeTooltip from "@components/node-tooltip";
import { useTheme } from "@hooks/use-theme";
import type { GraphNode, GraphEdge, GraphData } from "@schema/input-json-schema";
import * as d3 from "d3";
import { type FC, useEffect, useRef, useState } from "react";
import GraphToolbox from "./graph-toolbox";
import EmptyGraph from "./empty-graph";

interface SimulationNode extends GraphNode {
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
  index?: number;
}

interface SimulationEdge extends Omit<GraphEdge, "source" | "target"> {
  source: string | SimulationNode;
  target: string | SimulationNode;
}

const GraphCanvas: FC = () => {
  const [, setSelectedNode] = useState<SimulationNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<SimulationNode | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);

  const { state: graphData } = useGraphyEditorContext() as { state: GraphData };
  const { theme } = useTheme();

  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!graphData || !svgRef.current || !containerRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const container = svg.append("g");
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

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

    const nodes: SimulationNode[] = graphData.nodes.map(n => ({ ...n }));
    const edges: SimulationEdge[] = graphData.edges.map(e => ({ ...e }));

    const simulation = d3.forceSimulation<SimulationNode>(nodes)
      .force(
        "link",
        d3.forceLink<SimulationNode, SimulationEdge>(edges)
          .id(d => d.id)
          .distance(120)
      )
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius(50));

    // arrow marker
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

    // edges
    const edgeGroup = container.selectAll(".edge")
      .data(edges)
      .enter()
      .append("g")
      .attr("class", "edge");

    const links = edgeGroup.append("path")
      .attr("stroke", d => d.style?.color || (theme === "dark" ? "#aaa" : "#999"))
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", d => {
        return d.style?.lineType === "dashed"
          ? "6,4"
          : d.style?.lineType === "dotted"
            ? "2,4"
            : "0";
      })
      .attr("marker-end", d => (d.direction === "->" ? "url(#arrow)" : null))
      .attr("fill", "none")


    // edge labels with background
    const edgeLabel = edgeGroup.append("g")
      .each(function (d) {
        const g = d3.select(this);
        const textValue = d.label
          ? d.label.charAt(0).toUpperCase() + d.label.slice(1)
          : "";

        const text = g.append("text")
          .attr("dy", -5)
          .attr("text-anchor", "middle")
          .attr("fill", theme === "dark" ? "#ddd" : "#666")
          .attr("font-size", "10px")
          .text(textValue);

        const bbox = text.node()!.getBBox();
        g.insert("rect", "text")
          .attr("x", bbox.x - 2)
          .attr("y", bbox.y - 1)
          .attr("width", bbox.width + 4)
          .attr("height", bbox.height + 2)
          .attr("fill", theme === "dark" ? "#333" : "#eee")
          .attr("rx", 2);
      });

    // nodes
    const nodeGroup = container.selectAll(".node")
      .data(nodes)
      .enter()
      .append("g")
      .attr("class", "node")
      .call(
        d3.drag<SVGGElement, SimulationNode>()
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
          })
      )
      .on("mouseover", (_, d) => {
        if (!svgRef.current || !containerRef.current) return;
        const pt = svgRef.current.createSVGPoint();
        pt.x = d.x!;
        pt.y = d.y!;
        const screenCTM = (svgRef.current.querySelector("g") as SVGGElement).getScreenCTM();
        if (!screenCTM) return;
        const transformed = pt.matrixTransform(screenCTM);
        // const rect = containerRef.current.getBoundingClientRect();
        setHoveredNode(d);
        setTooltipPosition({ x: transformed.x + 20, y: transformed.y - 40 });
      })
      .on("mouseout", () => {
        setHoveredNode(null);
        setTooltipPosition(null);
      })
      .on("click", (event, d) => {
        event.stopPropagation();
        setSelectedNode(d);
      });

    // draw node shapes
    nodeGroup.each(function (d) {
      const sel = d3.select(this);
      const color = d.style?.color || "#999";
      switch (d.style?.shape) {
        case "rectangle":
          sel.append("rect")
            .attr("x", -15).attr("y", -15)
            .attr("width", 30).attr("height", 30)
            .attr("fill", color);
          break;
        case "diamond":
          sel.append("path")
            .attr("d", d3.symbol().type(d3.symbolDiamond).size(400)()!)
            .attr("fill", color);
          break;
        default:
          sel.append("circle").attr("r", 15).attr("fill", color);
      }
    });

    // node labels
    nodeGroup.append("text")
      .attr("dy", 25)
      .attr("text-anchor", "middle")
      .attr("fill", theme === "dark" ? "#fff" : "#333")
      .attr("font-size", "10px")
      .text(d => d.label);

    nodeGroup.append("text")
      .attr("dy", 35)
      .attr("text-anchor", "middle")
      .attr("fill", theme === "dark" ? "#bbb" : "#666")
      .attr("font-size", "8px")
      .text(d => d.type);

    // tick updates
    let tickCount = 0;
    simulation.on("tick", () => {
      tickCount++;
      links.attr("d", d => {
        const s = typeof d.source === "object" ? d.source : nodes.find(n => n.id === d.source)!;
        const t = typeof d.target === "object" ? d.target : nodes.find(n => n.id === d.target)!;
        return `M${s.x},${s.y}L${t.x},${t.y}`;
      });
      edgeLabel.attr("transform", d => {
        const s = typeof d.source === "object" ? d.source : nodes.find(n => n.id === d.source)!;
        const t = typeof d.target === "object" ? d.target : nodes.find(n => n.id === d.target)!;
        const x = (s.x! + t.x!) / 2;
        const y = (s.y! + t.y!) / 2;
        return `translate(${x},${y})`;
      });
      nodeGroup.attr("transform", d => `translate(${d.x},${d.y})`);

      if (tickCount === 50) {
        const b = containerRef.current!.getBoundingClientRect();
        const xs = nodes.map(n => n.x!);
        const ys = nodes.map(n => n.y!);
        const minX = Math.min(...xs), maxX = Math.max(...xs);
        const minY = Math.min(...ys), maxY = Math.max(...ys);
        const scale = 0.9 / Math.max((maxX - minX) / b.width, (maxY - minY) / b.height);
        const tx = (b.width - scale * (minX + maxX)) / 2;
        const ty = (b.height - scale * (minY + maxY)) / 2;
        svg.transition().duration(500)
          .call(d3.zoom<SVGSVGElement, unknown>().transform,
            d3.zoomIdentity.translate(tx, ty).scale(scale));
      }
    });

    svg.on("click", () => setSelectedNode(null));

    const handleResize = () => {
      if (!containerRef.current) return;
      simulation.force("center",
        d3.forceCenter(containerRef.current.clientWidth / 2, containerRef.current.clientHeight / 2)
      );
      simulation.alpha(0.3).restart();
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      simulation.stop();
    };
  }, [graphData, theme]);

  if (!graphData.nodes.length) return <EmptyGraph />

  return (
    <main className="h-dvh">
      <div ref={containerRef} className="w-full h-full relative">
        <svg ref={svgRef} className="w-full h-full absolute top-0 left-0" />
        <GraphToolbox />
        <NodeTooltip visible={!!hoveredNode} node={hoveredNode} position={tooltipPosition} />
      </div>
    </main>
  );
};

export default GraphCanvas;
