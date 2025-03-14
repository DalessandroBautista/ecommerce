import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from 'react-bootstrap';

const CategorySidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const categories = [
    { id: 'todas', name: 'Todas las Alfombras' },
    { id: 'geometricas', name: 'Geométricas' },
    { id: 'abstractas', name: 'Abstractas' },
    { id: 'minimalistas', name: 'Minimalistas' },
    { id: 'coloridas', name: 'Coloridas' },
    { id: 'personalizadas', name: 'Personalizadas' },
    { id: 'salas', name: 'Para Sala' },
    { id: 'dormitorios', name: 'Para Dormitorio' },
    { id: 'infantiles', name: 'Infantiles' }
  ];

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`sidebar-wrapper ${isOpen ? 'open' : ''}`}>
      {isMobile && (
        <Button 
          className="toggle-sidebar-btn"
          variant="primary"
          onClick={toggleSidebar}
        >
          {isOpen ? '× Cerrar' : '☰ Categorías'}
        </Button>
      )}
      
      <div className="sidebar-container">
        <h3 className="categories-title">Categorías</h3>
        <div className="list-group categories-list">
          <Link 
            to="/" 
            className={`list-group-item list-group-item-action ${location.pathname === '/' ? 'active' : ''}`}
            onClick={() => isMobile && setIsOpen(false)}
          >
            Todas las Alfombras
          </Link>
          
          {categories.slice(1).map((category) => (
            <Link 
              key={category.id}
              to={`/category/${category.id}`}
              className={`list-group-item list-group-item-action ${location.pathname === `/category/${category.id}` ? 'active' : ''}`}
              onClick={() => isMobile && setIsOpen(false)}
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategorySidebar; 