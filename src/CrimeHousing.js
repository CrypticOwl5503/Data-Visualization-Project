import React, { useState, useEffect } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ZAxis, Label } from 'recharts';
import { csv } from 'd3-fetch';

const CrimeHousingScatterPlot = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState('both'); // 'both', 'property', 'violent'

  useEffect(() => {
    const fetchData = async () => {
      try {
        const csvData = await csv('/data/crime_housing.csv');
        const processed = csvData.map(d => ({
          Geography: d.Geography,
          Name: d.Name,
          property_crime_rate: +d.property_crime_rate,
          violent_crime_rate: +d.violent_crime_rate,
          Housing_Price_2023: +d.Housing_Price_2023,
          Level: d.Level
        }));
        setData(processed.filter(d => d.Level === 'Boro' || d.Level === 'City' || d.Level === 'Community District'));
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading data:", error);
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.9)', 
          padding: '12px', 
          border: '1px solid #ddd',
          borderRadius: '6px',
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
          fontSize: '14px'
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '5px', fontSize: '16px' }}>{data.Name}</div>
          <div>Property Crime Rate: <span style={{ color: '#1E88E5', fontWeight: 'bold' }}>{data.property_crime_rate.toFixed(1)}</span></div>
          <div>Violent Crime Rate: <span style={{ color: '#E53935', fontWeight: 'bold' }}>{data.violent_crime_rate.toFixed(1)}</span></div>
          <div>Housing Price: <span style={{ color: '#43A047', fontWeight: 'bold' }}>${data.Housing_Price_2023.toLocaleString(undefined, {maximumFractionDigits: 0})}</span></div>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>Loading data...</div>;
  }

  return (
    <div style={{ 
      width: '100%', 
      maxWidth: '1000px', 
      margin: '0 auto', 
      padding: '20px',
      backgroundColor: '#f9f9f9',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.05)'
    }}>
      <h2 style={{ 
        textAlign: 'center', 
        marginBottom: '5px',
        color: '#333',
        fontSize: '24px'
      }}>
        NYC Crime Rate vs Housing Price (2023)
      </h2>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: '20px' }}>
        Explore the relationship between crime rates and housing prices across NYC boroughs
      </p>
      
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <button 
          onClick={() => setViewMode('both')}
          style={{ 
            padding: '8px 16px', 
            margin: '0 5px',
            backgroundColor: viewMode === 'both' ? '#333' : '#f0f0f0',
            color: viewMode === 'both' ? 'white' : '#333',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Both Crime Types
        </button>
        <button 
          onClick={() => setViewMode('property')}
          style={{ 
            padding: '8px 16px', 
            margin: '0 5px',
            backgroundColor: viewMode === 'property' ? '#1E88E5' : '#f0f0f0',
            color: viewMode === 'property' ? 'white' : '#333',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Property Crime
        </button>
        <button 
          onClick={() => setViewMode('violent')}
          style={{ 
            padding: '8px 16px', 
            margin: '0 5px',
            backgroundColor: viewMode === 'violent' ? '#E53935' : '#f0f0f0',
            color: viewMode === 'violent' ? 'white' : '#333',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Violent Crime
        </button>
      </div>
      
      <ResponsiveContainer width="100%" height={500}>
        <ScatterChart
          margin={{ top: 20, right: 30, bottom: 60, left: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis 
            type="number" 
            dataKey="property_crime_rate" 
            name="Property Crime Rate"
            domain={[0, 16]}
            tickCount={9}
            stroke="#666"
          >
            <Label 
              value="Crime Rate" 
              position="bottom" 
              offset={20} 
              style={{ textAnchor: 'middle', fill: '#666', fontSize: 14 }}
            />
          </XAxis>
          <YAxis 
            type="number" 
            dataKey="Housing_Price_2023" 
            name="Housing Price 2023"
            domain={[1400, 3000]}
            tickFormatter={tick => `$${tick.toLocaleString(undefined, {maximumFractionDigits: 0})}`}
            stroke="#666"
          >
            <Label 
              value="Housing Price Index (2023)" 
              angle={-90} 
              position="left" 
              offset={-45}
              style={{ textAnchor: 'middle', fill: '#666', fontSize: 14 }}
            />
          </YAxis>
          <ZAxis range={[60, 60]} />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="top" 
            height={36}
            wrapperStyle={{ paddingBottom: '10px' }}
          />
          
          {(viewMode === 'both' || viewMode === 'property') && (
            <Scatter 
              name="Property Crime Rate" 
              data={data} 
              fill="#1E88E5"
              stroke="#0D47A1"
              strokeWidth={1}
              shape="circle"
              legendType="circle"
            />
          )}
          
          {(viewMode === 'both' || viewMode === 'violent') && (
            <Scatter
              name="Violent Crime Rate"
              data={data.map(d => ({ 
                ...d, 
                property_crime_rate: d.violent_crime_rate 
              }))}
              fill="#E53935"
              stroke="#B71C1C"
              strokeWidth={1}
              shape="circle"
              legendType="circle"
            />
          )}
          
          {data.map((entry) => (
            <React.Fragment key={entry.Geography}>
              {(viewMode === 'both' || viewMode === 'property') && (
                <Scatter
                  data={[{ ...entry }]}
                  fill="none"
                  shape={(props) => {
                    const { cx, cy } = props;
                    return (
                      <text x={cx + 10} y={cy} fontSize={12} fontWeight="bold" fill="#1E88E5" textAnchor="start">
                        {entry.Geography}
                      </text>
                    );
                  }}
                  legendType="none"
                />
              )}
              
              {(viewMode === 'both' || viewMode === 'violent') && (
                <Scatter
                  data={[{ ...entry, property_crime_rate: entry.violent_crime_rate }]}
                  fill="none"
                  shape={(props) => {
                    const { cx, cy } = props;
                    return (
                      <text x={cx + 10} y={cy} fontSize={12} fontWeight="bold" fill="#E53935" textAnchor="start">
                        {entry.Geography}
                      </text>
                    );
                  }}
                  legendType="none"
                />
              )}
            </React.Fragment>
          ))}
        </ScatterChart>
      </ResponsiveContainer>
      
      <div style={{ textAlign: 'center', fontSize: '14px', color: '#666', marginTop: '20px' }}>
        Crime and housing data reflects 2023 statistics across NYC boroughs and districts. <br />
        Source: <a href="https://furmancenter.org/neighborhoods" target="_blank" rel="noopener noreferrer" style={{ color: '#1E88E5', textDecoration: 'none' }}>
          Furman Center - NYC Neighborhood Data Profiles
        </a>
      </div>
    </div>
  );
};

export default CrimeHousingScatterPlot;
