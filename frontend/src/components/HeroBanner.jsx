import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const HeroBanner = () => {
  return (
    <div className="hero-banner" style={{
      background: `linear-gradient(rgba(43, 88, 167, 0.9), rgba(30, 60, 115, 0.95)), 
                  url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5z' fill='%234373c1' fill-opacity='0.25' fill-rule='evenodd'/%3E%3C/svg%3E")`,
      minHeight: '500px',
      display: 'flex',
      alignItems: 'center',
      marginTop: 0,
      paddingTop: '2rem',
      paddingBottom: '2rem',
      marginBottom: '2rem'
    }}>
      <Container>
        <Row>
          <Col md={7} className="text-white col-md-7">
            <h1 className="display-4 fw-bold">Thunder Rugs</h1>
            <p className="lead mb-4">Descubre nuestra colección de alfombras artesanales de la más alta calidad para transformar tu hogar</p>
            <Link to="/shop">
              <Button variant="light" size="lg">Ver Catálogo</Button>
            </Link>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default HeroBanner; 