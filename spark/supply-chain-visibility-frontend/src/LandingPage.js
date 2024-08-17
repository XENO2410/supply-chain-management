import React, { useState} from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css'; // Import the CSS file
import backgroundVideo from './back.mp4'; // Import the video file
import Spinner from 'react-bootstrap/Spinner'; // Import Bootstrap spinner

function LandingPage() {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate('/home'); // Assuming your main home page is under the '/home' route
  };

  const handleVideoLoaded = () => {
    setVideoLoaded(true);
  };

  return (
    <div className="landing-page-container">
      {!videoLoaded && (
        <div className="loading-spinner">
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        </div>
      )}
      <video 
        autoPlay 
        loop 
        muted 
        className="landing-video-background" 
        onLoadedData={handleVideoLoaded}>
        <source src={backgroundVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className={`landing-content ${videoLoaded ? 'fade-in' : ''}`}>
        <h1 className="landing-title">Welcome to WMSparkTrack</h1>
        <p className="landing-subtitle">Track your shipments in real-time with ease.</p>
        <button className="landing-button animated-button" onClick={handleRedirect}>Enter Site</button>
      </div>
    </div>
  );
}

export default LandingPage;
