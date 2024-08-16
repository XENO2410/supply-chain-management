import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css'; // Import the CSS file
import backgroundVideo from './back.mp4'; // Import the video file

function LandingPage() {
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate('/home'); // Assuming your main home page is under the '/home' route
  };

  return (
    <div className="landing-page-container">
      <video autoPlay loop muted className="landing-video-background">
        <source src={backgroundVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="landing-content">
        <h1 className="landing-title">Welcome to WMSparkTrack</h1>
        <p className="landing-subtitle">Track your shipments in real-time with ease.</p>
        <button className="landing-button" onClick={handleRedirect}>Enter Site</button>
      </div>
    </div>
  );
}

export default LandingPage;
