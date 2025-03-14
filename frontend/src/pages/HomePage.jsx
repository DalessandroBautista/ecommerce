import React, { useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import CategorySidebar from '../components/CategorySidebar';
import { useDispatch, useSelector } from 'react-redux';
import '../styles/HomePage.css'; // Asegúrate de que este archivo exista

const HomePage = () => {
  // Datos de muestra para productos de alfombras tufting
  const products = [
    { _id: '1', name: 'Alfombra Geométrica Azul', image: 'https://placehold.co/400x400/2b58a7/FFFFFF?text=Geometrica', price: 299.99, rating: 4.8, numReviews: 32 },
    { _id: '2', name: 'Alfombra Abstracta Multicolor', image: 'https://placehold.co/400x400/2b58a7/FFFFFF?text=Abstracta', price: 349.99, rating: 4.7, numReviews: 28 },
    { _id: '3', name: 'Alfombra Minimalista Gris', image: 'https://placehold.co/400x400/2b58a7/FFFFFF?text=Minimalista', price: 259.99, rating: 4.9, numReviews: 45 },
    { _id: '4', name: 'Alfombra Infantil Nubes', image: 'https://placehold.co/400x400/2b58a7/FFFFFF?text=Infantil', price: 199.99, rating: 4.6, numReviews: 19 },
    { _id: '5', name: 'Alfombra Circular Mandala', image: 'https://placehold.co/400x400/2b58a7/FFFFFF?text=Mandala', price: 289.99, rating: 4.8, numReviews: 37 },
    { _id: '6', name: 'Alfombra Personalizada Logo', image: 'https://placehold.co/400x400/2b58a7/FFFFFF?text=Personalizada', price: 399.99, rating: 5.0, numReviews: 12 },
  ];

  return (
    <>
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1>THUNDER RUGS</h1>
          <p>Alfombras artesanales únicas creadas con la técnica tufting</p>
          <Link to="/products">
            <Button variant="warning">Ver Colección</Button>
          </Link>
        </div>
      </div>
      
      {/* Contenido principal con categorías y productos */}
      <Container fluid className="px-0">
        <div className="container-inner">
          <Row>
            {/* Sidebar */}
            <Col md={3} className="d-none d-md-block">
              <CategorySidebar />
            </Col>
            
            {/* Productos */}
            <Col xs={12} md={9} className="products-container">
              <div className="d-block d-md-none">
                <CategorySidebar />
              </div>
              
              <h2 className="section-title">Nuestras Alfombras</h2>
              <Row>
                {products.map((product) => (
                  <Col key={product._id} xs={6} md={6} lg={4} className="mb-4">
                    <div className="product-card">
                      <Link to={`/product/${product._id}`}>
                        <div className="product-image-container">
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="product-image" 
                          />
                        </div>
                      </Link>
                      <div className="product-info">
                        <Link to={`/product/${product._id}`} className="text-decoration-none">
                          <h3 className="product-title">{product.name}</h3>
                        </Link>
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="product-price">${product.price.toFixed(2)}</span>
                          <span className="product-rating">
                            {product.rating} ★ ({product.numReviews})
                          </span>
                        </div>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
          
          {/* Sección Sobre la Técnica Tufting */}
          <Row className="py-5 my-4">
            <Col md={6} className="mb-4">
              <h2 className="section-title">Sobre la Técnica Tufting</h2>
              <p>En Thunder Rugs creamos cada alfombra a mano utilizando la técnica tufting, un proceso artesanal que permite crear diseños únicos con texturas y patrones personalizados.</p>
              <p>Cada pieza es elaborada cuidadosamente, insertando hilos de lana o acrílico en una tela para crear diseños texturizados que destacan por su calidad y originalidad.</p>
              <Button variant="primary" as={Link} to="/acerca-de">
                Conoce Más Sobre Nosotros
              </Button>
            </Col>
            <Col md={6}>
              <img 
                src="https://placehold.co/600x400/2b58a7/FFFFFF?text=Proceso+Tufting" 
                alt="Proceso de tufting" 
                className="img-fluid rounded shadow" 
              />
            </Col>
          </Row>
        </div>
      </Container>
    </>
  );
};

export default HomePage;
