import React from 'react';
import { ResponsiveSankey } from '@nivo/sankey';

const GenderIncomeSankey = () => {
  // Data preparation for Sankey diagram
  const data = {
    nodes: [
      // Gender nodes
      { id: 'Males', color: '#4682B4' },
      { id: 'Females', color: '#FA8072' },
      
      // Income bracket nodes
      { id: '< $15k', color: '#e8c1a0' },
      { id: '$15k-$30k', color: '#f1e15b' },
      { id: '$30k-$60k', color: '#61cdbb' },
      { id: '$60k-$100k', color: '#97e3d5' },
      { id: '> $100k', color: '#e8a838' }
    ],
    links: [
      // Males to income brackets
      { source: 'Males', target: '< $15k', value: 537963 },
      { source: 'Males', target: '$15k-$30k', value: 454728 },
      { source: 'Males', target: '$30k-$60k', value: 787407 },
      { source: 'Males', target: '$60k-$100k', value: 436779 },
      { source: 'Males', target: '> $100k', value: 658720 },
      
      // Females to income brackets
      { source: 'Females', target: '< $15k', value: 792120 },
      { source: 'Females', target: '$15k-$30k', value: 572618 },
      { source: 'Females', target: '$30k-$60k', value: 787958 },
      { source: 'Females', target: '$60k-$100k', value: 422017 },
      { source: 'Females', target: '> $100k', value: 506517 }
    ]
  };

  return (
    <div style={{ height: 800, width: '100%' }}>
      <h2>NYC Income Distribution by Gender</h2>
      <p style={{ fontSize: '14px', color: '#555', marginBottom: '16px' }}>
        This Sankey diagram visualizes the distribution of income by gender in New York City, showing how income is spread across different brackets for males and females. The thickness of the links represents the number of people in each income category, and the color of the nodes distinguishes between genders and income brackets. Data from 2023.
      </p>
      
      <ResponsiveSankey
        data={data}
        margin={{ top: 40, right: 160, bottom: 40, left: 50 }}
        align="justify"
        colors={{ scheme: 'category10' }}
        nodeOpacity={1}
        nodeHoverOpacity={1}
        nodeThickness={18}
        nodeSpacing={24}
        nodeBorderWidth={0}
        nodeBorderRadius={3}
        linkOpacity={0.5}
        linkHoverOpacity={0.8}
        linkContract={3}
        enableLinkGradient={true}
        labelPosition="outside"
        labelOrientation="horizontal"
        labelPadding={16}
        labelTextColor={{ from: 'color', modifiers: [['darker', 1]] }}
        animate={true}
        tooltip={({ node, link }) => {
          if (node) {
            return (
              <div style={{ background: 'white', padding: '9px 12px', border: '1px solid #ccc' }}>
                <strong>{node.id}</strong>
              </div>
            );
          }
          if (link) {
            return (
              <div style={{ background: 'white', padding: '9px 12px', border: '1px solid #ccc' }}>
                <strong>{link.source.id} → {link.target.id}</strong>: {link.value.toLocaleString()} people
              </div>
            );
          }
          return null;
        }}
            // Adjust the height and width here to make the plot smaller
    height={600}  // Change this to a smaller value
    width={1100}   // Change this to a smaller value
      />
      
      
      <div style={{ fontSize: '14px', color: '#555', marginTop: '-180px' }}>
        <p><strong>Source:</strong> New York, NY - Insights, Neilsberg. 
          <a href="https://www.neilsberg.com/insights/topic/new-york-ny/" target="_blank" style={{ color: '#1e90ff' }}>
            https://www.neilsberg.com/insights/topic/new-york-ny/
          </a>
        </p>
      </div>
    </div>
  );
};

export default GenderIncomeSankey;
