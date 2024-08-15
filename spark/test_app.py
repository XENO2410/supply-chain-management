import pytest
from app import app

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_home(client):
    """Test the home route."""
    rv = client.get('/')
    assert b'Welcome to the Real-Time Supply Chain Visibility API!' in rv.data

def test_get_shipments(client):
    """Test retrieving all shipments."""
    rv = client.get('/api/shipments')
    assert rv.status_code == 200
    assert isinstance(rv.json, list)

def test_add_shipment(client):
    """Test adding a new shipment."""
    new_shipment = {
        "shipment_id": "TEST123",
        "origin": "Test Origin",
        "destination": "Test Destination",
        "current_location": "Test Location",
        "status": "In Transit",
        "eta": "2024-12-31"
    }
    rv = client.post('/api/shipments', json=new_shipment)
    assert rv.status_code == 201
    assert rv.json['message'] == "Shipment added successfully"
