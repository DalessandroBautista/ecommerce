import React, { useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import CategorySidebar from '../components/CategorySidebar';
import { useDispatch, useSelector } from 'react-redux';
import { listFeaturedProducts, listProducts } from '../redux/slices/productSlice';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import Message from '../components/Message';
import '../styles/HomePage.css'; // Asegúrate de que este archivo exista
import HeroBanner from '../components/HeroBanner';

const HomePage = () => {
  const dispatch = useDispatch();
  const { featuredProducts, loading, error } = useSelector((state) => state.product);
  const { user } = useSelector((state) => state.user);
  
  useEffect(() => {
    dispatch(listFeaturedProducts());
    dispatch(listProducts({}));
    
    // Remover padding al cargar la página de inicio
    document.body.classList.add('home-page');
    
    return () => {
      // Restaurar cuando se desmonte el componente
      document.body.classList.remove('home-page');
    };
  }, [dispatch]);

  return (
    <>
      <HeroBanner />
      <Container fluid className="px-0 mt-4">
        <div className="container">
          <Row>
            {/* Sidebar */}
            <Col md={3} className="d-none d-md-block">
              <CategorySidebar />
            </Col>
            
            {/* Productos destacados */}
            <Col md={9} className="py-4">
              <h2 className="section-title">Alfombras Destacadas</h2>
              {loading ? (
                <Loader />
              ) : error ? (
                <Message variant="danger">{error}</Message>
              ) : (
                <>
                  {featuredProducts && featuredProducts.length === 0 ? (
                    <Message>No hay alfombras destacadas disponibles.</Message>
                  ) : (
                    <Row>
                      {featuredProducts && featuredProducts.map((product) => (
                        <Col key={product._id} sm={6} md={4} className="mb-4">
                          <ProductCard product={product} isAdmin={user && user.isAdmin} />
                        </Col>
                      ))}
                    </Row>
                  )}
                </>
              )}
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
