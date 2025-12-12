import React, { useLayoutEffect, useRef, useState, useEffect } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5wc from "@amcharts/amcharts5/wc";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

import "./css/HamletWordCloud.css"; 

const HamletWordCloud = () => {
  const chartRef = useRef(null);
  const [wordText, setWordText] = useState("");

  const WORD_LIMIT = 100;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          "https://development.stieahub.in/Codigniter_api/public/get_sub_techlogies"
        );
        const data = await res.json();

        let collectedWords = [];

        data.forEach((tech) => {
          collectedWords.push(tech.technology_name);
          tech.sub_techs.forEach((sub) => collectedWords.push(sub.sub_tech_name));
        });

        setWordText(collectedWords.slice(0, WORD_LIMIT).join(" "));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useLayoutEffect(() => {
    if (!chartRef.current || !wordText) return;

    const root = am5.Root.new(chartRef.current);

    // Remove amCharts watermark
    root._logo.dispose();

    root.setThemes([am5themes_Animated.new(root)]);

    const series = root.container.children.push(
      am5wc.WordCloud.new(root, {
        maxCount: 150,
        // minWordLength: 1,
        maxFontSize: am5.percent(25),
        text: wordText,
      })
    );

    series.labels.template.setAll({
      // paddingTop: 5,
      paddingBottom: 5,
      fontFamily: "Times New Roman", 
    });

    return () => root.dispose();
  }, [wordText]);

  return <div ref={chartRef} className="wordcloud-container" />;
};

export default HamletWordCloud;



