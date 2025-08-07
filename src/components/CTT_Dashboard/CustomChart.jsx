import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceDot,
  ResponsiveContainer,
} from 'recharts';

// Your data from the original code
const data = [
  { name: 'Quantum', NL: 30, FR: 50, CH: 90, IN: 150, CN: 200, US: 230 },
  { name: 'AI', FR: 50, CH: 70, IN: 120, US: 150, CN: 210 },
  { name: 'Bio Tech', FR: 50, CH: 80, IN: 130, US: 200, CN: 210 },
  { name: 'Sensors', FR: 50, CH: 70, CN: 110, IN: 120, US: 140 },
  { name: '5g', FR: 40, CH: 70, IN: 100, CN: 120, US: 140 },
  { name: 'IOT', FR: 40, CH: 70, CN: 100, IN: 110, US: 130 },
  { name: 'Materials', FR: 50, CH: 70, IN: 90, CN: 100, US: 120 },
  { name: 'Green', FR: 40, CH: 70, IN: 100, CN: 120, US: 130 },
  { name: 'Agro', FR: 50, CH: 70, IN: 100, US: 120, CN: 140 },
  { name: 'Space', FR: 50, CH: 70, IN: 100, CN: 120, US: 140 },
];

// Helper function to get flag image URL.
const getFlagUrl = (countryCode) => {
  const flags = {
    NL: 'https://development.stieahub.in/Codigniter_api/public/assets/images/CTT/countries/united-states.png',
    FR: 'https://development.stieahub.in/Codigniter_api/public/assets/images/CTT/countries/united-kingdom.png',
    CH: 'https://development.stieahub.in/Codigniter_api/public/assets/images/CTT/countries/norway.png',
    IN: 'https://development.stieahub.in/Codigniter_api/public/assets/images/CTT/countries/morocco.png',
    CN: 'https://cdn.jsdelivr.net/gh/lipis/flag-icons@6.6.6/flags/4x3/cn.svg',
    US: 'https://cdn.jsdelivr.net/gh/lipis/flag-icons@6.6.6/flags/4x3/us.svg',
  };
  return flags[countryCode];
};

// Custom shape for the flag dot
const FlagDot = (props) => {
  const { cx, cy, dataKey } = props;
  const flagUrl = getFlagUrl(dataKey);

  if (!flagUrl) return null;

  return (
    <g>
      <image
        x={cx - 10}
        y={cy - 10}
        width={20}
        height={20}
        href={flagUrl}
      />
    </g>
  );
};

// Custom Tooltip component
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    // payload[0] is for the first data series (the blue bar)
    // We need to look for the payload related to the hovered flag
    const flagPayload = payload.find(p => p.dataKey !== 'mainBar');
    
    if (flagPayload) {
      return (
        <div style={{
          backgroundColor: '#fff',
          border: '1px solid #ccc',
          padding: '10px',
          borderRadius: '5px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          fontSize: '14px',
        }}>
          <p>{`Technology: ${label}`}</p>
          <p>{`${flagPayload.dataKey}: ${flagPayload.value}`}</p>
        </div>
      );
    }
  }
  return null;
};


const CustomChart = () => {
  return (
    <div style={{ width: '100%', height: 500 }}>
      <ResponsiveContainer>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
          
          <XAxis type="number" domain={[0, 240]} />
          
          <YAxis
            type="category"
            dataKey="name"
            axisLine={false}
            tickLine={false}
          />
          
          {/* Use the built-in Tooltip component with a custom renderer */}
          <Tooltip content={<CustomTooltip />} />
          
          {/* The main blue bar */}
          <Bar dataKey="US" fill="#335999" shape={<rect x={0} y={0} width={0} height={0} />} />
          <Bar dataKey="US" fill="#335999" />
          
          {/* Render ReferenceDots for each country flag */}
          {data.flatMap((entry) =>
            Object.keys(entry).map((key) => {
              if (['name', 'US'].includes(key) || !entry[key]) return null;
              
              return (
                <ReferenceDot
                  key={`${entry.name}-${key}`}
                  y={entry.name}
                  x={entry[key]}
                  dataKey={key}
                  r={10} // Radius of the hoverable area
                  is  
                  shape={<FlagDot />}
                />
              );
            })
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomChart;