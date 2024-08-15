import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Container, Navbar, Form, FormControl, Pagination } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import ShipmentDetail from './ShipmentDetail';
import Login from './Login';

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}

function App() {
  const [shipments, setShipments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'ascending' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchData = () => {
      const token = localStorage.getItem('token');
      fetch('http://127.0.0.1:5000/api/shipments', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(response => response.json())
        .then(data => setShipments(data));
    };

    fetchData();  // Initial fetch

    // Listen for navigation back from ShipmentDetail
    window.addEventListener('popstate', fetchData);

    const interval = setInterval(fetchData, 10000);  // Poll every 10 seconds

    return () => {
      clearInterval(interval);  // Cleanup on component unmount
      window.removeEventListener('popstate', fetchData);
    };
  }, []);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedShipments = [...shipments].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const filteredShipments = sortedShipments.filter(shipment => 
    shipment.shipment_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shipment.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shipment.destination.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredShipments.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredShipments.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={
          <PrivateRoute>
            <div>
              <Navbar bg="dark" variant="dark">
                <Container>
                  <Navbar.Brand href="#">Supply Chain Visibility</Navbar.Brand>
                </Container>
              </Navbar>

              <Container className="mt-4">
                <h1>Real-Time Shipment Tracking</h1>
                <Form className="mb-4">
                  <FormControl
                    type="search"
                    placeholder="Search by Shipment ID, Origin, or Destination"
                    className="mr-sm-2"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </Form>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th onClick={() => requestSort('id')}>ID</th>
                      <th onClick={() => requestSort('shipment_id')}>Shipment ID</th>
                      <th onClick={() => requestSort('origin')}>Origin</th>
                      <th onClick={() => requestSort('destination')}>Destination</th>
                      <th onClick={() => requestSort('current_location')}>Current Location</th>
                      <th onClick={() => requestSort('status')}>Status</th>
                      <th onClick={() => requestSort('eta')}>ETA</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map(shipment => (
                      <tr key={shipment.id}>
                        <td>{shipment.id}</td>
                        <td>
                          <Link to={`/shipment/${shipment.id}`}>{shipment.shipment_id}</Link>
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
            </div>
          </PrivateRoute>
        } />
        <Route path="/shipment/:id" element={
          <PrivateRoute>
            <ShipmentDetail />
          </PrivateRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
