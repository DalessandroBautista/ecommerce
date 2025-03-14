import React, { useEffect, useState } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { listOrders } from '../../redux/slices/orderSlice';
import { Can } from '../../context/AbilityContext';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { FaUsers, FaShoppingCart, FaBox, FaList } from 'react-icons/fa';

const Dashboard = () => {
  const dispatch = useDispatch();
  
  const { orders, loading, error } = useSelector(state => state.order);
  const { users } = useSelector(state => state.admin);
  const { products } = useSelector(state => state.product);
  const { categories } = useSelector(state => state.category);

  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSales: 0,
    totalProducts: 0,
    totalUsers: 0,
    totalCategories: 0,
    pendingOrders: 0
  });

  useEffect(() => {
    dispatch(listOrders());
  }, [dispatch]);

  useEffect(() => {
    if (orders) {
      const totalSales = orders.reduce((sum, order) => sum + order.totalPrice, 0);
      const pendingOrders = orders.filter(order => !order.isPaid).length;
      
      setStats({
        totalOrders: orders.length,
        totalSales,
        totalProducts: products ? products.length : 0,
        totalUsers: users ? users.length : 0,
        totalCategories: categories ? categories.length : 0,
        pendingOrders
      });
    }
  }, [orders, products, users, categories]);

  // Función para formatear dinero
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-ES', { 
      style: 'currency', 
      currency: 'EUR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <Can I="manage" a="all">
      <h1>Dashboard</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Row className="mb-4">
            <Col md={3}>
              <Card className="bg-primary text-white mb-3">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-0">Ventas Totales</h6>
                      <h4 className="mt-2 mb-0">{formatCurrency(stats.totalSales)}</h4>
                    </div>
                    <FaShoppingCart size={32} />
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="bg-success text-white mb-3">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-0">Órdenes</h6>
                      <h4 className="mt-2 mb-0">{stats.totalOrders}</h4>
                    </div>
                    <FaShoppingCart size={32} />
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="bg-warning text-white mb-3">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-0">Productos</h6>
                      <h4 className="mt-2 mb-0">{stats.totalProducts}</h4>
                    </div>
                    <FaBox size={32} />
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="bg-info text-white mb-3">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-0">Usuarios</h6>
                      <h4 className="mt-2 mb-0">{stats.totalUsers}</h4>
                    </div>
                    <FaUsers size={32} />
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col md={6}>
              <Card className="h-100">
                <Card.Header as="h5">Acciones Rápidas</Card.Header>
                <Card.Body>
                  <div className="d-grid gap-2">
                    <Link to="/admin/orders" className="btn btn-primary">
                      Ver Pedidos
                    </Link>
                    <Link to="/admin/products" className="btn btn-success">
                      Gestionar Productos
                    </Link>
                    <Link to="/admin/users" className="btn btn-info">
                      Gestionar Usuarios
                    </Link>
                    <Link to="/admin/categories" className="btn btn-warning">
                      Gestionar Categorías
                    </Link>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="h-100">
                <Card.Header as="h5">Estado de Órdenes</Card.Header>
                <Card.Body>
                  <Row className="text-center">
                    <Col>
                      <div className="mb-2">
                        <h6>Pedidos Pendientes</h6>
                        <h3 className="text-warning">{stats.pendingOrders}</h3>
                      </div>
                    </Col>
                    <Col>
                      <div className="mb-2">
                        <h6>Pedidos Completados</h6>
                        <h3 className="text-success">{stats.totalOrders - stats.pendingOrders}</h3>
                      </div>
                    </Col>
                  </Row>
                  <div className="d-grid mt-3">
                    <Link to="/admin/orders" className="btn btn-outline-primary">
                      Ver todos los pedidos
                    </Link>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </Can>
  );
};

export default Dashboard; 