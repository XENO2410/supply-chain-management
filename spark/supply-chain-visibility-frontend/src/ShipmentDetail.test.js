import 'whatwg-fetch'; // Import this at the top of your test file
import React from 'react';
import { render, screen } from '@testing-library/react';
import ShipmentDetail from './ShipmentDetail';
import { BrowserRouter as Router } from 'react-router-dom';

test('renders Shipment Details component', async () => {
  const shipment = {
    id: 1,
    shipment_id: 'SHIP123',
    origin: 'New York',
    destination: 'Los Angeles',
    current_location: 'Chicago',
    status: 'In Transit',
    eta: '2024-08-20',
  };

  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve(shipment),
    })
  );

  render(
    <Router>
      <ShipmentDetail />
    </Router>
  );

  const heading = await screen.findByText(/Shipment Details/i);
  expect(heading).toBeInTheDocument();

  const shipmentID = await screen.findByText(/SHIP123/i);
  expect(shipmentID).toBeInTheDocument();

  // Clean up the mock
  global.fetch.mockRestore();
});
