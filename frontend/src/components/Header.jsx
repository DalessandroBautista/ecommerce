import React, { useState } from 'react';
import { Navbar, Container, Nav, Form, Button, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/userSlice';

const Header = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Obtener estado del carrito y usuario
  const { items = [] } = useSelector(state => state.cart || {});
  const { user } = useSelector(state => state.user);
  
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
    <Navbar bg="primary" variant="dark" expand="lg" fixed="top" className="navbar-main">
      <Container>
        <Link to="/" className="navbar-brand">
          <strong>THUNDER</strong> RUGS
        </Link>
        
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
            <Link to="/cart" className="nav-link">
              Carrito
              {cartItemsCount > 0 && (
                <span className="badge bg-warning text-dark ms-1">
                  {cartItemsCount}
                </span>
              )}
            </Link>
            
            {user ? (
              <NavDropdown title={user.name} id="username" className="nav-link">
                <Link to="/profile" className="dropdown-item">
                  Perfil
                </Link>
                {user.isAdmin && (
                  <Link to="/admin/dashboard" className="dropdown-item">
                    Panel Admin
                  </Link>
                )}
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={logoutHandler}>
                  Cerrar sesión
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Link to="/login" className="nav-link">Iniciar Sesión</Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
