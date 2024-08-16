import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
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
} from "recharts";
import { Link } from "react-router-dom";
import "./styles.css"; // Importing styles

function AnalyticsDashboard() {
  const [analyticsData, setAnalyticsData] = useState({
    averageDeliveryTime: [],
    delayedShipmentsCount: [],
    statusDistribution: [],
  });

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:5000/api/analytics", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setAnalyticsData(data);
    };

    fetchAnalyticsData();
  }, []);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <Container className="analytics-dashboard">
      <h2 className="mt-4">Shipment Analytics Dashboard</h2>

      <Link to="/home">
        <Button variant="primary" className="mb-4">
          Back to Main Page
        </Button>
      </Link>

      <Row className="mt-5">
        <Col md={6}>
          <h4>Average Delivery Time (Days)</h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analyticsData.averageDeliveryTime}>
              <Line type="monotone" dataKey="days" stroke="#8884d8" />
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
        </Col>
        <Col md={6}>
          <h4>Status Distribution</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analyticsData.statusDistribution}
                dataKey="value"
                nameKey="status"
                cx="50%"
                cy="50%"
                outerRadius={120}
                fill="#8884d8"
              >
                {analyticsData.statusDistribution.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Col>
      </Row>
    </Container>
  );
}

export default AnalyticsDashboard;
