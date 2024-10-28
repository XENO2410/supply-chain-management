import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './shared.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when submitting
    setError(''); // Clear any previous errors

    try {
      const response = await fetch('https://wmsparktrack.onrender.com/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Login failed');
      }

      const data = await response.json();
      localStorage.setItem('token', data.access_token);
      navigate('/home');
    } catch (error) {
      setError('Invalid username or password');
    } finally {
      setLoading(false); // Stop loading regardless of success or failure
    }
  };

  return (
    <div className="auth-container">
      <Container className="auth-card">
        <h1>Login</h1>
        {error && <p className="text-danger text-center">{error}</p>}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formPassword" className="mt-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="mt-4" disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : 'Login'} {/* Show loading spinner */}
          </Button>
        </Form>
        <div className="text-center mt-3">
          <Link to="/forgot-password">Forgot Password?</Link>
        </div>
        <div className="text-center mt-3">
          Not registered yet?
          <Link to="/register"> Create an account</Link>
        </div>
      </Container>
    </div>
  );
}

export default Login;
