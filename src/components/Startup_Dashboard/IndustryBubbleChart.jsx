import * as d3 from "d3";
import { useEffect, useRef } from "react";

const IndustryBubbleChart = () => {
  const svgRef = useRef();

  useEffect(() => {
    const fetchDataAndRenderChart = async () => {
      try {
        // Fetch data from API
        const response = await fetch(
          "https://development.stieahub.in/Codigniter_api/public/toptenindustries"
        );
        const json = await response.json();
        
        // Transform data to required format
        const data = json.data.map((item) => ({
          id: `${item.industry_id}.${item.industry_category_name}`,
          value: parseInt(item.count),
          name: item.industry_category_name,
        }));

        // Chart dimensions and configuration
        const width = 928;
        const height = width;
        const margin = 1;
        const format = d3.format(",d");
        const color = d3.scaleOrdinal(d3.schemeTableau10);

        // Create the pack layout
        const pack = d3
          .pack()
          .size([width - margin * 2, height - margin * 2])
          .padding(3);

        // Compute hierarchy
        const root = pack(d3.hierarchy({ children: data }).sum((d) => d.value));

        // Clear previous SVG
        d3.select(svgRef.current).selectAll("*").remove();

        // Create SVG container
        const svg = d3
          .select(svgRef.current)
          .attr("width", width)
          .attr("height", height)
          .attr("viewBox", [-margin, -margin, width, height].toString())
          .attr("style", "max-width: 100%; height: auto; font: 13px sans-serif;")
          .attr("text-anchor", "middle");

        // Create nodes
        const node = svg
          .append("g")
          .selectAll()
          .data(root.leaves())
          .join("g")
          .attr("transform", (d) => `translate(${d.x},${d.y})`);

        // Add tooltip titles
        node
          .append("title")
          .text((d) => `${d.data.name}\n${format(d.value)}`);

        // Add circles
        node
          .append("circle")
          .attr("fill-opacity", 0.7)
          .attr("fill", (d) => color(d.data.id.split(".")[0]))
          .attr("r", (d) => d.r);

        // Add labels
        const text = node.append("text").attr("clip-path", (d) => `circle(${d.r})`);

        // Add industry name
        text
          .append("tspan")
          .attr("x", 0)
          .attr("y", 0)
          .text((d) => d.data.name);

        // Add count value
        text
          .append("tspan")
          .attr("x", 0)
          .attr("y", "1.2em")
          .attr("fill-opacity", 0.7)
          .text((d) => format(d.value));

      } catch (error) {
        console.error("Error fetching or rendering data:", error);
      }
    };

    fetchDataAndRenderChart();
  }, []);

  return (
    <div style={{ width: "100%", overflow: "auto" }}>
      <svg ref={svgRef} />
    </div>
  );
};

export default IndustryBubbleChart;