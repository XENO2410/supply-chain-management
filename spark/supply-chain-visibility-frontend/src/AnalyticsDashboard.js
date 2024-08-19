import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Table, Spinner } from "react-bootstrap";
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
  const [analyticsData, setAnalyticsData] = useState(null); // Use null to distinguish between no data and still loading
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true; // Track if the component is still mounted
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
        const data = await response.json();
        if (isMounted) {
          setAnalyticsData(data);
          setLoading(false); // Only set loading to false once all data is fetched
        }
      } catch (error) {
        console.error("Error fetching analytics data:", error);
        if (isMounted) setLoading(false);
      }
    };

    fetchAnalyticsData();

    return () => {
      isMounted = false; // Cleanup function to prevent state updates if unmounted
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

  if (!analyticsData) {
    return (
      <Container className="analytics-dashboard-container">
        <h2 className="analytics-dashboard-title">Shipment Analytics Dashboard</h2>
        <p>No data available</p>
      </Container>
    );
  }

  const {
    shipmentStatusCounts,
    shipmentHistoryOverTime,
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
                  dataKey="value"
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
