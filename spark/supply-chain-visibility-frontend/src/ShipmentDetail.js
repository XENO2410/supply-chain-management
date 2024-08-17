import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Form, Button, ProgressBar } from 'react-bootstrap';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './ShipmentDetail.css';
import truck from './icons/truck-icon.png';
import red from './icons/red-marker-icon.png';
import green from './icons/green-marker-icon.png';

// Custom icons
const originIcon = L.icon({
  iconUrl: red,
  iconSize: [38, 38],
  iconAnchor: [19, 38],
});

const destinationIcon = L.icon({
  iconUrl: green,
  iconSize: [38, 38],
  iconAnchor: [19, 38],
});

const truckIcon = L.icon({
  iconUrl: truck,
  iconSize: [38, 38],
  iconAnchor: [19, 19],
});

function ShipmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
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

  const [truckPosition, setTruckPosition] = useState([40.7128, -74.0060]); // Start at origin
  const originCoordinates = [40.7128, -74.0060]; // New York
  const destinationCoordinates = [34.0522, -118.2437]; // Los Angeles
  const currentLocationCoordinates = [41.8781, -87.6298]; // Chicago

  useEffect(() => {
    fetch(`https://wmsparktrack.onrender.com/api/shipments/${id}`)
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
        animateTruck(originCoordinates, currentLocationCoordinates);
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

  const animateTruck = (start, end) => {
    const steps = 100;
    const deltaLat = (end[0] - start[0]) / steps;
    const deltaLng = (end[1] - start[1]) / steps;

    let currentStep = 0;

    const moveTruck = () => {
      if (currentStep <= steps) {
        const newLat = start[0] + deltaLat * currentStep;
        const newLng = start[1] + deltaLng * currentStep;
        setTruckPosition([newLat, newLng]);
        currentStep++;
        requestAnimationFrame(moveTruck);
      }
    };

    moveTruck();
  };

  const getProgress = () => {
    switch (shipment?.status) {
      case 'Order Placed':
        return 25;
      case 'In Transit':
        return 50;
      case 'Out for Delivery':
        return 75;
      case 'Delivered':
        return 100;
      default:
        return 0;
    }
  };

  if (!shipment) return <div>Loading...</div>;

  return (
    <Container className="shipment-detail-container">
      <div className="details-section">
        <h1 className="shipment-detail-title">Shipment Details</h1>
        {editMode ? (
          <Form className="shipment-form">
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
            <Button variant="primary" onClick={handleSaveChanges} className="btn-save">
              Save Changes
            </Button>
            <Button variant="secondary" onClick={() => setEditMode(false)} className="btn-cancel ml-2">
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
            
            <h3 className="shipment-progress-title">Shipment Progress</h3>
            <ProgressBar now={getProgress()} label={`${getProgress()}%`} className="shipment-progress-bar" />
            
            <Button variant="warning" onClick={() => setEditMode(true)} className="btn-edit mt-3">
              Edit
            </Button>
            <Button variant="secondary" onClick={() => navigate('/home')} className="btn-back ml-2 mt-3">
              Go Back to Main Page
            </Button>
          </div>
        )}
      </div>

      <div className="map-section">
        <MapContainer center={currentLocationCoordinates} zoom={5} style={{ height: "400px", width: "100%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
          />
          <Marker position={originCoordinates} icon={originIcon}>
            <Popup>Origin: {shipment.origin}</Popup>
          </Marker>
          <Marker position={destinationCoordinates} icon={destinationIcon}>
            <Popup>Destination: {shipment.destination}</Popup>
          </Marker>
          <Marker position={truckPosition} icon={truckIcon}>
            <Popup>Current Location: {shipment.current_location}</Popup>
          </Marker>
          <Polyline positions={[originCoordinates, currentLocationCoordinates]} pathOptions={{ color: 'blue' }} />
          <Polyline positions={[currentLocationCoordinates, destinationCoordinates]} pathOptions={{ color: 'blue', dashArray: '5, 10' }} />
        </MapContainer>
      </div>
    </Container>
  );
}

export default ShipmentDetail;
