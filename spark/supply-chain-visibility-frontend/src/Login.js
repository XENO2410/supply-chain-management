import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
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
    .then(response => {
      if (!response.ok) {
        return response.json().then((data) => {
          throw new Error(data.error || 'Login failed');
        });
      }
      return response.json();
    })
    .then(data => {
      console.log('Login successful:', data);
      localStorage.setItem('token', data.access_token);
      navigate('/');
    })
    .catch(error => {
      console.error('Login error:', error);
      setError('Invalid username or password');
    });
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <h1 className="text-center">Login</h1>
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

            <Button variant="primary" type="submit" className="mt-4 w-100">
              Login
            </Button>
          </Form>
          <Row className="mt-3">
            <Col className="text-center">
              <Link to="/forgot-password">Forgot Password?</Link>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col className="text-center">
              <Link to="/register">New User? Register here</Link>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
