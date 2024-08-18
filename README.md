# Supply Chain Visibility

[![Vercel](https://img.shields.io/badge/frontend-Vercel-brightgreen)](https://wmsparktrack.vercel.app/)
[![Render](https://img.shields.io/badge/backend-Render-blue)](https://wmsparktrack.onrender.com/)

A web application that provides real-time visibility into the supply chain, allowing users to track shipments, predict estimated time of arrival (ETA), and view analytics. This project includes both a frontend and backend, which work together to deliver a seamless user experience.

## Table of Contents

- [Live Demo](#live-demo)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

## Live Demo

- **Frontend**: [wmsparktrack.vercel.app](https://wmsparktrack.vercel.app/)
- **Backend**: [wmsparktrack.onrender.com](https://wmsparktrack.onrender.com/)

## Features

- **User Authentication**: Register and login to the platform.
- **Shipment Tracking**: Track real-time shipment information.
- **ETA Prediction**: Predict estimated time of arrival for shipments.
- **Analytics Dashboard**: View various analytics related to shipment status, delays, and delivery times.
- **Responsive Design**: The frontend is built to be fully responsive across all device sizes.

## Technology Stack

### Frontend:
- **React**
- **React Bootstrap**
- **Leaflet** (for map rendering)
- **React Router** (for routing)
- **Vercel** (for deployment)

### Backend:
- **Flask** (Python web framework)
- **Flask-Login** (for session management and user authentication)
- **PostgreSQL** (database, hosted on Supabase)
- **Scikit-learn** (for ETA prediction model)
- **Render** (for deployment)

## Getting Started

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd spark/supply-chain-visibility-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd spark
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up your database environment variables. In the `.env` file, ensure you have the following variables set:
   ```bash
   DATABASE_HOST=<your_database_host>
   DATABASE_NAME=<your_database_name>
   DATABASE_USER=<your_database_user>
   DATABASE_PASSWORD=<your_database_password>
   DATABASE_PORT=<your_database_port>
   ```

5. Initialize the database:
   ```bash
   python init_db.py
   ```

6. Run the application:
   ```bash
   gunicorn app:app  # For production
   ```

## API Endpoints

### Authentication

- **POST** `/register` - Register a new user.
- **POST** `/login` - Authenticate and start a user session.

### Shipments

- **GET** `/api/shipments` - Retrieve all shipments.
- **POST** `/api/shipments` - Add a new shipment.
- **GET** `/api/shipments/:id` - Retrieve details for a specific shipment.
- **PUT** `/api/shipments/:id` - Update a shipment.

### ETA Prediction

- **POST** `/api/predict_eta` - Predict the estimated time of arrival (ETA) for a shipment.

### Analytics

- **GET** `/api/analytics` - Retrieve analytics data related to shipments.

## Contributing

Contributions are welcome! Please fork this repository and submit a pull request for any feature you would like to add or improve.

### Key Updates:

- Updated the backend technology stack to reflect the use of PostgreSQL hosted on Supabase instead of SQLite.
- Included instructions for setting up environment variables necessary for connecting to the PostgreSQL database.
- Adjusted the backend setup instructions to use `gunicorn` for running the application in production, which is a more suitable choice for deployment environments like Render.
