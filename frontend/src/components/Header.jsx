import React, { useState } from 'react';
import { Navbar, Container, Nav, Form, Button, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/userSlice';
import { FaShoppingCart, FaUser, FaPlus } from 'react-icons/fa';

const Header = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Obtener estado del carrito y usuario
  const { items = [] } = useSelector(state => state.cart || {});
  const { user: userInfo } = useSelector((state) => state.user);
  
  const cartItemsCount = items.reduce((acc, item) => acc + (item.quantity || 1), 0);
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search/${searchTerm}`);
      setSearchTerm('');
    }
  };

  const logoutHandler = () => {
    dispatch(logout());
    navigate('/login');
  };
  
  return (
    <header className="p-0 m-0">
      <Navbar bg="primary" variant="dark" expand="lg" collapseOnSelect className="p-0 m-0 rounded-0">
        <Container>
          <Navbar.Brand as={Link} to="/">THUNDER RUGS</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Form className="d-flex mx-auto" style={{maxWidth: '400px'}} onSubmit={handleSearch}>
              <Form.Control
                type="text"
                placeholder="Buscar alfombras..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="me-2"
              />
              <Button variant="warning" type="submit">Buscar</Button>
            </Form>
            
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/cart">
                <FaShoppingCart /> Carrito
              </Nav.Link>
              
              {userInfo ? (
                <NavDropdown title={userInfo.name} id="username">
                  <NavDropdown.Item as={Link} to="/profile">
                    Perfil
                  </NavDropdown.Item>
                  {userInfo.isAdmin && (
                    <NavDropdown.Item as={Link} to="/admin/dashboard">
                      Panel Admin
                    </NavDropdown.Item>
                  )}
                  <NavDropdown.Item onClick={logoutHandler}>
                    Cerrar Sesión
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <Nav.Link as={Link} to="/login">
                  <FaUser /> Ingresar
                </Nav.Link>
              )}
              
              {userInfo && userInfo.isAdmin && (
                <NavDropdown title="Admin" id="adminmenu">
                  <NavDropdown.Item as={Link} to="/admin/userlist">
                    Usuarios
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/admin/productlist">
                    Productos
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/admin/product/create">
                    Crear Producto
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/admin/orderlist">
                    Pedidos
                  </NavDropdown.Item>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
