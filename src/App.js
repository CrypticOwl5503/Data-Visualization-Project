import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Layout, Menu, Typography, Card, Row, Col } from 'antd';
import {
  HomeOutlined,
  TeamOutlined,
  DollarOutlined,
  SafetyOutlined,
  BarChartOutlined,
  LineChartOutlined
} from '@ant-design/icons';

// Import all your components
import NewYorkPopulationGender from './NewYorkPopulationGender';
import NewYorkPopulationRace from './NewYorkPopulationRace';
import NewYorkIncome from './NewYorkIncome';
import NewYorkTransport from './NewYorkTransport';
import NewYorkHousing from './NewYorkHousing';
import PovertyRateBarChart from './PovertyRateBarChart';
import CrimeRateMap from './NewYorkCrimeRate';
import NYCIndicatorsDashboard from './NYCIndicatorsDashboard';
import GenderIncomeSankey from './Gender_Income_Sankey';
import IncomeRaceLineChart from './Race_Income';
import CrimeHousingScatterPlot from './CrimeHousing';
import ConsumerSpendingChart from "./NewYorkConsumerSpending"; 
import PerCapitaConsumptionChart from "./PerCapitaConsumptionChart"; 

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;
const { Title } = Typography;

// Home page with dashboard overview
const HomePage = () => (
  <div style={{ padding: '24px' }}>
    <Title level={2}>NYC Data Dashboard</Title>
    <Row gutter={[16, 16]}>
      <Col xs={24} lg={12}>
        <Card title="Key Indicators" bordered={false} style={{ height: '400px', overflow: 'auto' }}>
          <NYCIndicatorsDashboard />
        </Card>
      </Col>
      <Col xs={24} lg={12}>
        <Card title="Housing Prices" bordered={false} style={{ height: '400px', overflow: 'auto' }}>
          <NewYorkHousing />
        </Card>
      </Col>
      <Col xs={24} md={8}>
        <Card title="Population Demographics" bordered={false} style={{ height: '300px', overflow: 'auto' }}>
          <Link to="/demographics/population-gender">Population by Gender</Link><br />
          <Link to="/demographics/population-race">Population by Race</Link>
        </Card>
      </Col>
      <Col xs={24} md={8}>
        <Card title="Economic Indicators" bordered={false} style={{ height: '300px', overflow: 'auto' }}>
          <Link to="/economics/income">Income Distribution</Link><br />
          <Link to="/economics/poverty">Poverty Rates</Link><br />
          <Link to="/economics/spending">Consumer Spending</Link>
        </Card>
      </Col>
      <Col xs={24} md={8}>
        <Card title="Urban Metrics" bordered={false} style={{ height: '300px', overflow: 'auto' }}>
          <Link to="/urban/crime">Crime Statistics</Link><br />
          <Link to="/urban/transport">Transportation</Link>
        </Card>
      </Col>
    </Row>
  </div>
);

// Demographics page
const DemographicsPage = () => (
  <div style={{ padding: '24px' }}>
    <Title level={2}>NYC Demographics</Title>
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Card title="Population by Gender" bordered={false}>
          <NewYorkPopulationGender />
        </Card>
      </Col>
      <Col span={24}>
        <Card title="Population by Race" bordered={false}>
          <NewYorkPopulationRace />
        </Card>
      </Col>
    </Row>
  </div>
);

// Economics page
const EconomicsPage = () => (
  <div style={{ padding: '24px' }}>
    <Title level={2}>NYC Economics</Title>
    <Row gutter={[16, 16]}>
      <Col xs={24} lg={12}>
        <Card title="Income Distribution" bordered={false}>
          <NewYorkIncome />
        </Card>
      </Col>
      <Col xs={24} lg={12}>
        <Card title="Income by Race" bordered={false}>
          <IncomeRaceLineChart />
        </Card>
      </Col>
      <Col xs={24}>
        <Card title="Income by Gender" bordered={false}>
          <GenderIncomeSankey />
        </Card>
      </Col>
      <Col xs={24} md={12}>
        <Card title="Consumer Spending" bordered={false}>
          <ConsumerSpendingChart />
        </Card>
      </Col>
      <Col xs={24} md={12}>
        <Card title="Per Capita Consumption" bordered={false}>
          <PerCapitaConsumptionChart />
        </Card>
      </Col>
      <Col xs={24}>
        <Card title="Poverty Rates" bordered={false}>
          <PovertyRateBarChart />
        </Card>
      </Col>
    </Row>
  </div>
);


// Housing page
const HousingPage = () => (
  <div style={{ padding: '24px' }}>
    <Title level={2}>NYC Housing</Title>
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Card title="Housing Prices" bordered={false}>
          <NewYorkHousing />
        </Card>
      </Col>
      <Col span={24}>
        <Card title="Crime vs Housing Prices" bordered={false}>
          <CrimeHousingScatterPlot />
        </Card>
      </Col>
    </Row>
  </div>
);

// Urban metrics page
const UrbanPage = () => (
  <div style={{ padding: '24px' }}>
    <Title level={2}>NYC Urban Metrics</Title>
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Card title="Crime Rate by Neighborhood" bordered={false}>
          <CrimeRateMap />
        </Card>
      </Col>
      <Col span={24}>
        <Card title="Taxi Activity" bordered={false}>
          <NewYorkTransport />
        </Card>
      </Col>
    </Row>
  </div>
);

// Main App component with routing
const App = () => {
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
          <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: 'white', fontWeight: 'bold' }}>NYC INSIGHTS</span>
          </div>
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
            <Menu.Item key="1" icon={<HomeOutlined />}>
              <Link to="/">Dashboard</Link>
            </Menu.Item>
            <SubMenu key="sub1" icon={<TeamOutlined />} title="Demographics">
              <Menu.Item key="2">
                <Link to="/demographics">All Demographics</Link>
              </Menu.Item>
              <Menu.Item key="3">
                <Link to="/demographics/population-gender">Population by Gender</Link>
              </Menu.Item>
              <Menu.Item key="4">
                <Link to="/demographics/population-race">Population by Race</Link>
              </Menu.Item>
            </SubMenu>
            <SubMenu key="sub2" icon={<DollarOutlined />} title="Economics">
              <Menu.Item key="5">
                <Link to="/economics">All Economics</Link>
              </Menu.Item>
              <Menu.Item key="6">
                <Link to="/economics/income">Income</Link>
              </Menu.Item>
              <Menu.Item key="7">
                <Link to="/economics/spending">Consumer Spending</Link><br />

              </Menu.Item>
              <Menu.Item key="8">
                <Link to="/economics/consumption">Per Capita Consumption</Link><br />

              </Menu.Item>
              <Menu.Item key="9">
                <Link to="/economics/poverty">Poverty Rates</Link>
              </Menu.Item>
            </SubMenu>
            <Menu.Item key="10" icon={<BarChartOutlined />}>
              <Link to="/housing">Housing</Link>
            </Menu.Item>
            <SubMenu key="sub3" icon={<SafetyOutlined />} title="Urban">
              <Menu.Item key="11">
                <Link to="/urban">All Urban Metrics</Link>
              </Menu.Item>
              <Menu.Item key="12">
                <Link to="/urban/crime">Crime Statistics</Link>
              </Menu.Item>
              <Menu.Item key="13">
                <Link to="/urban/transport">Transportation</Link>
              </Menu.Item>
            </SubMenu>
            <Menu.Item key="14" icon={<LineChartOutlined />}>
              <Link to="/indicators">Key Indicators</Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Header style={{ padding: 0, background: '#fff' }} />
          <Content style={{ margin: '0 16px' }}>
            <div style={{ padding: 24, minHeight: 360 }}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/demographics" element={<DemographicsPage />} />
                <Route path="/demographics/population-gender" element={<NewYorkPopulationGender />} />
                <Route path="/demographics/population-race" element={<NewYorkPopulationRace />} />
                <Route path="/economics" element={<EconomicsPage />} />
                <Route path="/economics/income" element={<NewYorkIncome />} />
                <Route path="/economics/spending" element={<ConsumerSpendingChart />} />
                <Route path="/economics/consumption" element={<PerCapitaConsumptionChart />} />
                <Route path="/economics/poverty" element={<PovertyRateBarChart />} />
                <Route path="/housing" element={<HousingPage />} />
                <Route path="/urban" element={<UrbanPage />} />
                <Route path="/urban/crime" element={<CrimeRateMap />} />
                <Route path="/urban/transport" element={<NewYorkTransport />} />
                <Route path="/indicators" element={<NYCIndicatorsDashboard />} />
              </Routes>
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}></Footer>
        </Layout>
      </Layout>
    </Router>
  );
};

export default App;
