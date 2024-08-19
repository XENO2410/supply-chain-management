import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Table } from "react-bootstrap";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import { Link } from "react-router-dom";
import "./AnalyticsDashboard.css";

function AnalyticsDashboard() {
  const [analyticsData, setAnalyticsData] = useState({
    shipmentStatusCounts: [],
    shipmentHistoryOverTime: [],
    topCustomers: [],
    averageDeliveryTime: [],
  });

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "https://wmsparktrack.onrender.com/api/analytics",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setAnalyticsData(data);
    };

    fetchAnalyticsData();
  }, []);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const {
    shipmentStatusCounts,
    shipmentHistoryOverTime,
    topCustomers,
    averageDeliveryTime,
  } = analyticsData;

  return (
    <Container className="analytics-dashboard-container">
      <h2 className="analytics-dashboard-title">Shipment Analytics Dashboard</h2>

      <div className="dashboard-buttons">
        <Link to="/home">
          <Button variant="secondary" className="dashboard-back-button">
            Back to Main Page
          </Button>
        </Link>
      </div>

      <Row className="analytics-charts">
        <Col md={6} className="chart-container">
          <h4 className="chart-title">Shipments by Status</h4>
          {shipmentStatusCounts && shipmentStatusCounts.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={shipmentStatusCounts}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  fill="#8884d8"
                >
                  {shipmentStatusCounts.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p>No data available</p>
          )}
        </Col>

        <Col md={6} className="chart-container">
          <h4 className="chart-title">Shipment Updates Over Time</h4>
          {shipmentHistoryOverTime && shipmentHistoryOverTime.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={shipmentHistoryOverTime}>
                <Line type="monotone" dataKey="count" stroke="#8884d8" />
                <CartesianGrid stroke="#ccc" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p>No data available</p>
          )}
        </Col>
      </Row>

      <Row className="analytics-charts">
        <Col md={6} className="chart-container">
          <h4 className="chart-title">Average Delivery Time</h4>
          {averageDeliveryTime && averageDeliveryTime.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={averageDeliveryTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="shipment_id" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="days" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p>No data available</p>
          )}
        </Col>

        <Col md={6} className="chart-container">
          <h4 className="chart-title">Top Customers by Shipments</h4>
          {topCustomers && topCustomers.length > 0 ? (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Customer ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Total Shipments</th>
                </tr>
              </thead>
              <tbody>
                {topCustomers.map((customer) => (
                  <tr key={customer.customer_id}>
                    <td>{customer.customer_id}</td>
                    <td>{customer.name}</td>
                    <td>{customer.email}</td>
                    <td>{customer.totalShipments}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p>No data available</p>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default AnalyticsDashboard;
