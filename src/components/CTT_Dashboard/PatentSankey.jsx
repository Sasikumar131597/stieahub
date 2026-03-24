// import React, { useEffect, useRef } from "react";
// import * as am5 from "@amcharts/amcharts5";
// import * as am5flow from "@amcharts/amcharts5/flow";
// import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

// const PatentSankey = ({ data }) => {
//   const sankeyRef = useRef(null);

//   useEffect(() => {
//     const root = am5.Root.new(sankeyRef.current);
//     root.setThemes([am5themes_Animated.new(root)]);
//     root._logo.dispose();

//     const series = root.container.children.push(
//       am5flow.Sankey.new(root, {
//         sourceIdField: "from",
//         targetIdField: "to",
//         valueField: "value",
//         nodePadding: 20
//       })
//     );

//     series.nodes.setAll({
//       fill: am5.color(0x1565c0),
//       stroke: am5.color(0xffffff),
//       tooltipText: "{id}"
//     });

//     series.links.setAll({
//       fillOpacity: 0.5,
//       tooltipText: "{from} → {to}: {value} patents"
//     });

//     series.data.setAll(data);

//     return () => root.dispose();
//   }, [data]);

//   return (
//     <div
//       ref={sankeyRef}
//       style={{ width: "100%", height: "300px" }}
//     />
//   );
// };

// export default PatentSankey;


import React, { useLayoutEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5flow from "@amcharts/amcharts5/flow";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

const PatentSankey = ({ data }) => {
  const chartRef = useRef(null);

  useLayoutEffect(() => {
    const root = am5.Root.new(chartRef.current);
    root.setThemes([am5themes_Animated.new(root)]);
    root._logo.dispose();

    const chart = root.container.children.push(
      am5flow.Sankey.new(root, {
        sourceIdField: "from",
        targetIdField: "to",
        valueField: "value",
        paddingRight: 40,
      })
    );

    /* -------- NODE STYLE -------- */
    chart.nodes.get("colors").set("step", 2);

    chart.nodes.rectangles.template.setAll({
      fillOpacity: 0.9,
      strokeWidth: 0,
      cornerRadiusTL: 6,
      cornerRadiusTR: 6,
      cornerRadiusBL: 6,
      cornerRadiusBR: 6,
    });

    /* -------- NODE LABEL -------- */
    chart.nodes.labels.template.setAll({
      fontSize: 12,
      fill: am5.color(0x000000),
      text: "{id}",
    });

    /* -------- LINK STYLE -------- */
    chart.links.template.setAll({
      fillOpacity: 0.5,
      tooltipText: "{sourceId} → {targetId}\nPapers: {value}",
    });

    chart.links.template.states.create("hover", {
      fillOpacity: 0.8,
    });

    /* -------- ADD DATA -------- */
    chart.data.setAll(data);

    chart.appear(1000, 100);

    return () => root.dispose();
  }, [data]);

  return (
    <div
      ref={chartRef}
      style={{ width: "100%", height: "300px" }}
    />
  );
};

export default PatentSankey;
