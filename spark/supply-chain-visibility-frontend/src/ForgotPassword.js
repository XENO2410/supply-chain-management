import React, { useState } from "react";
import {  Form, Button } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import './shared.css'; // Import the common CSS file

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

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
      navigate("/login");
    } else {
      setError("Failed to reset password");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-wrapper">
        <h1 className="auth-title">Forgot Password</h1>
        {error && <p className="text-danger">{error}</p>}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formEmail">
            <Form.Control
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="auth-button mt-4">
            Reset Password
          </Button>
        </Form>
        <div className="mt-3">
          <Link to="/login" className="text-link">Remembered? Log In</Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
