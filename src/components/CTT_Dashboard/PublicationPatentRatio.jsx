// import React, { useLayoutEffect, useEffect, useState } from "react";
// import * as am5 from "@amcharts/amcharts5";
// import * as am5percent from "@amcharts/amcharts5/percent";
// import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

// let rootGlobal = null; // ⭐ FIX: Global root to prevent duplicate roots

// const PublicationPatentRatio = () => {
//   const [ratioData, setRatioData] = useState(null);

//   // Fetch API
//   useEffect(() => {
//     const fetchRatio = async () => {
//       try {
//         const res = await fetch(
//           "https://development.stieahub.in/Codigniter_api/public/get_publication_patent_ratio"
//         );
//         const data = await res.json();

//         if (data?.length > 0) {
//           setRatioData({
//             publications: Number(data[0].total_publications),
//             patents: Number(data[0].total_patents),
//           });
//         }
//       } catch (error) {
//         console.error("API error:", error);
//       }
//     };

//     fetchRatio();
//   }, []);

//   // Render chart
//   useLayoutEffect(() => {
//     if (!ratioData) return; // Wait for API
//     if (!document.getElementById("publicationPatentRatioDiv")) return; // Wait for div

//     // 🔥 FIX: Dispose old chart before creating new one
//     if (rootGlobal) {
//       rootGlobal.dispose();
//     }

//     // Create new chart root
//     rootGlobal = am5.Root.new("publicationPatentRatioDiv");

//     const root = rootGlobal;

//     // Remove logo
//     root._logo.dispose();

//     root.setThemes([am5themes_Animated.new(root)]);

//     // Chart
//     const chart = root.container.children.push(
//       am5percent.PieChart.new(root, {
//         innerRadius: am5.percent(60),
//       })
//     );

//     // Series
//     const series = chart.series.push(
//       am5percent.PieSeries.new(root, {
//         valueField: "value",
//         categoryField: "category",
//         alignLabels: false,
//       })
//     );

//     // Center label
//     // series.children.push(
//     //   am5.Label.new(root, {
//     //     centerX: am5.percent(50),
//     //     centerY: am5.percent(50),
//     //     text: "{valueSum}\nTotal",
//     //     populateText: true,
//     //     textAlign: "center",
//     //     fontSize: 20,
//     //   })
//     // );

//     // Slice styling
//     series.slices.template.setAll({
//       cornerRadius: 10,
//       tooltipText: "{category}: {value}",
//     });

//     // Set real API data
//     series.data.setAll([
//       { category: "Publications", value: ratioData.publications },
//       { category: "Patents", value: ratioData.patents },
//     ]);

//     series.appear(1000, 100);

//     return () => {
//       if (rootGlobal) rootGlobal.dispose();
//     };
//   }, [ratioData]);

//   return (
//     <div
//       id="publicationPatentRatioDiv"
//       style={{
//         width: "100%",
//         height: "480px",
//         background: "transparent",
//       }}
//     ></div>
//   );
// };

// export default PublicationPatentRatio;


import React, { useLayoutEffect, useEffect, useState } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

let rootGlobal = null; // Prevent duplicate chart roots

const PublicationPatentRatio = () => {
  const [ratioData, setRatioData] = useState(null);

  // Fetch API
  useEffect(() => {
    const fetchRatio = async () => {
      try {
        const res = await fetch(
          "https://development.stieahub.in/Codigniter_api/public/get_publication_patent_ratio"
        );
        const data = await res.json();

        if (data?.length > 0) {
          setRatioData({
            publications: Number(data[0].total_publications),
            patents: Number(data[0].total_patents),
          });
        }
      } catch (error) {
        console.error("API error:", error);
      }
    };

    fetchRatio();
  }, []);

  // Render chart
  useLayoutEffect(() => {
    if (!ratioData) return;
    const container = document.getElementById("publicationPatentRatioDiv");
    if (!container) return;

    if (rootGlobal) rootGlobal.dispose();

    const root = am5.Root.new("publicationPatentRatioDiv");
    rootGlobal = root;

    // Remove amCharts logo
    root._logo.dispose();

    root.setThemes([am5themes_Animated.new(root)]);

    const chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        innerRadius: am5.percent(60),
      })
    );

    const series = chart.series.push(
      am5percent.PieSeries.new(root, {
        valueField: "value",
        categoryField: "category",
        alignLabels: false,
      })
    );

    series.slices.template.setAll({
      cornerRadius: 10,
      tooltipText: "{category}: {value}",
    });

    series.data.setAll([
      { category: "Publications", value: ratioData.publications },
      { category: "Patents", value: ratioData.patents },
    ]);

    series.appear(1000, 100);

    return () => root.dispose();
  }, [ratioData]);

  return (
    <div
      id="publicationPatentRatioDiv"
      style={{
        width: "100%",
        height: "100%",   // 🔥 FULLY responsive height
        background: "transparent",
      }}
    ></div>
  );
};

export default PublicationPatentRatio;

