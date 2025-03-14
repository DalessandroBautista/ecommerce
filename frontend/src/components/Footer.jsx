import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaInstagram, FaWhatsapp, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer>
      <Container>
        <div className="footer-columns">
          <div className="footer-column">
            <h5 className="footer-title">THUNDER RUGS</h5>
            <p>Alfombras artesanales únicas creadas con la técnica tufting.</p>
            <p>Calidad, diseño y personalización en cada pieza.</p>
          </div>
          
          <div className="footer-column">
            <h5 className="footer-title">Enlaces Rápidos</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><Link to="/" className="footer-link">Inicio</Link></li>
              <li className="mb-2"><Link to="/productos" className="footer-link">Productos</Link></li>
              <li className="mb-2"><Link to="/proceso" className="footer-link">Nuestro Proceso</Link></li>
              <li><Link to="/contacto" className="footer-link">Contacto</Link></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h5 className="footer-title">Síguenos</h5>
            <div className="social-icons">
              <a href="https://www.instagram.com/thunder.rugs/" target="_blank" rel="noopener noreferrer" className="social-icon">
                <FaInstagram size={24} />
              </a>
              <a href="https://wa.me/123456789" target="_blank" rel="noopener noreferrer" className="social-icon">
                <FaWhatsapp size={24} />
              </a>
              <a href="mailto:info@thunderrugs.com" className="social-icon">
                <FaEnvelope size={24} />
              </a>
            </div>
          </div>
        </div>
        
        <div className="footer-copyright">
          <p>© {new Date().getFullYear()} Thunder Rugs - Todos los derechos reservados</p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
