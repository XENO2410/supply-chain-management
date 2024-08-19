import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <Container>
        <Row>
          <Col md={6}>
            <p>Made with Love ❤️</p>
          </Col>
          <Col md={6} className="text-md-right">
            <p>Evenidk | Wish I Knew</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
