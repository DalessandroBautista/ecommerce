import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Row, Col, ListGroup, Image, Form, Button, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { addItem, removeItem } from '../redux/slices/cartSlice';
import Message from '../components/Message';
import Loader from '../components/Loader';

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Obtener el estado del carrito desde Redux
  const cart = useSelector(state => state.cart);
  const { cartItems, loading, error } = cart;

  const removeFromCartHandler = (id) => {
    // Despachar acción para eliminar del carrito
    dispatch(removeItem(id));
  };

  const checkoutHandler = () => {
    navigate('/login?redirect=shipping');
  };

  const updateQtyHandler = (id, qty) => {
    // Despachar acción para actualizar cantidad
    dispatch(addItem({
      product: id,
      quantity: Number(qty)
    }));
  };

  // Calcular totales
  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2);
  const shippingPrice = (itemsPrice > 500 ? 0 : 50).toFixed(2);
  const taxPrice = (0.21 * itemsPrice).toFixed(2);
  const totalPrice = (Number(itemsPrice) + Number(shippingPrice) + Number(taxPrice)).toFixed(2);

  return (
    <div className="cart-page">
      <h1 className="my-4">Carrito de Compras</h1>
      <Row>
        <Col md={8}>
          {loading ? (
            <Loader />
          ) : error ? (
            <Message variant='danger'>{error}</Message>
          ) : cartItems.length === 0 ? (
            <div className="alert alert-info">
              Tu carrito está vacío <Link to="/">Volver a la tienda</Link>
            </div>
          ) : (
            <ListGroup variant="flush">
              {cartItems.map((item) => (
                <ListGroup.Item key={item._id || item.product}>
                  <Row className="align-items-center">
                    <Col md={2}>
                      <Image src={item.image} alt={item.name} fluid rounded />
                    </Col>
                    <Col md={3}>
                      <Link to={`/product/${item._id || item.product}`} className="product-name">
                        {item.name}
                      </Link>
                    </Col>
                    <Col md={2}>${item.price.toFixed(2)}</Col>
                    <Col md={2}>
                      <Form.Control
                        as="select"
                        value={item.qty}
                        onChange={(e) => updateQtyHandler(item._id || item.product, Number(e.target.value))}
                      >
                        {[...Array(Math.min(item.countInStock, 5)).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </Form.Control>
                    </Col>
                    <Col md={2} className="text-end">
                      <Button
                        type="button"
                        variant="light"
                        onClick={() => removeFromCartHandler(item._id || item.product)}
                      >
                        <i className="fas fa-trash"></i> Eliminar
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
          <Button variant="outline-primary" className="mt-3" as={Link} to="/">
            Continuar Comprando
          </Button>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h2>Resumen de Compra</h2>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Productos ({cartItems.reduce((acc, item) => acc + item.qty, 0)}):</Col>
                    <Col className="text-end">${itemsPrice}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Envío:</Col>
                    <Col className="text-end">${shippingPrice}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>IVA (21%):</Col>
                    <Col className="text-end">${taxPrice}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Total:</Col>
                    <Col className="text-end"><strong>${totalPrice}</strong></Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Button
                    type="button"
                    className="btn-block w-100"
                    disabled={cartItems.length === 0}
                    onClick={checkoutHandler}
                  >
                    Proceder al Pago
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CartPage;
