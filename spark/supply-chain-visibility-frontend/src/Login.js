import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './shared.css'; // Import the common CSS file

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch('https://wmsparktrack.onrender.com/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.access_token) {
        localStorage.setItem('token', data.access_token);
        navigate('/');
      } else {
        setError('Invalid username or password');
      }
    })
    .catch(() => setError('An error occurred. Please try again.'));
  };

  return (
    <div className="auth-container">
      <div className="auth-form-wrapper">
        <h1 className="auth-title">Login</h1>
        <p className="auth-subtitle">Track your shipments in real-time with our comprehensive tool.</p>
        {error && <p className="text-danger">{error}</p>}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formUsername">
            <Form.Control
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formPassword" className="mt-3">
            <div className="password-wrapper">
              <Form.Control
                type={passwordVisible ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button 
                variant="outline-secondary" 
                className="toggle-password" 
                onClick={() => setPasswordVisible(!passwordVisible)}>
                {passwordVisible ? <FaEyeSlash /> : <FaEye />}
              </Button>
            </div>
          </Form.Group>

          <Button variant="primary" type="submit" className="auth-button mt-4">
            Get Started
          </Button>
        </Form>
        <div className="mt-3">
          <Link to="/forgot-password" className="text-link">Forgot password?</Link>
        </div>
        <div className="mt-3">
          <span>New user? <Link to="/register" className="text-link">Register</Link></span>
        </div>
        {/* <div className="social-login-options mt-4">
          <button>Google</button>
          <button>Facebook</button>
          <button>Apple</button>
        </div> */}
      </div>
    </div>
  );
}

export default Login;
