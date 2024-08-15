import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Form, Button } from 'react-bootstrap';

function ShipmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();  // Replacing useHistory with useNavigate
  const [shipment, setShipment] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    shipment_id: '',
    origin: '',
    destination: '',
    current_location: '',
    status: '',
    eta: '',
  });

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/api/shipments/${id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setShipment(data);
        setFormData({
          shipment_id: data.shipment_id,
          origin: data.origin,
          destination: data.destination,
          current_location: data.current_location,
          status: data.status,
          eta: data.eta,
        });
      })
      .catch(error => console.error('Fetch error:', error));
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSaveChanges = () => {
    fetch(`http://127.0.0.1:5000/api/shipments/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then(response => response.json())
      .then(data => {
        setShipment(data);
        setEditMode(false);
        navigate('/');  // Navigate back to the main page after saving
      })
      .catch(error => console.error('Update error:', error));
  };
  
  if (!shipment) return <div>Loading...</div>;

  return (
    <Container>
      <h1>Shipment Details</h1>
      {editMode ? (
        <Form>
          <Form.Group>
            <Form.Label>Shipment ID</Form.Label>
            <Form.Control
              type="text"
              name="shipment_id"
              value={formData.shipment_id}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Origin</Form.Label>
            <Form.Control
              type="text"
              name="origin"
              value={formData.origin}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Destination</Form.Label>
            <Form.Control
              type="text"
              name="destination"
              value={formData.destination}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Current Location</Form.Label>
            <Form.Control
              type="text"
              name="current_location"
              value={formData.current_location}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Status</Form.Label>
            <Form.Control
              type="text"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>ETA</Form.Label>
            <Form.Control
              type="text"
              name="eta"
              value={formData.eta}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Button variant="primary" onClick={handleSaveChanges}>
            Save Changes
          </Button>
          <Button variant="secondary" onClick={() => setEditMode(false)} className="ml-2">
            Cancel
          </Button>
        </Form>
      ) : (
        <div>
          <p><strong>ID:</strong> {shipment.id}</p>
          <p><strong>Shipment ID:</strong> {shipment.shipment_id}</p>
          <p><strong>Origin:</strong> {shipment.origin}</p>
          <p><strong>Destination:</strong> {shipment.destination}</p>
          <p><strong>Current Location:</strong> {shipment.current_location}</p>
          <p><strong>Status:</strong> {shipment.status}</p>
          <p><strong>ETA:</strong> {shipment.eta}</p>
          <Button variant="warning" onClick={() => setEditMode(true)}>
            Edit
          </Button>
        </div>
      )}
    </Container>
  );
}

export default ShipmentDetail;
