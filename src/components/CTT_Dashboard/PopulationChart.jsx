import React, { useState, useEffect, useRef } from 'react';

// The plugin is wrapped in a function so it can be called after Highcharts is loaded.
const applyHighchartsPlugin = (H) => {
    // Animated dataLabels functionality plugin for Highcharts
    (function (H) {
        const FLOAT = /^-?\d+\.?\d*$/;

        H.Fx.prototype.textSetter = function () {
            const chart = H.charts[this.elem.renderer.chartIndex];
            let thousandsSep = chart?.numberFormatter('1000.0')[1];

            if (/[0-9]/.test(thousandsSep)) {
                thousandsSep = ' ';
            }

            const replaceRegEx = new RegExp(thousandsSep, 'g');
            let startValue = this?.start?.replace(replaceRegEx, '');
            let endValue = this?.end?.replace(replaceRegEx, '');
            let currentValue = this?.end?.replace(replaceRegEx, '');

            if ((startValue || '').match(FLOAT)) {
                startValue = parseInt(startValue, 10);
                endValue = parseInt(endValue, 10);
                currentValue = chart.numberFormatter(
                    Math.round(startValue + (endValue - startValue) * this.pos),
                    0
                );
            }

            this.elem.endText = this?.end;
            this.elem.attr(this?.prop, currentValue, null, true);
        };

        H.SVGElement.prototype.textGetter = function () {
            const ct = this?.text?.element?.textContent || '';
            return this?.endText ? this?.endText : ct.substring(0, ct?.length / 2);
        };

        H.wrap(H.Series.prototype, 'drawDataLabels', function (proceed) {
            const attr = H?.SVGElement?.prototype?.attr;
            const chart = this?.chart;

            if (chart.sequenceTimer) {
                this.points.forEach(point =>
                    (point.dataLabels || []).forEach(
                        label =>
                            (label.attr = function (hash) {
                                if (
                                    hash &&
                                    hash.text !== undefined &&
                                    chart.isResizing === 0
                                ) {
                                    const text = hash.text;
                                    delete hash.text;
                                    return this.attr(hash).animate({ text });
                                }
                                return attr.apply(this, arguments);
                            })
                    )
                );
            }

            const ret = proceed.apply(
                this,
                Array.prototype.slice.call(arguments, 1)
            );

            this.points.forEach(p =>
                (p.dataLabels || []).forEach(d => (d.attr = attr))
            );

            return ret;
        });
    }(H));
};


// Dataset from Publications - 2015-2024.csv
const dataset = {
    "USA": { "2015": 384, "2016": 500, "2017": 680, "2018": 949, "2019": 1032, "2020": 1263, "2021": 1499, "2022": 1709, "2023": 1788, "2024": 743 },
    "CHINA": { "2015": 232, "2016": 320, "2017": 502, "2018": 810, "2019": 1226, "2020": 1858, "2021": 2599, "2022": 3299, "2023": 3848, "2024": 1642 },
    "UNITED KINGDOM": { "2015": 97, "2016": 138, "2017": 178, "2018": 249, "2019": 313, "2020": 411, "2021": 529, "2022": 612, "2023": 622, "2024": 260 },
    "GERMANY": { "2015": 93, "2016": 128, "2017": 156, "2018": 218, "2019": 247, "2020": 272, "2021": 323, "2022": 387, "2023": 401, "2024": 154 },
    "ENGLAND": { "2015": 81, "2016": 127, "2017": 157, "2018": 224, "2019": 274, "2020": 350, "2021": 457, "2022": 529, "2023": 542, "2024": 229 },
    "SPAIN": { "2015": 80, "2016": 108, "2017": 131, "2018": 171, "2019": 204, "2020": 248, "2021": 290, "2022": 341, "2023": 359, "2024": 144 },
    "SOUTH KOREA": { "2015": 71, "2016": 105, "2017": 147, "2018": 243, "2019": 305, "2020": 365, "2021": 455, "2022": 529, "2023": 515, "2024": 213 },
    "AUSTRALIA": { "2015": 69, "2016": 103, "2017": 131, "2018": 185, "2019": 221, "2020": 290, "2021": 383, "2022": 444, "2023": 464, "2024": 188 },
    "FRANCE": { "2015": 65, "2016": 114, "2017": 120, "2018": 152, "2019": 175, "2020": 191, "2021": 237, "2022": 269, "2023": 284, "2024": 102 },
    "ITALY": { "2015": 64, "2016": 94, "2017": 118, "2018": 169, "2019": 204, "2020": 279, "2021": 340, "2022": 393, "2023": 371, "2024": 138 },
    "CANADA": { "2015": 62, "2016": 70, "2017": 104, "2018": 156, "2019": 192, "2020": 277, "2021": 364, "2022": 401, "2023": 392, "2024": 155 },
    "JAPAN": { "2015": 51, "2016": 91, "2017": 113, "2018": 128, "2019": 149, "2020": 160, "2021": 239, "2022": 245, "2023": 240, "2024": 89 },
    "INDIA": { "2015": 42, "2016": 53, "2017": 98, "2018": 151, "2019": 214, "2020": 244, "2021": 335, "2022": 454, "2023": 560, "2024": 225 },
    "SWITZERLAND": { "2015": 37, "2016": 48, "2017": 67, "2018": 78, "2019": 100, "2020": 119, "2021": 118, "2022": 154, "2023": 171, "2024": 74 },
    "NETHERLANDS": { "2015": 30, "2016": 51, "2017": 68, "2018": 94, "2019": 100, "2020": 130, "2021": 157, "2022": 184, "2023": 196, "2024": 77 }
};

const startYear = 2015;
const endYear = 2024;
const nbr = 15;

const PopulationChart = () => {
    const [Highcharts, setHighcharts] = useState(null);
    const [year, setYear] = useState(startYear);
    const [isPlaying, setIsPlaying] = useState(false);
    const chartContainerRef = useRef(null);
    const chartInstanceRef = useRef(null);
    const intervalRef = useRef(null);

    useEffect(() => {
        import('https://esm.sh/highcharts').then(HighchartsModule => {
            const H = HighchartsModule.default;
            applyHighchartsPlugin(H);
            setHighcharts(H);
        }).catch(error => {
            console.error("Failed to load Highcharts", error);
        });
    }, []);

    const getData = (currentYear) => {
        const output = Object.entries(dataset)
            .map(([countryName, countryData]) => {
                return [countryName, Number(countryData[currentYear] || 0)];
            })
            .sort((a, b) => b[1] - a[1]);
        return output.slice(0, nbr);
    };

    const getSubtitle = (currentYear) => {
        const yearData = Object.values(dataset)?.map(countryData => countryData[currentYear] || 0);
        const totalPublications = yearData?.reduce((sum, count) => sum + count, 0);
        return `<span style="font-size: 80px">${currentYear}</span>
            <br>
            <span style="font-size: 22px">
                Total: <b>${totalPublications?.toLocaleString()}</b> publications
            </span>`;
    };

    const updateState = (newYear) => {
       if (isPlaying) {
            pause();
        }
        setYear(newYear);
    };

    const pause = () => {
        setIsPlaying(false);
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        if(chartInstanceRef.current){
             chartInstanceRef.current.sequenceTimer = undefined;
        }
    };

    const play = () => {
        setIsPlaying(true);
        intervalRef.current = setInterval(() => {
            setYear(prevYear => {
                const newYear = prevYear + 1;
                if (newYear > endYear) { // Use > to stop at the end year
                    pause();
                    return endYear;
                }
                return newYear;
            });
        }, 1500); // Changed interval to 2000ms for slower animation
    };

    useEffect(() => {
        if (chartInstanceRef.current) {
             chartInstanceRef.current.sequenceTimer = intervalRef.current;
        }
    }, [isPlaying]);

    useEffect(() => {
       if (Highcharts && chartContainerRef.current) {
            if (!chartInstanceRef.current) {
                // Create chart
                chartInstanceRef.current = Highcharts.chart(chartContainerRef.current, {
                     chart: { animation: { duration: 500 }, marginRight: 50 },
                    title: { text: 'Publications per Country by Year', align: 'left' },
                    subtitle: { useHTML: true, text: getSubtitle(year), floating: true, align: 'right', verticalAlign: 'bottom', y: -80, x: -100 },
                    legend: { enabled: false },
                    xAxis: { type: 'category' },
                    yAxis: { opposite: true, tickPixelInterval: 150, title: { text: 'Number of Publications' } },
                    plotOptions: {
                        series: {
                            animation: false, groupPadding: 0, pointPadding: 0.1, borderWidth: 0, colorByPoint: true,
                            dataSorting: { enabled: true, matchByName: true },
                            type: 'bar',
                            dataLabels: { enabled: true }
                        }
                    },
                    series: [{ type: 'bar', name: year, data: getData(year) }],
                    responsive: {
                        rules: [{
                            condition: { maxWidth: 550 },
                            chartOptions: {
                                xAxis: { visible: false },
                                subtitle: { x: 0 },
                                plotOptions: { series: { dataLabels: [{ enabled: true, y: 8 }, { enabled: true, format: '{point.name}', y: -8, style: { fontWeight: 'normal', opacity: 0.7 } }] } }
                            }
                        }]
                    }
                });
            } else {
                // Update chart
                chartInstanceRef.current.update({ subtitle: { text: getSubtitle(year) } }, false, false, false);
                chartInstanceRef.current.series[0].update({ name: year, data: getData(year) });
            }
        }
    }, [year, Highcharts]);


    useEffect(() => {
        return () => {
            pause(); // Cleanup on unmount
            // if (chartInstanceRef.current) {
            //     chartInstanceRef.current?.destroy();
            //     chartInstanceRef.current = null;
            // }
        };
    }, []);

    const handlePlayPauseClick = () => {
        if (isPlaying) {
            pause();
        } else {
            if (year === endYear) {
                setYear(startYear); // Reset to start if at the end
            }
            play();
        }
    };
    
    if (!Highcharts) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-100">
                <div className="text-xl font-semibold text-gray-700">Loading Chart...</div>
            </div>
        );
    }

    return (
        <div className="bg-gray-100 md:p-8 font-sans">
            <div className=" bg-white rounded-xl shadow-lg" style={{marginTop:"10px"}}>
                <div ref={chartContainerRef} />
                <div className="flex items-center justify-center mt-6 space-x-4">
                    <button
                        id="play-pause-button"
                        onClick={handlePlayPauseClick}
                        className="text-2xl text-gray-600 hover:text-blue-600 transition-colors duration-300 w-12 h-12 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        title={isPlaying ? 'Pause' : 'Play'}
                    >
                       {isPlaying ? '❚❚' : '▶'}
                    </button>
                    <input
                        id="play-range"
                        type="range"
                        value={year}
                        min={startYear}
                        max={endYear}
                        onChange={(e) => updateState(parseInt(e.target.value, 10))}
                        className="w-full max-w-lg h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="font-semibold text-gray-700 text-lg w-16 text-center">{year}</span>
                </div>
            </div>
        </div>
    );
};

export default PopulationChart;