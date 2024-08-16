import React, { useState } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './ETAPrediction.css'; // Import the custom CSS file

const ETAPrediction = () => {
    const [origin, setOrigin] = useState('New York');
    const [destination, setDestination] = useState('Los Angeles');
    const [currentLocation, setCurrentLocation] = useState('Chicago');
    const [status, setStatus] = useState('In Transit');
    const [predictedETA, setPredictedETA] = useState(null);

    const predictETA = async () => {
        const response = await fetch('http://127.0.0.1:5000/api/predict_eta', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                origin,
                destination,
                current_location: currentLocation,
                status
            })
        });
        const data = await response.json();
        setPredictedETA(data);
    };

    return (
        <Container className="eta-container">
            <h1 className="eta-title">Predict Shipment ETA</h1>
            <Form>
                <Form.Group controlId="formOrigin">
                    <Form.Label>Origin</Form.Label>
                    <Form.Control
                        type="text"
                        value={origin}
                        onChange={(e) => setOrigin(e.target.value)}
                        placeholder="Enter origin city"
                        className="eta-input"
                    />
                </Form.Group>

                <Form.Group controlId="formDestination">
                    <Form.Label>Destination</Form.Label>
                    <Form.Control
                        type="text"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        placeholder="Enter destination city"
                        className="eta-input"
                    />
                </Form.Group>

                <Form.Group controlId="formCurrentLocation">
                    <Form.Label>Current Location</Form.Label>
                    <Form.Control
                        type="text"
                        value={currentLocation}
                        onChange={(e) => setCurrentLocation(e.target.value)}
                        placeholder="Enter current location"
                        className="eta-input"
                    />
                </Form.Group>

                <Form.Group controlId="formStatus">
                    <Form.Label>Status</Form.Label>
                    <Form.Control
                        type="text"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        placeholder="Enter status"
                        className="eta-input"
                    />
                </Form.Group>

                <Button variant="primary" className="eta-button" onClick={predictETA}>
                    Predict ETA
                </Button>
            </Form>

            {predictedETA && (
                <Alert variant="success" className="eta-result">
                    <p><strong>Predicted ETA Date:</strong> {predictedETA.predicted_eta_date}</p>
                    <p><strong>Predicted ETA Days:</strong> {predictedETA.predicted_eta_days.toFixed(2)}</p>
                </Alert>
            )}

            <Link to="/home">
                <Button variant="secondary" className="eta-back-button">
                    Back to Homepage
                </Button>
            </Link>
        </Container>
    );
};

export default ETAPrediction;