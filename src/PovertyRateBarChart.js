import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label, Cell
} from 'recharts';

// Utility to parse "18.30%" to 18.3
const parseRate = (rateStr) => parseFloat(rateStr.replace('%', ''));

const boroughMap = {
  BX: "Bronx",
  BK: "Brooklyn",
  MN: "Manhattan",
  QN: "Queens",
  SI: "Staten Island"
};

const colorByBoro = (geo) => {
  if (geo.startsWith('BX')) return "#e74c3c";     // Bronx - red
  if (geo.startsWith('BK')) return "#2980b9";     // Brooklyn - blue
  if (geo.startsWith('MN')) return "#27ae60";     // Manhattan - green
  if (geo.startsWith('QN')) return "#f1c40f";     // Queens - yellow
  if (geo.startsWith('SI')) return "#8e44ad";     // Staten Island - purple
  return "#7f8c8d"; // default
};


const PovertyRateBarChart = () => {
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetch('/data/poverty_rate_data.csv')
      .then(res => res.text())
      .then(csvText => {
        const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true });
        const cleaned = parsed.data.map(row => ({
          ...row,
          poverty_rate: parseRate(row.poverty_rate)
        }));
        cleaned.sort((a, b) => b.poverty_rate - a.poverty_rate);
        setData(cleaned);
      });
  }, []);

  return (
    <div style={{ width: '100%', maxWidth: 1200, margin: '10 auto', padding: 24 }}>
      <h2>NYC Poverty Rates by Geography (2022)</h2>
      <ResponsiveContainer width="100%" height={600}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 20, right: 40, left: 120, bottom: 40 }}
          barSize={18}
          onClick={(e) => setSelected(e && e.activeLabel)}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            type="number"
            domain={[0, 50]}
            tickFormatter={v => `${v}%`}
          >
            <Label value="Poverty Rate (%)" offset={-4} position="insideBottom" />
          </XAxis>
          <YAxis
            dataKey="Name"
            type="category"
            width={180}
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            formatter={(val, name, props) => [`${val}%`, "Poverty Rate"]}
            labelFormatter={(label) => {
              const item = data.find(d => d.Name === label);
              if (!item) return label;
              const boroCode = item.Geography.split(" ")[0]; // get first part like "BX"
              const boroName = boroughMap[boroCode] || item.Geography;
              return `${item.Name} (${boroName} - ${item.Level})`;
            }}
            
          />

          <Legend />
          <Bar
            dataKey="poverty_rate"
            name="Poverty Rate"
            isAnimationActive={false}
            label={{ position: 'right', formatter: v => `${v}%` }}
            fill="#8884d8"
          >
            {data.map((entry, idx) => (
              <Cell
                key={idx}
                fill={colorByBoro(entry.Geography)}
                opacity={selected === entry.Name ? 1 : 0.85}
                stroke={selected === entry.Name ? "#222" : undefined}
                strokeWidth={selected === entry.Name ? 3 : 0}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div style={{ marginTop: 16, minHeight: 40 }}>
        {selected && (
          <div>
            <strong>{selected}</strong> poverty rate:{" "}
            <span style={{ color: "#e74c3c" }}>
              {data.find(d => d.Name === selected)?.poverty_rate}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PovertyRateBarChart;
