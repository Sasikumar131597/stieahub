import React, { useState, useEffect } from "react";
 import Slider from "@mui/material/Slider";
 import Chart from "react-apexcharts";

 const CountryGerdabsvalue = ({ initialData, initialYearRange }) => {
     const [year, setYear] = useState(initialYearRange[0] || null);
     const [data, setData] = useState(initialData || {});
     const [yearRange, setYearRange] = useState(initialYearRange || [2016, 2022]);

     useEffect(() => {
         setData(initialData);
         setYear(initialYearRange[0]);
         setYearRange(initialYearRange);
     }, [initialData, initialYearRange]);

     const chartData = {
         series: [
             {
                 name: "GERD Absolute Value (in USD millions)",
                 data: data[year]?.map(d => ({
                     x: d?.country,
                     y: d?.value
                 })) || []
             }
         ],
         options: {
             chart: {
                 type: "bar",
                 toolbar: {
                     show: true,
                     tools: {
                         download: true,
                         selection: true,
                         zoom: true,
                         zoomin: true,
                         zoomout: true,
                         pan: true,
                         reset: true
                     }
                 }
             },
             plotOptions: {
                 bar: {
                     dataLabels: {
                         position: "top",  // Show values on top of bars
                     }
                 }
             },
             dataLabels: {
                 enabled: true,
                 formatter: (val) => val?.toLocaleString(),  // Format as number with commas
                 offsetY: -20,
                 style: {
                     fontSize: "12px",
                     colors: ["#304758"]
                 }
             },
             tooltip: {
                 enabled: false  // Disable tooltip
             },
             xaxis: {
                 categories: data[year]?.map(d => d?.country) || [],
                 labels: {
                     rotate: -45,
                     style: { fontSize: "12px" }
                 }
             },
             yaxis: {
                 title: {
                     text: "GERD Absolute Value (in USD billions PPP)"
                 }
             }
         }
     };

     const handleYearChange = (event, newValue) => {
         setYear(newValue);
     };

     return (
         <div style={{ textAlign: "center", padding: "20px", margin: "auto", width: "100%" }}>

             <h2 style={{ marginBottom: "10px", fontSize: "18px", fontWeight: "bold" }}>
                 GERD Absolute Value - {year}</h2>
             <Chart options={chartData?.options} series={chartData?.series} type="bar" height={400} />

             <div style={{ marginTop: '20px', padding: '0 10px' }}>
                 <Slider
                     min={yearRange[0]}
                     max={yearRange[1]}
                     value={year}
                     onChange={handleYearChange}
                     step={1}
                     marks={yearRange?.map(y => ({ value: y, label: y?.toString() }))}
                     valueLabelDisplay="off"
                 />
             </div>
         </div>
     );
 };

 export default CountryGerdabsvalue;