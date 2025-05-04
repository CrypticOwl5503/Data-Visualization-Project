import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const data = [
  { name: 'Total Consumption', value: 1248145.3 },
  { name: 'Goods', value: 353418.4 },
  { name: 'Durable Goods', value: 107141.3 },
  { name: 'Motor Vehicles', value: 31822.3 },
  { name: 'Furniture', value: 27654.4 },
  { name: 'Recreational', value: 30877.5 },
  { name: 'Nondurable', value: 246277.1 },
  { name: 'Food/Bev', value: 83729.5 },
  { name: 'Clothing', value: 34516.8 },
  { name: 'Gasoline', value: 17129.4 },
  { name: 'Services', value: 894726.9 },
  { name: 'Housing', value: 222128.9 },
  { name: 'Healthcare', value: 222002.9 },
  { name: 'Transportation', value: 44918.4 },
];

const ConsumerSpendingChart = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h2>2023 Consumer Spending (Millions USD)</h2>
      <BarChart
        width={500}
        height={600}
        data={data}
        layout="vertical"
        margin={{ left: -80, right: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          type="number" 
          tickFormatter={(value) => `$${value.toLocaleString()}`}
        />
        <YAxis 
          type="category" 
          dataKey="name" 
          width={200}
          tick={{ fontSize: 12, fontFamily: 'monospace' }}
        />
        <Tooltip 
          formatter={(value) => [`$${value.toLocaleString()}M`, 'Amount']}
        />
        <Bar 
          dataKey="value" 
          fill="#2ecc71" 
          name="Spending Amount"
        />
      </BarChart>
    </div>
  );
};

export default ConsumerSpendingChart;
