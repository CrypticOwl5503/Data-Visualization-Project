import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Bar, BarChart, ReferenceLine } from 'recharts';

// NYC indicators data with actual and predicted values
const indicators = [
  { year: 2000, population: 8008278, aged65: 11.7, foreign: 35.9, children: 34.0, diversity: 0.74, income: 69660, poverty: 21.2, unemployment: 9.6, bachelor: 27.4, nohs: 19.7, predicted: false },
  { year: 2006, population: 8214426, aged65: 12.1, foreign: 37.0, children: 32.3, diversity: 0.73, income: 67810, poverty: 19.2, unemployment: 7.8, bachelor: 32.1, nohs: 21.3, predicted: false },
  { year: 2010, population: 8184899, aged65: 12.2, foreign: 37.2, children: 31.5, diversity: 0.74, income: 65160, poverty: 20.1, unemployment: 11.2, bachelor: 33.4, nohs: 20.4, predicted: false },
  { year: 2019, population: 8336817, aged65: 15.4, foreign: 36.2, children: 27.1, diversity: 0.75, income: 80340, poverty: 16.0, unemployment: 5.1, bachelor: 39.2, nohs: 16.8, predicted: false },
  { year: 2022, population: 8335897, aged65: 16.7, foreign: 36.8, children: 25.7, diversity: 0.76, income: 77550, poverty: 18.3, unemployment: 6.4, bachelor: 41.4, nohs: 16.4, predicted: false },
  { year: 2025, population: 8405329.62, aged65: 16.83, foreign: 36.79, children: 24.87, diversity: 0.76, income: 79540.14, poverty: 16.58, unemployment: 5.53, bachelor: 43.09, nohs: 16.18, predicted: true },
  { year: 2028, population: 8447079.53, aged65: 17.54, foreign: 36.82, children: 23.72, diversity: 0.76, income: 81180.47, poverty: 16.06, unemployment: 4.98, bachelor: 44.94, nohs: 15.58, predicted: true },
  { year: 2031, population: 8488829.43, aged65: 18.25, foreign: 36.86, children: 22.56, diversity: 0.76, income: 82820.80, poverty: 15.53, unemployment: 4.43, bachelor: 46.79, nohs: 14.98, predicted: true }
];

const formatPct = v => v == null ? '-' : `${v}%`;
const formatNum = v => v == null ? '-' : v.toLocaleString();
const formatDollar = v => v == null ? '-' : `$${v.toLocaleString()}`;

const IndicatorCard = ({ label, value, icon, color, isPredicted }) => (
  <div style={{
    flex: 1,
    minWidth: 160,
    margin: 10,
    padding: 18,
    background: '#fff',
    borderRadius: 12,
    boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    border: isPredicted ? '2px dashed #ff9800' : 'none'
  }}>
    <div style={{ fontSize: 32, color, marginBottom: 8 }}>{icon}</div>
    <div style={{ fontSize: 24, fontWeight: 700 }}>{value}</div>
    <div style={{ fontSize: 15, color: '#555', marginTop: 4, textAlign: 'center' }}>{label}</div>
    {isPredicted && <div style={{ fontSize: 12, color: '#ff9800', marginTop: 5, fontStyle: 'italic' }}>Predicted</div>}
  </div>
);

const NYCIndicatorsDashboard = () => {
  const [yearIdx, setYearIdx] = useState(4); // Default to 2022 (last actual data)
  const year = indicators[yearIdx].year;
  const current = indicators[yearIdx];
  const isPredicted = current.predicted;

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: 24 }}>
      <h2 style={{ textAlign: 'center', marginBottom: 0 }}>NYC Key Indicators</h2>
      <div style={{ textAlign: 'center', marginBottom: 18 }}>
        <input
          type="range"
          min={0}
          max={indicators.length - 1}
          value={yearIdx}
          onChange={e => setYearIdx(Number(e.target.value))}
          style={{ width: 300 }}
        />
        <div style={{ marginTop: 4, fontWeight: 500 }}>
          {indicators.map((d, i) => (
            <span key={d.year} style={{
              margin: '0 12px',
              color: i === yearIdx ? (d.predicted ? '#ff9800' : '#0078d4') : '#888',
              fontWeight: i === yearIdx ? 700 : 400,
              borderBottom: d.predicted ? '2px dotted #ff9800' : 'none'
            }}>{d.year}{d.predicted ? '*' : ''}</span>
          ))}
        </div>
        {isPredicted && (
          <div style={{ color: '#ff9800', marginTop: 8, fontStyle: 'italic' }}>
            * Predicted data
          </div>
        )}
      </div>

      {/* Cards for headline stats */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        <IndicatorCard label="Population" value={formatNum(current.population)} icon="👥" color="#0078d4" isPredicted={isPredicted} />
        <IndicatorCard label="Age 65+" value={formatPct(current.aged65)} icon="👴" color="#e67e22" isPredicted={isPredicted} />
        <IndicatorCard label="Foreign-born" value={formatPct(current.foreign)} icon="🌎" color="#16a085" isPredicted={isPredicted} />
        <IndicatorCard label="Households w/ Children" value={formatPct(current.children)} icon="👶" color="#f39c12" isPredicted={isPredicted} />
        <IndicatorCard label="Median Income" value={formatDollar(current.income)} icon="💵" color="#27ae60" isPredicted={isPredicted} />
        <IndicatorCard label="Poverty Rate" value={formatPct(current.poverty)} icon="📉" color="#c0392b" isPredicted={isPredicted} />
        <IndicatorCard label="Unemployment" value={formatPct(current.unemployment)} icon="💼" color="#8e44ad" isPredicted={isPredicted} />
        <IndicatorCard label="Bachelor's+" value={formatPct(current.bachelor)} icon="🎓" color="#2980b9" isPredicted={isPredicted} />
      </div>

      {/* Population Line Chart */}
      <div style={{ margin: '40px 0', background: '#fafbfc', borderRadius: 12, padding: 20 }}>
        <h3 style={{ marginBottom: 12 }}>Population Trends</h3>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ display: 'inline-block', width: 12, height: 12, backgroundColor: '#0078d4', marginRight: 5 }}></span>
          <span style={{ marginRight: 15 }}>Historical Data</span>
          <span style={{ display: 'inline-block', width: 12, height: 12, backgroundColor: '#0078d4', marginRight: 5, border: '1px dashed #ff9800' }}></span>
          <span>Predicted Data</span>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={indicators}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip formatter={(value) => [formatNum(value), "Population"]} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="population" 
              name="Population" 
              stroke="#0078d4" 
              strokeWidth={2}
              dot={false}
              connectNulls
              strokeDasharray={(d) => d.predicted ? "5 5" : "0"}
            />
            <ReferenceLine x={2022} stroke="#ff9800" strokeDasharray="3 3" label={{ value: 'Current', position: 'insideTopRight', fill: '#ff9800' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Poverty Rate Line Chart */}
      <div style={{ margin: '40px 0', background: '#fafbfc', borderRadius: 12, padding: 20 }}>
        <h3 style={{ marginBottom: 12 }}>Poverty Rate Trends</h3>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ display: 'inline-block', width: 12, height: 12, backgroundColor: '#c0392b', marginRight: 5 }}></span>
          <span style={{ marginRight: 15 }}>Historical Data</span>
          <span style={{ display: 'inline-block', width: 12, height: 12, backgroundColor: '#c0392b', marginRight: 5, border: '1px dashed #ff9800' }}></span>
          <span>Predicted Data</span>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={indicators}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip formatter={(value) => [`${value}%`, "Poverty Rate"]} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="poverty" 
              name="Poverty Rate" 
              stroke="#c0392b" 
              strokeWidth={2}
              dot={false}
              connectNulls
              strokeDasharray={(d) => d.predicted ? "5 5" : "0"}
            />
            <ReferenceLine x={2022} stroke="#ff9800" strokeDasharray="3 3" label={{ value: 'Current', position: 'insideTopRight', fill: '#ff9800' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Income Line Chart */}
      <div style={{ margin: '40px 0', background: '#fafbfc', borderRadius: 12, padding: 20 }}>
        <h3 style={{ marginBottom: 12 }}>Median Income Trends</h3>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ display: 'inline-block', width: 12, height: 12, backgroundColor: "#27ae60", marginRight: 5 }}></span>
          <span style={{ marginRight: 15 }}>Historical Data</span>
          <span style={{ display: 'inline-block', width: 12, height: 12, backgroundColor: "#27ae60", marginRight: 5, border: '1px dashed #ff9800' }}></span>
          <span>Predicted Data</span>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={indicators}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip formatter={(value) => [formatDollar(value), "Median Income"]} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="income" 
              name="Median Income" 
              stroke="#27ae60" 
              strokeWidth={2}
              dot={false}
              connectNulls
              strokeDasharray={(d) => d.predicted ? "5 5" : "0"}
            />
            <ReferenceLine x={2022} stroke="#ff9800" strokeDasharray="3 3" label={{ value: 'Current', position: 'insideTopRight', fill: '#ff9800' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Bar chart for diversity and education */}
      <div style={{ margin: '32px 0', background: '#fafbfc', borderRadius: 12, padding: 20 }}>
        <h3 style={{ marginBottom: 12 }}>Diversity & Education</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={indicators}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" tickFormatter={(value) => `${value}${indicators.find(d => d.year === value).predicted ? '*' : ''}`} />
            <YAxis />
            <Tooltip 
              formatter={(value, name, props) => {
                const isPredicted = props.payload.predicted;
                return [
                  `${value.toFixed(2)}${isPredicted ? ' (predicted)' : ''}`, 
                  name
                ];
              }}
            />
            <Legend />
            <Bar dataKey="diversity" name="Racial Diversity Index" fill="#2980b9" fillOpacity={(data) => data.predicted ? 0.5 : 1} stroke="#2980b9" strokeWidth={(data) => data.predicted ? 2 : 0} />
            <Bar dataKey="bachelor" name="Bachelor's+" fill="#8e44ad" fillOpacity={(data) => data.predicted ? 0.5 : 1} stroke="#8e44ad" strokeWidth={(data) => data.predicted ? 2 : 0} />
            <Bar dataKey="nohs" name="No HS Diploma" fill="#e67e22" fillOpacity={(data) => data.predicted ? 0.5 : 1} stroke="#e67e22" strokeWidth={(data) => data.predicted ? 2 : 0} />
          </BarChart>
        </ResponsiveContainer>
        <div style={{ marginTop: 10, color: '#ff9800', fontStyle: 'italic' }}>* Predicted data</div>
      </div>
    </div>
  );
};

export default NYCIndicatorsDashboard;
