import React, { useLayoutEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5hierarchy from "@amcharts/amcharts5/hierarchy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

const GlobalSynergy = () => {
  const chartRef = useRef(null);

  useLayoutEffect(() => {
    if (!chartRef.current) return;

    // Create root
    let root = am5.Root.new(chartRef.current);

    root._logo.dispose();
    // Apply theme
    root.setThemes([am5themes_Animated.new(root)]);

    // Container
    let container = root.container.children.push(
      am5.Container.new(root, {
        width: am5.percent(100),
        height: am5.percent(100),
        layout: root.verticalLayout,
      })
    );

    // ForceDirected series
    let series = container.children.push(
      am5hierarchy.ForceDirected.new(root, {
        singleBranchOnly: false,
        downDepth: 1,
        initialDepth: 2,
        valueField: "value",
        categoryField: "name",
        childDataField: "children",
        centerStrength: 0.5,
      })
    );

    // Random data
    let maxLevels = 2;
    let maxNodes = 5;
    let maxValue = 100;

    let data = {
      name: "Root",
      children: [],
    };
    generateLevel(data, "", 0);

    // ✅ Add manual fixed node
    // data.children.push({
    //   name: "Extra Node",
    //   value: 60,
    //   children: [
    //     { name: "Child A", value: 30 },
    //     { name: "Child B", value: 20 },
    //   ],
    // });

    // Set chart data
    series.data.setAll([data]);
    series.set("selectedDataItem", series.dataItems[0]);

    // Animate
    series.appear(1000, 100);

    function generateLevel(data, name, level) {
      for (let i = 0; i < Math.ceil(maxNodes * Math.random()) + 1; i++) {
        let nodeName = name + "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[i];
        let child;
        if (level < maxLevels) {
          child = { name: nodeName + level };
          if (level > 0 && Math.random() < 0.5) {
            child.value = Math.round(Math.random() * maxValue);
          } else {
            child.children = [];
            generateLevel(child, nodeName + i, level + 1);
          }
        } else {
          child = {
            name: name + i,
            value: Math.round(Math.random() * maxValue),
          };
        }
        data.children.push(child);
      }
      return data;
    }

    return () => {
      root.dispose();
    };
  }, []);

  return (
    <div
      ref={chartRef}
      id="chartdiv"
      style={{ width: "100%", height: "500px" }}
    ></div>
  );
};

export default GlobalSynergy;


