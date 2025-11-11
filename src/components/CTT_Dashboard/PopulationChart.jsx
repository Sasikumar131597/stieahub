import React, { useState, useEffect, useRef, useCallback } from 'react';
import Highcharts from 'highcharts';

// Apply Highcharts animation plugin
const applyHighchartsPlugin = (H) => {
    (function (H) {
        const FLOAT = /^-?\d+\.?\d*$/;

        H.Fx.prototype.textSetter = function () {
            const chart = H.charts[this.elem.renderer.chartIndex];
            let thousandsSep = chart?.numberFormatter('1000.0')[1];

            if (/[0-9]/.test(thousandsSep)) {
                thousandsSep = ' ';
            }

            const replaceRegEx = new RegExp(thousandsSep, 'g');
            let startValue = (this?.start || '').replace(replaceRegEx, '');
            let endValue = (this?.end || '').replace(replaceRegEx, '');
            let currentValue = (this?.end || '').replace(replaceRegEx, '');

            if ((startValue || '').match(FLOAT)) {
                startValue = parseFloat(startValue);
                endValue = parseFloat(endValue);
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
    })(H);
};



// Dataset
// const dataset = {
//     "USA": { "2015": 384, "2016": 500, "2017": 680, "2018": 949, "2019": 1032, "2020": 1263, "2021": 1499, "2022": 1709, "2023": 1788, "2024": 743 },
//     "CHINA": { "2015": 232, "2016": 320, "2017": 502, "2018": 810, "2019": 1226, "2020": 1858, "2021": 2599, "2022": 3299, "2023": 3848, "2024": 1642 },
//     "UNITED KINGDOM": { "2015": 97, "2016": 138, "2017": 178, "2018": 249, "2019": 313, "2020": 411, "2021": 529, "2022": 612, "2023": 622, "2024": 260 },
//     "GERMANY": { "2015": 93, "2016": 128, "2017": 156, "2018": 218, "2019": 247, "2020": 272, "2021": 323, "2022": 387, "2023": 401, "2024": 154 },
//     "ENGLAND": { "2015": 81, "2016": 127, "2017": 157, "2018": 224, "2019": 274, "2020": 350, "2021": 457, "2022": 529, "2023": 542, "2024": 229 },
//     "SPAIN": { "2015": 80, "2016": 108, "2017": 131, "2018": 171, "2019": 204, "2020": 248, "2021": 290, "2022": 341, "2023": 359, "2024": 144 },
//     "SOUTH KOREA": { "2015": 71, "2016": 105, "2017": 147, "2018": 243, "2019": 305, "2020": 365, "2021": 455, "2022": 529, "2023": 515, "2024": 213 },
//     "AUSTRALIA": { "2015": 69, "2016": 103, "2017": 131, "2018": 185, "2019": 221, "2020": 290, "2021": 383, "2022": 444, "2023": 464, "2024": 188 },
//     "FRANCE": { "2015": 65, "2016": 114, "2017": 120, "2018": 152, "2019": 175, "2020": 191, "2021": 237, "2022": 269, "2023": 284, "2024": 102 },
//     "ITALY": { "2015": 64, "2016": 94, "2017": 118, "2018": 169, "2019": 204, "2020": 279, "2021": 340, "2022": 393, "2023": 371, "2024": 138 },
//     "CANADA": { "2015": 62, "2016": 70, "2017": 104, "2018": 156, "2019": 192, "2020": 277, "2021": 364, "2022": 401, "2023": 392, "2024": 155 },
//     "JAPAN": { "2015": 51, "2016": 91, "2017": 113, "2018": 128, "2019": 149, "2020": 160, "2021": 239, "2022": 245, "2023": 240, "2024": 89 },
//     "INDIA": { "2015": 42, "2016": 53, "2017": 98, "2018": 151, "2019": 214, "2020": 244, "2021": 335, "2022": 454, "2023": 560, "2024": 225 },
//     "SWITZERLAND": { "2015": 37, "2016": 48, "2017": 67, "2018": 78, "2019": 100, "2020": 119, "2021": 118, "2022": 154, "2023": 171, "2024": 74 },
//     "NETHERLANDS": { "2015": 30, "2016": 51, "2017": 68, "2018": 94, "2019": 100, "2020": 130, "2021": 157, "2022": 184, "2023": 196, "2024": 77 }
// };

const dataset = {
  "USA": {
    "2003": 21479, "2004": 22720, "2005": 23062, "2006": 23677, "2007": 24078,
    "2008": 24181, "2009": 24345, "2010": 25165, "2011": 26148, "2012": 26613,
    "2013": 26847, "2014": 26547, "2015": 25934, "2016": 26234, "2017": 26145,
    "2018": 25413, "2019": 26564, "2020": 26866, "2021": 26934, "2022": 24117, "2023": 21596
  },
  "JAPAN": {
    "2003": 6738, "2004": 6927, "2005": 6855, "2006": 6618, "2007": 6615,
    "2008": 6651, "2009": 6519, "2010": 6409, "2011": 6412, "2012": 6463,
    "2013": 6341, "2014": 5925, "2015": 5915, "2016": 5667, "2017": 5755,
    "2018": 5585, "2019": 5537, "2020": 5972, "2021": 6019, "2022": 5520, "2023": 4752
  },
  "GERMANY": {
    "2003": 4559, "2004": 4905, "2005": 4990, "2006": 5142, "2007": 5342,
    "2008": 5354, "2009": 5380, "2010": 5814, "2011": 5844, "2012": 6176,
    "2013": 6100, "2014": 6224, "2015": 6142, "2016": 6330, "2017": 6251,
    "2018": 6065, "2019": 6667, "2020": 6727, "2021": 7188, "2022": 6280, "2023": 5591
  },
  "UNITED KINGDOM": {
    "2003": 4058, "2004": 4300, "2005": 4385, "2006": 4343, "2007": 4565,
    "2008": 4710, "2009": 4771, "2010": 5067, "2011": 5189, "2012": 5306,
    "2013": 5337, "2014": 5247, "2015": 5353, "2016": 5700, "2017": 5705,
    "2018": 5635, "2019": 5853, "2020": 5964, "2021": 6310, "2022": 5443, "2023": 4827
  },
  "ENGLAND": {
    "2003": 3398, "2004": 3555, "2005": 3653, "2006": 3650, "2007": 3795,
    "2008": 3987, "2009": 4039, "2010": 4286, "2011": 4345, "2012": 4464,
    "2013": 4524, "2014": 4411, "2015": 4579, "2016": 4861, "2017": 4877,
    "2018": 4876, "2019": 5039, "2020": 5084, "2021": 5441, "2022": 4673, "2023": 4155
  },
  "FRANCE": {
    "2003": 3176, "2004": 3134, "2005": 3213, "2006": 3149, "2007": 3267,
    "2008": 3474, "2009": 3462, "2010": 3558, "2011": 3668, "2012": 3723,
    "2013": 3704, "2014": 3839, "2015": 3752, "2016": 3731, "2017": 3720,
    "2018": 3520, "2019": 3745, "2020": 3862, "2021": 3907, "2022": 3498, "2023": null
  },
  "CANADA": {
    "2003": 2409, "2004": 2479, "2005": 2707, "2006": 2868, "2007": 3048,
    "2008": 3101, "2009": 3110, "2010": 3268, "2011": 3388, "2012": 3569,
    "2013": 3628, "2014": 3564, "2015": 3510, "2016": 3521, "2017": 3512,
    "2018": 3410, "2019": 3783, "2020": null, "2021": null, "2022": 3498, "2023": 3169
  },
  "ITALY": {
    "2003": 1940, "2004": 2079, "2005": 2213, "2006": 2385, "2007": 2641,
    "2008": 2740, "2009": 2920, "2010": 2998, "2011": 3198, "2012": 3338,
    "2013": 3447, "2014": 3515, "2015": 3496, "2016": 3451, "2017": 3532,
    "2018": 3443, "2019": 3848, "2020": 4243, "2021": 4476, "2022": 3899, "2023": 3632
  },
  "CHINA": {
    "2003": 1686, "2004": 2107, "2005": 2789, "2006": 3581, "2007": 4507,
    "2008": 5422, "2009": 7019, "2010": 8190, "2011": 10098, "2012": 12949,
    "2013": 15241, "2014": 17935, "2015": 21003, "2016": 23253, "2017": 25361,
    "2018": 28435, "2019": 35032, "2020": 39531, "2021": 44511, "2022": 50862, "2023": 45724
  },
  "SOUTH KOREA": {
    "2004": 1495, "2005": 1638, "2006": 1839, "2007": 1988, "2008": 2263,
    "2009": 2460, "2010": 2747, "2011": 2960, "2012": 3273, "2013": 3280,
    "2014": 3433, "2015": 3543, "2016": 3462, "2017": 3543, "2018": 3300,
    "2019": 3649, "2020": 3863, "2021": 4033, "2022": 3633, "2023": 3360
  },
  "INDIA": {
    "2020": 3830, "2021": 4529, "2022": 4706, "2023": 4415
  },
  "SPAIN": {
    "2003": 1326
  }
};

const startYear = 2003;
const endYear = 2023;
const nbr = 15;

const PopulationChart = () => {
    const [year, setYear] = useState(startYear);
    const [isPlaying, setIsPlaying] = useState(false);
    const chartContainerRef = useRef(null);
    const chartInstanceRef = useRef(null);
    const intervalRef = useRef(null);

    useEffect(() => {
        applyHighchartsPlugin(Highcharts);
    }, []);

    const getData = useCallback((currentYear) => {
        return Object.entries(dataset)
            .map(([country, data]) => [country, Number(data[currentYear] || 0)])
            .sort((a, b) => b[1] - a[1])
            .slice(0, nbr);
    }, []);

    const getSubtitle = useCallback((currentYear) => {
        return `<span style="font-size: 80px">${currentYear}</span>`;
    }, []);

    const pause = useCallback(() => {
        setIsPlaying(false);
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        if (chartInstanceRef.current) {
            chartInstanceRef.current.sequenceTimer = undefined;
        }
    }, []);

    const play = useCallback(() => {
        setIsPlaying(true);
        clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
            setYear(prev => {
                const next = prev + 1;
                if (next > endYear) {
                    pause();
                    return endYear;
                }
                return next;
            });
        }, 1500);
    }, [pause]);

    useEffect(() => {
        if (chartInstanceRef.current) {
            chartInstanceRef.current.sequenceTimer = intervalRef.current;
        }
    }, [isPlaying]);

    useEffect(() => {
        if (chartContainerRef.current) {
            if (!chartInstanceRef.current) {
                chartInstanceRef.current = Highcharts.chart(chartContainerRef.current, {
                    chart: {
                        animation: { duration: 500 },
                        marginRight: 50,
                        type: 'bar',
                    },
                    title: { text: 'Publications per Country by Year', align: 'left' },
                    subtitle: { useHTML: true, text: getSubtitle(year), floating: true, align: 'right', verticalAlign: 'bottom', y: -80, x: -100 },
                    legend: { enabled: false },
                    credits: { enabled: false },
                    xAxis: { type: 'category' },
                    yAxis: { opposite: true, tickPixelInterval: 150, title: { text: 'Publications Count' } },
                    plotOptions: {
                        series: {
                            animation: false,
                            groupPadding: 0,
                            pointPadding: 0.1,
                            borderWidth: 0,
                            colorByPoint: true,
                            dataSorting: { enabled: true, matchByName: true },
                            type: 'bar',
                            dataLabels: { enabled: true }
                        }
                    },
                    series: [{ name: year.toString(), data: getData(year) }],
                    responsive: {
                        rules: [{
                            condition: { maxWidth: 550 },
                            chartOptions: {
                                xAxis: { visible: false },
                                subtitle: { x: 0 },
                                plotOptions: {
                                    series: {
                                        dataLabels: [
                                            { enabled: true, y: 8 },
                                            { enabled: true, format: '{point.name}', y: -8, style: { fontWeight: 'normal', opacity: 0.7 } }
                                        ]
                                    }
                                }
                            }
                        }]
                    }
                });
            } else {
                chartInstanceRef.current.update({ subtitle: { text: getSubtitle(year) } }, false, false, false);
                chartInstanceRef.current.series[0].update({ name: year.toString(), data: getData(year) });
            }
        }
    }, [year, getData, getSubtitle]);

    useEffect(() => {
        return () => pause();
    }, [pause]);

    const handlePlayPauseClick = () => {
        if (isPlaying) {
            pause();
        } else {
            if (year === endYear) {
                setYear(startYear);
            }
            play();
        }
    };

    return (
        <div className="bg-gray-100 md:p-8 font-sans">
            <div className="bg-white rounded-xl shadow-lg mt-4">
                <div ref={chartContainerRef} className="h-96 w-full" /> {/* Added height and width for chart */}

                {/* --- Graph Analysis Section --- */}
                <div className="p-6 pt-0 text-gray-700" style={{padding:"10px"}}>
                    <p className="leading-relaxed">There has been a steady rise in the UAV publications for China between the years of 2015 to 2024, and they have overtaken United States for the number of publications per year since the year 2019. India has shown improvement in rankings from 13th in 2015, to 5th in 2024, but in terms of number of publications, the country lags well behind the likes of China and United States.</p>
                </div>
                {/* --- End Graph Analysis Section --- */}

                <div className="flex items-center justify-center mt-6 space-x-4 px-4 pb-4">
                    <button
                        onClick={handlePlayPauseClick}
                        className="text-2xl text-gray-600 hover:text-blue-600 w-12 h-12 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        title={isPlaying ? 'Pause' : 'Play'}
                    >
                        {isPlaying ? '❚❚' : '▶'}
                    </button>
                    <input
                        type="range"
                        value={year}
                        min={startYear}
                        max={endYear}
                        onChange={(e) => {
                            pause();
                            setYear(Number(e.target.value));
                        }}
                        className="w-full max-w-lg h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="font-semibold text-gray-700 text-lg w-16 text-center">{year}</span>
                </div>
            </div>
        </div>
    );
};

export default PopulationChart;
