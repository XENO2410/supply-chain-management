import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./AddShipment.css"; // Import your custom CSS file

function AddShipment() {
  const [shipment, setShipment] = useState({
    shipment_id: "",
    origin: "",
    destination: "",
    current_location: "",
    status: "",
    eta: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShipment({
      ...shipment,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit the form data to the backend API
    fetch("https://wmsparktrack.onrender.com/api/shipments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(shipment),
    })
      .then((response) => response.json())
      .then((data) => {
        alert("Shipment added successfully!");
        // Optionally, redirect or clear the form
      })
      .catch((error) => {
        console.error("Error adding shipment:", error);
      });
  };

  return (
    <Container className="add-shipment-container">
      <h2 className="mt-4">Add New Shipment</h2>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group controlId="formShipmentId">
              <Form.Label>Shipment ID</Form.Label>
              <Form.Control
                type="text"
                name="shipment_id"
                value={shipment.shipment_id}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="formOrigin">
              <Form.Label>Origin</Form.Label>
              <Form.Control
                type="text"
                name="origin"
                value={shipment.origin}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group controlId="formDestination">
              <Form.Label>Destination</Form.Label>
              <Form.Control
                type="text"
                name="destination"
                value={shipment.destination}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="formCurrentLocation">
              <Form.Label>Current Location</Form.Label>
              <Form.Control
                type="text"
                name="current_location"
                value={shipment.current_location}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group controlId="formStatus">
              <Form.Label>Status</Form.Label>
              <Form.Control
                type="text"
                name="status"
                value={shipment.status}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="formETA">
              <Form.Label>ETA</Form.Label>
              <Form.Control
                type="date"
                name="eta"
                value={shipment.eta}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Button variant="primary" type="submit" className="mt-3">
          Add Shipment
        </Button>

        <Link to="/home">
          <Button variant="secondary" className="mt-3 ml-3">
            Back to Home
          </Button>
        </Link>
      </Form>
    </Container>
  );
}

export default AddShipment;
