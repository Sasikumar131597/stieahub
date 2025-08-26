// import React, { Component } from "react";
// import * as am5 from "@amcharts/amcharts5";
// import * as am5hierarchy from "@amcharts/amcharts5/hierarchy";
// import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

// class GlobalSynergy extends Component {
//   chartDiv = React.createRef();

//   componentDidMount() {
//     // Create root
//     this.root = am5.Root.new(this.chartDiv.current);

//     // Apply theme
//     this.root.setThemes([am5themes_Animated.new(this.root)]);

//     // Zoomable container
//     let zoomableContainer = this.root.container.children.push(
//       am5.ZoomableContainer.new(this.root, {
//         width: am5.percent(100),
//         height: am5.percent(100),
//         wheelable: true,
//         pinchZoom: true
//       })
//     );

//     // Zoom tools
//     zoomableContainer.children.push(
//       am5.ZoomTools.new(this.root, {
//         target: zoomableContainer
//       })
//     );

//     // Create ForceDirected series
//     let series = zoomableContainer.contents.children.push(
//       am5hierarchy.ForceDirected.new(this.root, {
//         singleBranchOnly: false,
//         downDepth: 1,
//         initialDepth: 10,
//         nodePadding: 20,
//         valueField: "value",
//         categoryField: "name",
//         childDataField: "children"
//       })
//     );

//     // Custom arrow bullets on links
//     series.linkBullets.push((root, source, target) => {
//       const bullet = am5.Bullet.new(root, {
//         locationX: 0.5,
//         autoRotate: true,
//         autoRotateAngle: 180,
//         sprite: am5.Graphics.new(root, {
//           fill: source.get("fill"),
//           centerY: am5.percent(50),
//           centerX: am5.percent(50),
//           draw: (display) => {
//             display.moveTo(0, -6);
//             display.lineTo(16, 0);
//             display.lineTo(0, 6);
//             display.lineTo(3, 0);
//             display.lineTo(0, -6);
//           }
//         })
//       });

//       bullet.animate({
//         key: "locationX",
//         to: -0.1,
//         from: 1.1,
//         duration: Math.random() * 500 + 1000,
//         loops: Infinity,
//         easing: am5.ease.quad
//       });

//       return bullet;
//     });

//     series.labels.template.set("minScale", 0);

//     // Generate & set data
//     let maxLevels = 1;
//     let maxNodes = 3;
//     let maxValue = 100;

//     let data = { name: "Root", children: [] };
//     this.generateLevel(data, "", 0, maxLevels, maxNodes, maxValue);

//     // ✅ Add another custom node manually
//     data.children.push({
//       name: "Extra Node",
//       value: 50
//     });

//     series.data.setAll([data]);
//     series.set("selectedDataItem", series.dataItems[0]);

//     // Animate
//     series.appear(1000, 100);

//     this.series = series;
//   }

//   // Recursive data generator
//   generateLevel(data, name, level, maxLevels, maxNodes, maxValue) {
//     for (let i = 0; i < Math.ceil(maxNodes * Math.random()) + 1; i++) {
//       let nodeName = name + "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[i];
//       let child;
//       if (level < maxLevels) {
//         child = { name: nodeName + level };

//         if (level > 0 && Math.random() < 0.5) {
//           child.value = Math.round(Math.random() * maxValue);
//         } else {
//           child.children = [];
//           this.generateLevel(
//             child,
//             nodeName + i,
//             level + 1,
//             maxLevels,
//             maxNodes,
//             maxValue
//           );
//         }
//       } else {
//         child = {
//           name: name + i,
//           value: Math.round(Math.random() * maxValue)
//         };
//       }
//       data.children.push(child);
//     }
//   }

//   componentWillUnmount() {
//     if (this.root) {
//       this.root.dispose();
//     }
//   }

//   render() {
//     return (
//       <div
//         id="chartdiv"
//         ref={this.chartDiv}
//         style={{ width: "100%", height: "500px" }}
//       ></div>
//     );
//   }
// }

// export default GlobalSynergy;


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
    data.children.push({
      name: "Extra Node",
      value: 60,
      children: [
        { name: "Child A", value: 30 },
        { name: "Child B", value: 20 },
      ],
    });

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

    // ✅ Cleanup root on unmount
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


