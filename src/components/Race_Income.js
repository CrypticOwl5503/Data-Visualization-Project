import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

const data = [
  { year: 2010, White: 87248, Black: 57005, Native: 55457, Asian: 74639, Hawaiian: 60456, Other: 46550, Multi: 63777, predicted: false },
  { year: 2011, White: 86837, Black: 56180, Native: 56398, Asian: 74933, Hawaiian: 59081, Other: 46120, Multi: 62936, predicted: false },
  { year: 2012, White: 85807, Black: 55486, Native: 50541, Asian: 73204, Hawaiian: 57832, Other: 45153, Multi: 62627, predicted: false },
  { year: 2013, White: 85714, Black: 55093, Native: 43174, Asian: 73208, Hawaiian: 49238, Other: 44407, Multi: 62805, predicted: false },
  { year: 2014, White: 86817, Black: 53922, Native: 45567, Asian: 72732, Hawaiian: 51171, Other: 43683, Multi: 63106, predicted: false },
  { year: 2015, White: 89120, Black: 53779, Native: 46385, Asian: 73746, Hawaiian: 49863, Other: 43130, Multi: 65278, predicted: false },
  { year: 2016, White: 91288, Black: 54255, Native: 49072, Asian: 75764, Hawaiian: 59947, Other: 43509, Multi: 66341, predicted: false },
  { year: 2017, White: 94257, Black: 54978, Native: 51048, Asian: 77706, Hawaiian: 54384, Other: 44409, Multi: 68152, predicted: false },
  { year: 2018, White: 96835, Black: 56281, Native: 51160, Asian: 78679, Hawaiian: 62820, Other: 45453, Multi: 70918, predicted: false },
  { year: 2019, White: 100152, Black: 58245, Native: 50758, Asian: 83498, Hawaiian: 75378, Other: 47472, Multi: 75313, predicted: false },
  { year: 2020, White: 103249, Black: 60376, Native: 58221, Asian: 85165, Hawaiian: 75489, Other: 50906, Multi: 74852, predicted: false },
  { year: 2021, White: 105706, Black: 59376, Native: 60371, Asian: 88746, Hawaiian: 53476, Other: 51089, Multi: 73582, predicted: false },
  { year: 2022, White: 107241, Black: 60404, Native: 62400, Asian: 87497, Hawaiian: 62258, Other: 52529, Multi: 72958, predicted: false },
  { year: 2023, White: 108555, Black: 60673, Native: 61491, Asian: 87197, Hawaiian: 56172, Other: 52727, Multi: 71942, predicted: false },
  { year: 2024, White: 114857, Black: 63926, Native: 70417, Asian: 93598, Hawaiian: 63766, Other: 57096, Multi: 75843, predicted: true },
  { year: 2025, White: 118894, Black: 65890, Native: 75710, Asian: 96799, Hawaiian: 64405, Other: 59943, Multi: 76800, predicted: true },
  { year: 2026, White: 123190, Black: 68046, Native: 81559, Asian: 100236, Hawaiian: 65048, Other: 63070, Multi: 77745, predicted: true },
  { year: 2027, White: 127744, Black: 70394, Native: 87966, Asian: 103910, Hawaiian: 65694, Other: 66477, Multi: 78679, predicted: true },
  { year: 2028, White: 132557, Black: 72934, Native: 94930, Asian: 107820, Hawaiian: 66343, Other: 70165, Multi: 79600, predicted: true },
  { year: 2029, White: 137629, Black: 75665, Native: 102452, Asian: 111966, Hawaiian: 66996, Other: 74132, Multi: 80510, predicted: true },
  { year: 2030, White: 142959, Black: 78588, Native: 110530, Asian: 116349, Hawaiian: 67652, Other: 78379, Multi: 81407, predicted: true }
];

export default function IncomeRaceLineChart() {
  // Current year is 2025 based on the date in the query
  const currentYear = 2025;
  
  return (
    <div style={{ width: '100%', padding: '20px', background: '#fafbfc', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
      <h3>NYC Median Household Income by Race (2010-2030)</h3>
      
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
        <span style={{ display: 'inline-block', width: 12, height: 12, backgroundColor: '#1f77b4', marginRight: 5 }}></span>
        <span style={{ marginRight: 15 }}>Historical Data</span>
        <span style={{ display: 'inline-block', width: 12, height: 12, backgroundColor: '#1f77b4', marginRight: 5, border: '1px dashed #ff9800' }}></span>
        <span>Predicted Data (after 2023)</span>
      </div>

      <p style={{ fontSize: '14px', color: '#555', marginBottom: '16px' }}>
        This chart visualizes the projected trends in median household income by race in NYC from 2010 to 2030, with historical data from 2010-2023 and predicted data from 2024 onwards. It uses different colors for each racial category and differentiates predicted data with dashed lines.
      </p>
      
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data} margin={{ top: 20, right: 40, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="year"
            tickFormatter={(value) => value % 2 === 0 ? value : ''}
          />
          <YAxis 
            tickFormatter={v => `$${v.toLocaleString()}`} 
            domain={['dataMin - 5000', 'dataMax + 5000']}
          />
          <Tooltip 
            formatter={(value, name, props) => {
              const isPredicted = props.payload.predicted;
              return [`$${value.toLocaleString()}${isPredicted ? ' (predicted)' : ''}`, name];
            }}
          />
          <Legend />
          
          <ReferenceLine 
            x={2023} 
            stroke="#ff9800" 
            strokeDasharray="3 3" 
            label={{ value: 'Current', position: 'insideTopRight', fill: '#ff9800' }} 
          />
          
          <Line type="monotone" dataKey="White" name="White" stroke="#1f77b4" dot={false} strokeDasharray={(d) => d.predicted ? "5 5" : "0"} />
          <Line type="monotone" dataKey="Black" name="Black" stroke="#e377c2" dot={false} strokeDasharray={(d) => d.predicted ? "5 5" : "0"} />
          <Line type="monotone" dataKey="Native" name="Native" stroke="#bcbd22" dot={false} strokeDasharray={(d) => d.predicted ? "5 5" : "0"} />
          <Line type="monotone" dataKey="Asian" name="Asian" stroke="#17becf" dot={false} strokeDasharray={(d) => d.predicted ? "5 5" : "0"} />
          <Line type="monotone" dataKey="Hawaiian" name="Hawaiian" stroke="#ff7f0e" dot={false} strokeDasharray={(d) => d.predicted ? "5 5" : "0"} />
          <Line type="monotone" dataKey="Other" name="Other" stroke="#8c564b" dot={false} strokeDasharray={(d) => d.predicted ? "5 5" : "0"} />
          <Line type="monotone" dataKey="Multi" name="Multi" stroke="#9467bd" dot={false} strokeDasharray={(d) => d.predicted ? "5 5" : "0"} />
        </LineChart>
      </ResponsiveContainer>

      <div style={{ fontSize: '14px', color: '#555', marginTop: '20px' }}>
        <p><strong>Source:</strong> New York, NY - Insights, Neilsberg. 
          <a href="https://www.neilsberg.com/insights/topic/new-york-ny/" target="_blank" style={{ color: '#1e90ff' }}>
            https://www.neilsberg.com/insights/topic/new-york-ny/
          </a>
        </p>
      </div>
    </div>
  );
}
