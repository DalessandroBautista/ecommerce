import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Row, Col, Image, ListGroup, Card, Button, Form } from 'react-bootstrap';

const ProductPage = () => {
  const { id } = useParams();
  const [qty, setQty] = useState(1);
  
  // Mock data - en producción esto vendría de una API
  const product = {
    _id: '1',
    name: 'Alfombra Geométrica Azul',
    image: 'https://placehold.co/400x400/2b58a7/FFFFFF?text=Geometrica',
    additionalImages: [
      'https://placehold.co/400x400/1a3a6e/FFFFFF?text=Detalle+1',
      'https://placehold.co/400x400/3468b7/FFFFFF?text=Detalle+2',
      'https://placehold.co/400x400/5683c7/FFFFFF?text=Instalada'
    ],
    description: 'Alfombra artesanal elaborada con la técnica tufting. Diseño geométrico con patrones azules y blancos que aportan elegancia y modernidad a cualquier espacio. Cada pieza es única y elaborada a mano con materiales de alta calidad.',
    price: 299.99,
    dimensions: '150 x 200 cm',
    thickness: '2 cm',
    material: 'Lana y acrílico',
    weight: '5 kg',
    countInStock: 10,
    rating: 4.8,
    numReviews: 32,
    careInstructions: 'Aspirar regularmente. Limpiar las manchas con un paño húmedo. No usar productos químicos fuertes.',
    productionTime: '2-3 semanas',
    reviews: [
      { _id: '1', name: 'María', rating: 5, comment: 'Excelente calidad y diseño. Quedó perfecta en mi sala.', date: '10/05/2023' },
      { _id: '2', name: 'Carlos', rating: 4, comment: 'Buena textura y los colores son tal como en la foto.', date: '28/06/2023' },
      { _id: '3', name: 'Laura', rating: 5, comment: 'El acabado es impecable. Muy recomendable.', date: '15/07/2023' }
    ]
  };
  
  // Si estamos usando un ID dinámico, cargaríamos el producto adecuado
  
  const [selectedImage, setSelectedImage] = useState(product.image);
  
  const addToCartHandler = () => {
    // Aquí iría la lógica para añadir al carrito
    console.log(`Añadir al carrito producto ID: ${id}, cantidad: ${qty}`);
  };
  
  return (
    <div className="product-page">
      <Link className="btn btn-light my-3" to="/">
        Volver
      </Link>
      
      <Row>
        <Col md={6}>
          <div className="product-images">
            <Image
              src={selectedImage} 
              alt={product.name} 
              fluid 
              className="main-product-image"
            />
            <Row className="mt-3">
              <Col className="thumbnail-container">
                <Image 
                  src={product.image} 
                  alt={product.name}
                  className={`thumbnail ${selectedImage === product.image ? 'active' : ''}`}
                  onClick={() => setSelectedImage(product.image)}
                />
                {product.additionalImages.map((img, index) => (
                  <Image 
                    key={index}
                    src={img} 
                    alt={`${product.name} - vista ${index + 1}`}
                    className={`thumbnail ${selectedImage === img ? 'active' : ''}`}
                    onClick={() => setSelectedImage(img)}
                  />
                ))}
              </Col>
            </Row>
          </div>
        </Col>
        
        <Col md={6}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h3>{product.name}</h3>
              <div className="product-rating mb-2">
                {product.rating} ★ ({product.numReviews} reseñas)
              </div>
            </ListGroup.Item>
            
            <ListGroup.Item>
              <h4 className="product-price">${product.price.toFixed(2)}</h4>
            </ListGroup.Item>
            
            <ListGroup.Item>
              <h5>Características</h5>
              <ul className="product-features">
                <li><strong>Dimensiones:</strong> {product.dimensions}</li>
                <li><strong>Grosor:</strong> {product.thickness}</li>
                <li><strong>Material:</strong> {product.material}</li>
                <li><strong>Peso:</strong> {product.weight}</li>
                <li><strong>Tiempo de producción:</strong> {product.productionTime}</li>
              </ul>
            </ListGroup.Item>
            
            <ListGroup.Item>
              <h5>Descripción</h5>
              <p>{product.description}</p>
            </ListGroup.Item>
            
            <ListGroup.Item>
              <h5>Cuidados</h5>
              <p>{product.careInstructions}</p>
            </ListGroup.Item>
          </ListGroup>
          
          <Card className="mt-3">
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col md={6}>
                      <Form.Control
                        type="number"
                        value={qty}
                        onChange={(e) => setQty(Number(e.target.value))}
                      />
                    </Col>
                    <Col md={6}>
                      <Button
                        onClick={addToCartHandler}
                      >
                        Añadir al carrito
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ProductPage;
