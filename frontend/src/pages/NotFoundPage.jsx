import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <Container className="text-center py-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <h1 className="display-4">404</h1>
          <h2>Página No Encontrada</h2>
          <p className="lead">
            Lo sentimos, la página que estás buscando no existe.
          </p>
          <Link to="/">
            <Button variant="primary">Volver a la página principal</Button>
          </Link>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFoundPage; 