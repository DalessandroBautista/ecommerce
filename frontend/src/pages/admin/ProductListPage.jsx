/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Row, Col, Card, Badge, Modal, Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { CanWrapper as Can } from '../../context/AbilityContext';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import Paginate from '../../components/Paginate';
import { FaEdit, FaPlus, FaTrash, FaSearch } from 'react-icons/fa';
import {
  listProducts,
  deleteProduct,
  createProduct,
  resetProductCreate
} from '../../redux/slices/productSlice';
import ProductCard from '../../components/ProductCard';
import '../../assets/styles/productList.css';

const ProductListPage = () => {
  console.log('🔍 Renderizando ProductListPage');

  const { pageNumber = 1 } = useParams();
  const [showModal, setShowModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [keyword, setKeyword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { 
    products, 
    loading, 
    error, 
    success, 
    product: createdProduct,
    page,
    pages
  } = useSelector((state) => state.product);
  
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    console.log('🔵 ProductListPage: Componente montado');
    return () => {
      console.log('🔴 ProductListPage: Componente desmontado');
    };
  }, []);

  useEffect(() => {
    console.log('useEffect ProductListPage', {
      user,
      isAdmin: user?.isAdmin,
      success,
      createdProduct
    });
    // Verificar si el usuario es administrador
    if (!user || !user.isAdmin) {
      navigate('/login');
      return;
    }

    if (success && createdProduct) {
      dispatch(resetProductCreate());
      navigate(`/admin/product/${createdProduct._id}/edit`);
    } else {
      dispatch(listProducts({ pageNumber }));
    }
  }, [dispatch, navigate, user, success, createdProduct, pageNumber]);

  const deleteHandler = (id) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      dispatch(deleteProduct(id));
    }
  };

  const createProductHandler = () => {
    dispatch(createProduct());
  };

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(listProducts({ keyword }));
  };

  return (
    <Container className="py-4">
      <Card className="shadow-sm mb-4">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="mb-0">Productos</h1>
            <Link to="/admin/product/create">
              <Button variant="success">
                <FaPlus className="me-2" /> Crear Producto
              </Button>
            </Link>
          </div>
          
          <form onSubmit={handleSearch} className="mb-4">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Buscar productos..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
              <button type="submit" className="btn btn-primary">
                <FaSearch />
              </button>
            </div>
          </form>

          {loading ? (
            <Loader />
          ) : error ? (
            <Message variant="danger">{error}</Message>
          ) : products.length === 0 ? (
            <Message>No hay productos disponibles</Message>
          ) : (
            <Row>
              {products.map((product) => (
                <Col sm={12} md={6} lg={4} xl={3} className="mb-4" key={product._id}>
                  <ProductCard 
                    product={product}
                    onEdit={(id) => navigate(`/admin/product/${id}/edit`)}
                    onDelete={deleteHandler}
                  />
                </Col>
              ))}
            </Row>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ProductListPage; 