import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

// Data for per capita consumption with predicted values
const perCapitaData = [
  { date: '1/1/97', value: 1583, predicted: false },
  { date: '1/1/98', value: 1712, predicted: false },
  { date: '1/1/99', value: 1895, predicted: false },
  { date: '1/1/00', value: 2011, predicted: false },
  { date: '1/1/01', value: 2133, predicted: false },
  { date: '1/1/02', value: 2237, predicted: false },
  { date: '1/1/03', value: 2326, predicted: false },
  { date: '1/1/04', value: 2477, predicted: false },
  { date: '1/1/05', value: 2641, predicted: false },
  { date: '1/1/06', value: 2809, predicted: false },
  { date: '1/1/07', value: 2914, predicted: false },
  { date: '1/1/08', value: 2954, predicted: false },
  { date: '1/1/09', value: 2973, predicted: false },
  { date: '1/1/10', value: 3089, predicted: false },
  { date: '1/1/11', value: 3203, predicted: false },
  { date: '1/1/12', value: 3295, predicted: false },
  { date: '1/1/13', value: 3410, predicted: false },
  { date: '1/1/14', value: 3618, predicted: false },
  { date: '1/1/15', value: 3801, predicted: false },
  { date: '1/1/16', value: 3870, predicted: false },
  { date: '1/1/17', value: 4013, predicted: false },
  { date: '1/1/18', value: 4202, predicted: false },
  { date: '1/1/19', value: 4488, predicted: false },
  { date: '1/1/20', value: 4700, predicted: false },
  { date: '1/1/21', value: 4876, predicted: false },
  { date: '1/1/22', value: 5224, predicted: false },
  { date: '1/1/23', value: 5667, predicted: false },
  { date: '1/1/2024', value: 5528, predicted: true },
  { date: '1/1/2025', value: 5741, predicted: true },
  { date: '1/1/2026', value: 5959, predicted: true },
  { date: '1/1/2027', value: 6182, predicted: true },
  { date: '1/1/2028', value: 6410, predicted: true },
  { date: '1/1/2029', value: 6644, predicted: true },
  { date: '1/1/2030', value: 6882, predicted: true }
];

const PerCapitaConsumptionChart = () => {
  return (
    <div style={{ padding: '20px', background: '#fafbfc', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
      <h2 style={{ marginBottom: 20 }}>NYC Per Capita Consumption Over Time</h2>
      
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
        <span style={{ display: 'inline-block', width: 12, height: 12, backgroundColor: '#8884d8', marginRight: 5 }}></span>
        <span style={{ marginRight: 15 }}>Historical Data</span>
        <span style={{ display: 'inline-block', width: 12, height: 12, backgroundColor: '#8884d8', marginRight: 5, border: '1px dashed #ff9800' }}></span>
        <span>Predicted Data</span>
      </div>
      
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={perCapitaData}
          margin={{ top: 20, right: 30, left: 30, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: '12px' }} 
            label={{ value: 'Year', position: 'insideBottomRight' }}
            tickFormatter={(value) => {
              // Extract year from date string
              return value.includes('/') ? value.split('/')[2] : value.split('/')[0];
            }}
          />
          <YAxis 
            tickFormatter={(value) => `$${value}`} 
            label={{ value: 'Per Capita ($)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            formatter={(value, name, props) => {
              const isPredicted = props.payload.predicted;
              return [`$${value}${isPredicted ? ' (predicted)' : ''}`, 'Per Capita Consumption'];
            }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="value" 
            name="Per Capita Consumption" 
            stroke="#8884d8" 
            strokeWidth={2}
            dot={false}
            connectNulls
            strokeDasharray={(d) => d.predicted ? "5 5" : "0"}
          />
          <ReferenceLine 
            x="1/1/23" 
            stroke="#ff9800" 
            strokeDasharray="3 3" 
            label={{ value: 'Current', position: 'insideTopRight', fill: '#ff9800' }} 
          />
        </LineChart>
      </ResponsiveContainer>
      
      <div style={{ marginTop: 10, color: '#ff9800', fontStyle: 'italic', textAlign: 'right' }}>
        * Data after 2023 is predicted
      </div>
    </div>
  );
};

export default PerCapitaConsumptionChart;
