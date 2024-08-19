import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Form, Button, ProgressBar } from 'react-bootstrap';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
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

// Function to get coordinates from location
const getCoordinatesFromLocation = async (location) => {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`
  );
  const data = await response.json();

  if (data && data.length > 0) {
    return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
  } else {
    console.error(`Location not found: ${location}`);
    return [0, 0]; // Default to (0, 0) if location is not found
  }
};

// Component to set map bounds
const SetMapBounds = ({ bounds }) => {
  const map = useMap();
  map.fitBounds(bounds);
  return null;
};

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
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    customer_address: '',
  });

  const [positions, setPositions] = useState({
    origin: [0, 0],
    current: [0, 0],
    destination: [0, 0],
  });

  const [truckPosition, setTruckPosition] = useState([0, 0]);

  useEffect(() => {
    fetch(`https://wmsparktrack.onrender.com/api/shipments/${id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(async (data) => {
        setShipment(data);
        const originCoordinates = await getCoordinatesFromLocation(data.origin);
        const currentLocationCoordinates = await getCoordinatesFromLocation(data.current_location);
        const destinationCoordinates = await getCoordinatesFromLocation(data.destination);

        setFormData({
          shipment_id: data.shipment_id || '',
          origin: data.origin || '',
          destination: data.destination || '',
          current_location: data.current_location || '',
          status: data.status || '',
          eta: data.eta || '',
          customer_name: data.customer_name || 'N/A',
          customer_email: data.customer_email || 'N/A',
          customer_phone: data.customer_phone || 'N/A',
          customer_address: data.customer_address || 'N/A',
        });

        setPositions({
          origin: originCoordinates,
          current: currentLocationCoordinates,
          destination: destinationCoordinates,
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
    fetch(`https://wmsparktrack.onrender.com/api/shipments/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to update shipment');
        }
        return response.json();
      })
      .then(data => {
        setShipment(data);
        setEditMode(false);
        navigate('/home');  // Navigate back to the home page after saving
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
      case 'Order Received':
        return 10;
      case 'Processing':
        return 20;
      case 'Ready for Pickup':
        return 30;
      case 'Picked Up':
        return 40;
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
        <h1 className="shipment-detail-main-title">Shipment Details</h1>
        {editMode ? (
          <Form className="shipment-form">
            {/* Form content */}
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
            <h3 className="customer-detail-title">Customer Details</h3>
            <p><strong>Name:</strong> {formData.customer_name}</p>
            <p><strong>Email:</strong> {formData.customer_email}</p>
            <p><strong>Phone:</strong> {formData.customer_phone}</p>
            <p><strong>Address:</strong> {formData.customer_address}</p>
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
        <MapContainer
          bounds={[positions.origin, positions.current, positions.destination]}
          zoom={5}
          style={{ height: "600px", width: "100%", borderRadius: "15px", marginTop: "50px" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
          />
          <Marker position={positions.origin} icon={originIcon}>
            <Popup>Origin: {shipment.origin}</Popup>
          </Marker>
          <Marker position={positions.destination} icon={destinationIcon}>
            <Popup>Destination: {shipment.destination}</Popup>
          </Marker>
          <Marker position={truckPosition} icon={truckIcon}>
            <Popup>Current Location: {shipment.current_location}</Popup>
          </Marker>
          <Polyline positions={[positions.origin, truckPosition]} pathOptions={{ color: 'blue' }} />
          <Polyline positions={[truckPosition, positions.destination]} pathOptions={{ color: 'blue', dashArray: '5, 10' }} />
          <SetMapBounds bounds={[positions.origin, positions.current, positions.destination]} />
        </MapContainer>
      </div>
    </Container>
  );
}

export default ShipmentDetail;
