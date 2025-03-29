import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Image, ListGroup, Card, Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getProductDetails } from '../redux/slices/productSlice';
import { addItem, updateCartItems } from '../redux/slices/cartSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';

const ProductPage = () => {
  const { id } = useParams();
  const [qty, setQty] = useState(1);
  const [selectedImage, setSelectedImage] = useState('');
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { product, loading, error } = useSelector((state) => state.product);
  
  useEffect(() => {
    dispatch(getProductDetails(id));
  }, [dispatch, id]);
  
  useEffect(() => {
    if (product && product.image) {
      setSelectedImage(product.image);
    }
  }, [product]);
  
  const addToCartHandler = () => {
    if (product) {
      const item = {
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity: qty,
      };
      
      dispatch(addItem(item));
      dispatch(updateCartItems([item]));
      navigate('/cart');
    }
  };
  
  return (
    <div className="product-detail-page">
      <Link to="/" className="btn btn-light my-3">Volver</Link>
      
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : product ? (
        <Row>
          <Col md={6}>
            <Image src={selectedImage} alt={product.name} fluid />
            
            {product.additionalImages && product.additionalImages.length > 0 && (
              <Row className="mt-2">
                <Col>
                  <Image 
                    src={product.image} 
                    alt="Principal"
                    className={`img-thumbnail ${selectedImage === product.image ? 'selected' : ''}`}
                    onClick={() => setSelectedImage(product.image)}
                  />
                </Col>
                {product.additionalImages.map((img, index) => (
                  <Col key={index}>
                    <Image 
                      src={img} 
                      alt={`Vista ${index + 1}`}
                      className={`img-thumbnail ${selectedImage === img ? 'selected' : ''}`}
                      onClick={() => setSelectedImage(img)}
                    />
                  </Col>
                ))}
              </Row>
            )}
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
      ) : (
        <Message>Producto no encontrado</Message>
      )}
    </div>
  );
};

export default ProductPage;
