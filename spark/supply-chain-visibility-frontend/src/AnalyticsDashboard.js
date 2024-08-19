import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Spinner, Alert } from "react-bootstrap";
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
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchAnalyticsData = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(
          "https://wmsparktrack.onrender.com/api/analytics",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        if (isMounted) {
          setAnalyticsData(data);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching analytics data:", error);
        if (isMounted) {
          setError(error.message);
          setLoading(false);
        }
      }
    };

    fetchAnalyticsData();

    return () => {
      isMounted = false;
    };
  }, []);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  if (loading) {
    return (
      <Container className="analytics-dashboard-container">
        <h2 className="analytics-dashboard-title">Shipment Analytics Dashboard</h2>
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="analytics-dashboard-container">
        <h2 className="analytics-dashboard-title">Shipment Analytics Dashboard</h2>
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!analyticsData || 
      (!analyticsData.statusDistribution.length &&
       !analyticsData.delayedShipmentsCount.length &&
       !analyticsData.averageDeliveryTime.length)) {
    return (
      <Container className="analytics-dashboard-container">
        <h2 className="analytics-dashboard-title">Shipment Analytics Dashboard</h2>
        <p>No data available</p>
      </Container>
    );
  }

  const {
    statusDistribution,
    delayedShipmentsCount,
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
          {statusDistribution && statusDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusDistribution}
                  dataKey="value"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  fill="#8884d8"
                >
                  {statusDistribution.map((entry, index) => (
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
          <h4 className="chart-title">Delayed Shipments Over Time</h4>
          {delayedShipmentsCount && delayedShipmentsCount.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={delayedShipmentsCount}>
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
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="days" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p>No data available</p>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default AnalyticsDashboard;
