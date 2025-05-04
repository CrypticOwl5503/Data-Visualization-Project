import React from "react";
import ConsumerSpendingChart from "./NewYorkConsumerSpending"; // Bar Chart
import PerCapitaConsumptionChart from "./PerCapitaConsumptionChart"; // Line Chart

const Dashboard = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h2>Consumer Spending Dashboard</h2>

      {/* Flex container for charts */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
        }}
      >
        {/* Bar Chart */}
        <div style={{ flex: "1 1 48%", margin: "10px" }}>
          <ConsumerSpendingChart />
        </div>

        {/* Line Chart */}
        <div style={{ flex: "1 1 48%", margin: "10px" }}>
          <PerCapitaConsumptionChart />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
