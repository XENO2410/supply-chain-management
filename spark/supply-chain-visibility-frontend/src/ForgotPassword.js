import React, { useState } from "react";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("https://wmsparktrack.onrender.com/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (response.ok) {
      setMessage("If your email is registered, you will receive a password reset link.");
    } else {
      setMessage("Failed to send reset link. Please try again.");
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <h2 className="text-center">Forgot Password</h2>
          {message && <p className="text-info text-center">{message}</p>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="mt-4 w-100">
              Send Reset Link
            </Button>
          </Form>
          <Row className="mt-3">
            <Col className="text-center">
              <Link to="/login">Back to Login</Link>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default ForgotPassword;
