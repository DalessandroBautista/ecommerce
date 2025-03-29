/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaShoppingCart, FaEdit, FaTrash, FaBoxOpen, FaImage } from 'react-icons/fa';
import Rating from './Rating';
import { addItem, updateCartItems } from '../redux/slices/cartSlice';

const ProductCard = ({ product, onEdit, onDelete }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.user);
  const [imageError, setImageError] = useState(false);

  const addToCartHandler = () => {
    const item = {
      product: product._id,
      name: product.name,
      image: product.image,
      price: product.price,
      quantity: 1,
    };
    
    dispatch(addItem(item));
    dispatch(updateCartItems([item]));
  };

  // Verifica si el usuario es administrador
  const showAdminControls = user && user.isAdmin;

  // Función segura para manejar errores de imagen
  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <Card className="product-card h-100 shadow-sm">
      <div className="product-image-container" style={{ height: '200px', backgroundColor: '#f8f9fa' }}>
        {!imageError ? (
          <Card.Img 
            variant="top" 
            src={product.image} 
            alt={product.name}
            onError={handleImageError}
            style={{ objectFit: 'contain', height: '100%', width: '100%', padding: '10px' }}
          />
        ) : (
          <div className="d-flex align-items-center justify-content-center h-100 text-muted">
            <div className="text-center">
              <FaImage size={40} />
              <p className="mt-2">Sin imagen disponible</p>
            </div>
          </div>
        )}
      </div>
      
      <Card.Body>
        <Card.Title className="fw-bold mb-2">{product.name}</Card.Title>
        <Badge bg="secondary" className="mb-2">{product.brand}</Badge>
        <h3 className="text-primary my-2">${product.price?.toFixed(2)}</h3>
        
        <div className="d-flex align-items-center">
          <FaBoxOpen className="me-1 text-muted" /> 
          <small>Stock: {product.countInStock} unidades</small>
        </div>
      </Card.Body>
      
      <Card.Footer className="bg-white d-flex justify-content-between">
        <Button 
          variant="outline-primary" 
          size="sm" 
          onClick={() => onEdit(product._id)}
        >
          <FaEdit className="me-1" /> Editar
        </Button>
        <Button 
          variant="outline-danger" 
          size="sm" 
          onClick={() => onDelete(product._id)}
        >
          <FaTrash className="me-1" /> Eliminar
        </Button>
      </Card.Footer>
    </Card>
  );
};

// Componente de imagen segura integrado
const SafeImage = ({ src, alt, className }) => {
  const fallbackStyle = {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    color: '#888',
    fontFamily: 'Arial, sans-serif'
  };

  return src ? (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={(e) => {
        e.target.style.display = 'none';
        e.target.nextSibling.style.display = 'flex';
      }}
    />
  ) : (
    <div style={fallbackStyle}>Sin imagen disponible</div>
  );
};

export default ProductCard;
