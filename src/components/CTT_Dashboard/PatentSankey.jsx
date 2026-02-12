import React, { useEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5flow from "@amcharts/amcharts5/flow";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

const PatentSankey = ({ data }) => {
  const sankeyRef = useRef(null);

  useEffect(() => {
    const root = am5.Root.new(sankeyRef.current);
    root.setThemes([am5themes_Animated.new(root)]);
    root._logo.dispose();

    const series = root.container.children.push(
      am5flow.Sankey.new(root, {
        sourceIdField: "from",
        targetIdField: "to",
        valueField: "value",
        nodePadding: 20
      })
    );

    series.nodes.setAll({
      fill: am5.color(0x1565c0),
      stroke: am5.color(0xffffff),
      tooltipText: "{id}"
    });

    series.links.setAll({
      fillOpacity: 0.5,
      tooltipText: "{from} → {to}: {value} patents"
    });

    series.data.setAll(data);

    return () => root.dispose();
  }, [data]);

  return (
    <div
      ref={sankeyRef}
      style={{ width: "100%", height: "300px" }}
    />
  );
};

export default PatentSankey;

