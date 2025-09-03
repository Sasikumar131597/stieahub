import React, { useEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import * as topojson from "topojson-client";

// Import TopoJSON file
import worldData from "./countries-topo.json";

const TopTenPublications = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const geoObjectName = Object.keys(worldData.objects)[0];
    const geojson = topojson.feature(
      worldData,
      worldData.objects[geoObjectName]
    );

    const root = am5.Root.new(chartRef.current);
    root.setThemes([am5themes_Animated.new(root)]);

    root._logo.dispose();

    // Static map (no pan, no zoom)
    const chart = root.container.children.push(
      am5map.MapChart.new(root, {
        projection: am5map.geoMercator(),
        wheelX: "none",
        wheelY: "none",
        panX: "none",
        panY: "none",
      })
    );

    const polygonSeries = chart.series.push(
      am5map.MapPolygonSeries.new(root, {
        geoJSON: geojson,
      })
    );

    polygonSeries.mapPolygons.template.setAll({
      tooltipText: "{name}",
      interactive: true,
      fill: am5.color(0x90caf9), // light blue
      stroke: am5.color(0xffffff),
    });

    polygonSeries.mapPolygons.template.states.create("hover", {
      fill: am5.color(0x64b5f6),
    });

    const pointSeries = chart.series.push(am5map.MapPointSeries.new(root, {}));
    const colorset = am5.ColorSet.new(root, {});

    pointSeries.bullets.push(() => {
      const container = am5.Container.new(root, {
        tooltipText: "{title}",
        cursorOverStyle: "pointer",
      });

      const circle = container.children.push(
        am5.Circle.new(root, {
          radius: 4,
          fill: colorset.next(),
          strokeOpacity: 0,
        })
      );

      const circle2 = container.children.push(
        am5.Circle.new(root, {
          radius: 4,
          fill: colorset.next(),
          strokeOpacity: 0,
          tooltipText: "{title}",
        })
      );

      circle.animate({
        key: "scale",
        from: 1,
        to: 5,
        duration: 600,
        easing: am5.ease.out(am5.ease.cubic),
        loops: Infinity,
      });
      circle.animate({
        key: "opacity",
        from: 1,
        to: 0.1,
        duration: 600,
        easing: am5.ease.out(am5.ease.cubic),
        loops: Infinity,
      });

      return am5.Bullet.new(root, { sprite: container });
    });

    const cities = [
      { title: "London", latitude: 51.5074, longitude: -0.1278 },
      { title: "Manchester", latitude: 53.4808, longitude: -2.2426 },
      { title: "Birmingham", latitude: 52.4862, longitude: -1.8904 },
      { title: "New Delhi", latitude: 28.6139, longitude: 77.209 },
      { title: "New York", latitude: 40.7128, longitude: -74.006 },
    ];

    cities.forEach((city) => {
      pointSeries.data.push({
        geometry: { type: "Point", coordinates: [city.longitude, city.latitude] },
        title: city.title,
      });
    });

    chart.appear(1000, 100);

    return () => {
      root.dispose();
    };
  }, []);

  return (
    <div
      ref={chartRef}
      style={{ width: "100%", height: "500px" }}
    />
  );
};

export default TopTenPublications;
