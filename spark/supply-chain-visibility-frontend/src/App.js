import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Navbar, Nav, Form, FormControl, Pagination, Button, Collapse, Row, Col, Table } from "react-bootstrap";
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from "react-router-dom";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import ShipmentDetail from "./ShipmentDetail";
import Login from "./Login";
import Register from "./Register";
import ETAPrediction from "./ETAPrediction";
import AnalyticsDashboard from "./AnalyticsDashboard";
import AddShipment from "./AddShipment";
import LandingPage from "./LandingPage";
import "leaflet/dist/leaflet.css";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
}

function App() {
  const [shipments, setShipments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState([]);
  const [filterConfig, setFilterConfig] = useState({
    shipment_id: "",
    origin: "",
    destination: "",
    current_location: "",
    status: "",
    eta: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [openFilters, setOpenFilters] = useState(false);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchData = () => {
      const token = localStorage.getItem("token");
      fetch("https://wmsparktrack.onrender.com/api/shipments", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => setShipments(data));
    };

    fetchData();
    const interval = setInterval(fetchData, 10000);

    return () => clearInterval(interval);
  }, []);

  const requestSort = (key) => {
    let direction = "ascending";
    let updatedSortConfig = [...sortConfig];
    const existingSort = updatedSortConfig.find((sort) => sort.key === key);

    if (existingSort) {
      if (existingSort.direction === "ascending") {
        existingSort.direction = "descending";
      } else {
        updatedSortConfig = updatedSortConfig.filter(
          (sort) => sort.key !== key
        );
      }
    } else {
      updatedSortConfig.push({ key, direction });
    }

    setSortConfig(updatedSortConfig);
  };

  const handleFilterChange = (key, value) => {
    setFilterConfig({
      ...filterConfig,
      [key]: value,
    });
  };

  const filteredShipments = shipments.filter((shipment) => {
    const matchesFilters = Object.keys(filterConfig).every((key) =>
      shipment[key]
        .toString()
        .toLowerCase()
        .includes(filterConfig[key].toLowerCase())
    );

    const matchesSearchTerm =
      shipment.shipment_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.current_location
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    return matchesFilters && matchesSearchTerm;
  });

  const sortedShipments = [...filteredShipments].sort((a, b) => {
    for (let i = 0; i < sortConfig.length; i++) {
      const { key, direction } = sortConfig[i];
      if (a[key] < b[key]) {
        return direction === "ascending" ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === "ascending" ? 1 : -1;
      }
    }
    return 0;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedShipments.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(sortedShipments.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getSortIcon = (key) => {
    const sort = sortConfig.find((sort) => sort.key === key);
    if (sort) {
      return sort.direction === "ascending" ? <FaSortUp /> : <FaSortDown />;
    } else {
      return <FaSort />;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={
          <PrivateRoute>
            <>
              <Navbar bg="dark" variant="dark">
                <Container>
                  <Navbar.Brand href="/">WMSparkTrack</Navbar.Brand>
                  <Nav className="ml-auto">
                    <Link to="/" className="nav-link">
                      Home
                    </Link>
                    <Link to="/analytics" className="nav-link">
                      Analytics Dashboard
                    </Link>
                    <Link to="/add_shipment" className="nav-link">
                      Add Shipment
                    </Link>
                    {localStorage.getItem("token") ? (
                      <>
                        <Button variant="outline-light" onClick={handleLogout}>
                          Logout
                        </Button>
                      </>
                    ) : (
                      <>
                        <Link to="/login" className="nav-link">
                          Login
                        </Link>
                        <Link to="/register" className="nav-link">
                          Register
                        </Link>
                      </>
                    )}
                  </Nav>
                </Container>
              </Navbar>

              <Container className="mt-4">
                <h1>Real-Time Shipment Tracking</h1>
                <Row className="mb-4 align-items-center">
                  <Col>
                    <Form>
                      <FormControl
                        type="search"
                        placeholder="Search by Shipment ID, Origin, or Destination"
                        className="mr-sm-2"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </Form>
                  </Col>
                  <Col xs="auto">
                    <Link to="/predict_eta">
                      <Button variant="info">Predict Shipment ETA</Button>
                    </Link>
                  </Col>
                  <Col xs="auto">
                    <Link to="/add_shipment">
                      <Button variant="success">Add Shipment</Button>
                    </Link>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col>
                    <Button
                      onClick={() => setOpenFilters(!openFilters)}
                      aria-controls="filter-section"
                      aria-expanded={openFilters}
                      variant="secondary"
                      className="mr-2"
                    >
                      {openFilters ? "Hide Filters" : "Show Filters"}
                    </Button>
                  </Col>
                </Row>

                <Collapse in={openFilters}>
                  <div id="filter-section" className="mb-3">
                    <Form>
                      <Row>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label>Shipment ID</Form.Label>
                            <FormControl
                              type="text"
                              placeholder="Shipment ID"
                              value={filterConfig.shipment_id}
                              onChange={(e) =>
                                handleFilterChange(
                                  "shipment_id",
                                  e.target.value
                                )
                              }
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label>Origin</Form.Label>
                            <FormControl
                              type="text"
                              placeholder="Origin"
                              value={filterConfig.origin}
                              onChange={(e) =>
                                handleFilterChange("origin", e.target.value)
                              }
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Row>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label>Destination</Form.Label>
                            <FormControl
                              type="text"
                              placeholder="Destination"
                              value={filterConfig.destination}
                              onChange={(e) =>
                                handleFilterChange(
                                  "destination",
                                  e.target.value
                                )
                              }
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label>Current Location</Form.Label>
                            <FormControl
                              type="text"
                              placeholder="Current Location"
                              value={filterConfig.current_location}
                              onChange={(e) =>
                                handleFilterChange(
                                  "current_location",
                                  e.target.value
                                )
                              }
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Row>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label>Status</Form.Label>
                            <FormControl
                              type="text"
                              placeholder="Status"
                              value={filterConfig.status}
                              onChange={(e) =>
                                handleFilterChange("status", e.target.value)
                              }
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label>ETA</Form.Label>
                            <FormControl
                              type="text"
                              placeholder="ETA"
                              value={filterConfig.eta}
                              onChange={(e) =>
                                handleFilterChange("eta", e.target.value)
                              }
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                    </Form>
                  </div>
                </Collapse>

                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th onClick={() => requestSort("id")}>
                        ID {getSortIcon("id")}
                      </th>
                      <th onClick={() => requestSort("shipment_id")}>
                        Shipment ID {getSortIcon("shipment_id")}
                      </th>
                      <th onClick={() => requestSort("origin")}>
                        Origin {getSortIcon("origin")}
                      </th>
                      <th onClick={() => requestSort("destination")}>
                        Destination {getSortIcon("destination")}
                      </th>
                      <th onClick={() => requestSort("current_location")}>
                        Current Location {getSortIcon("current_location")}
                      </th>
                      <th onClick={() => requestSort("status")}>
                        Status {getSortIcon("status")}
                      </th>
                      <th onClick={() => requestSort("eta")}>
                        ETA {getSortIcon("eta")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((shipment) => (
                      <tr key={shipment.id}>
                        <td>{shipment.id}</td>
                        <td>
                          <Link to={`/shipment/${shipment.id}`}>
                            {shipment.shipment_id}
                          </Link>
                        </td>
                        <td>{shipment.origin}</td>
                        <td>{shipment.destination}</td>
                        <td>{shipment.current_location}</td>
                        <td>{shipment.status}</td>
                        <td>{shipment.eta}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <Pagination>
                  {[...Array(totalPages)].map((_, index) => (
                    <Pagination.Item
                      key={index + 1}
                      active={index + 1 === currentPage}
                      onClick={() => paginate(index + 1)}
                    >
                      {index + 1}
                    </Pagination.Item>
                  ))}
                </Pagination>
              </Container>
            </>
          </PrivateRoute>
        } />
        <Route path="/shipment/:id" element={<PrivateRoute><ShipmentDetail shipments={shipments} /></PrivateRoute>} />
        <Route path="/predict_eta" element={<PrivateRoute><ETAPrediction /></PrivateRoute>} />
        <Route path="/analytics" element={<PrivateRoute><AnalyticsDashboard /></PrivateRoute>} />
        <Route path="/add_shipment" element={<PrivateRoute><AddShipment /></PrivateRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </Router>
  );
}

export default App;
