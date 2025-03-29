/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Card, InputGroup, Badge } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Can } from '../../context/AbilityContext';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import FormContainer from '../../components/FormContainer';
import { 
  getProductDetails, 
  updateProduct, 
  uploadProductImage,
  resetProductUpdate 
} from '../../redux/slices/productSlice';
import { listCategories } from '../../redux/slices/categorySlice';
import { FaArrowLeft, FaUpload, FaTags, FaBoxOpen, FaMoneyBillWave, 
  FaImage, FaFont, FaInfoCircle, FaSave, FaTimes } from 'react-icons/fa';
import axios from 'axios';

const ProductEditPage = () => {
  const { id } = useParams();
  console.log('ProductEditPage renderizado, id:', id);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Verificar que el estado se está cargando correctamente
  const { product, loading, error, success } = useSelector((state) => {
    console.log('Estado actual en ProductEditPage:', state.product);
    return state.product;
  });
  
  const { user } = useSelector((state) => state.user);
  console.log('Usuario actual:', user);
  
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');
  const [featured, setFeatured] = useState(false);
  const [uploading, setUploading] = useState(false);

  const { categories } = useSelector((state) => state.category);

  // Añade estas referencias al principio del componente, después de los estados
  const fileInputRef = useRef(null);
  const multipleFileInputRef = useRef(null);

  useEffect(() => {
    // Verificar si el usuario es administrador
    if (!user || !user.isAdmin) {
      navigate('/login');
      return;
    }

    // Cargar categorías
    dispatch(listCategories());
    
    if (success) {
      dispatch(resetProductUpdate());
      navigate('/admin/productlist');
      return;
    } 
    
    // Solo cargar los detalles del producto cuando no los tenemos
    // o cuando el ID no coincide con el producto actual
    if (!product || product._id !== id) {
      console.log('Solicitando detalles del producto:', id);
      dispatch(getProductDetails(id));
    } else {
      // Solo configurar los estados del formulario una vez
      // cuando el producto está disponible y los campos están vacíos
      if (name === '') {
        console.log('Configurando formulario con producto:', product);
        setName(product.name || '');
        setPrice(product.price || 0);
        setImage(product.image || '');
        setBrand(product.brand || '');
        setCategory(product.category || '');
        setCountInStock(product.countInStock || 0);
        setDescription(product.description || '');
        setFeatured(product.featured || false);
      }
    }
  }, [dispatch, id, product, success, navigate, user, name]);

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);

    try {
      // Importar config o usar API_URL directamente
      console.log('Iniciando carga de imagen...');
      
      // Usar dispatch y la acción Redux en lugar de axios directo
      const result = await dispatch(uploadProductImage(formData)).unwrap();
      console.log('Resultado de carga:', result);
      setImage(result.imageUrl);
      setUploading(false);
    } catch (error) {
      console.error('Error detallado al subir imagen:', error);
      setUploading(false);
    }
  };

  const uploadMultipleFilesHandler = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    setUploading(true);
    
    try {
      const uploadPromises = files.map(file => {
        const formData = new FormData();
        formData.append('image', file);
        return dispatch(uploadProductImage(formData)).unwrap();
      });
      
      const results = await Promise.all(uploadPromises);
      const imageUrls = results.map(result => result.imageUrl);
      
      // Aquí actualizarías el estado con las URLs de las imágenes adicionales
      // Por ejemplo, si tienes un estado como additionalImages:
      // setAdditionalImages([...additionalImages, ...imageUrls]);
      
      setUploading(false);
    } catch (error) {
      console.error('Error al subir imágenes múltiples:', error);
      setUploading(false);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    
    // Verificar si el usuario está autenticado
    if (!user || !user.token) {
      alert('No estás autenticado. Por favor inicia sesión nuevamente.');
      navigate('/login');
      return;
    }

    // Verificar si el usuario es administrador
    if (!user.isAdmin) {
      alert('No tienes permisos de administrador para esta acción.');
      return;
    }

    // Crear objeto con datos del producto
    const productData = {
      name,
      price,
      image,
      brand,
      category,
      countInStock,
    };
    
    // Imprimir información de depuración
    console.log('Token:', user.token);
    console.log('Datos a enviar:', productData);
    
    dispatch(updateProduct({ id, productData }));
  };

  // Agregar un renderizado de depuración
  if (loading) {
    console.log('Cargando producto...');
    return <Loader />;
  }
  
  if (error) {
    console.log('Error al cargar producto:', error);
    return <Message variant="danger">{error}</Message>;
  }
  
  if (!user || !user.isAdmin) {
    console.log('Usuario no es admin:', user);
    return <Message variant="danger">No tienes permisos para esta página</Message>;
  }
  
  if (!product) {
    console.log('Producto no encontrado en el estado');
    return <Message variant="info">Cargando información del producto...</Message>;
  }

  return (
    <Can I="update" a="Product">
      {() => (
        <>
          <Container className="my-4">
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center py-3">
                <div className="d-flex align-items-center">
                  <Link to="/admin/productlist" className="btn btn-light me-3">
                    <FaArrowLeft /> Volver
                  </Link>
                  <h2 className="mb-0">{id ? 'Editar Alfombra' : 'Crear Nueva Alfombra'}</h2>
                </div>
                {id && (
                  <Badge bg="info" className="py-2 px-3 fs-6">
                    ID: {id}
                  </Badge>
                )}
              </Card.Header>

              <Card.Body className="p-4">
                {loading ? (
                  <Loader />
                ) : error ? (
                  <Message variant="danger">{error}</Message>
                ) : (
                  <Form onSubmit={submitHandler}>
                    <Row>
                      <Col md={6}>
                        <Card className="mb-4 border-light shadow-sm">
                          <Card.Header className="bg-light">
                            <h4><FaFont className="me-2" />Información Básica</h4>
                          </Card.Header>
                          <Card.Body>
                            <Form.Group controlId="name" className="mb-3">
                              <Form.Label>Nombre</Form.Label>
                              <InputGroup>
                                <InputGroup.Text><FaFont /></InputGroup.Text>
                                <Form.Control
                                  type="text"
                                  placeholder="Nombre de la alfombra"
                                  value={name}
                                  onChange={(e) => setName(e.target.value)}
                                  required
                                />
                              </InputGroup>
                            </Form.Group>

                            <Form.Group controlId="price" className="mb-3">
                              <Form.Label>Precio</Form.Label>
                              <InputGroup>
                                <InputGroup.Text><FaMoneyBillWave /></InputGroup.Text>
                                <Form.Control
                                  type="number"
                                  placeholder="0.00"
                                  value={price}
                                  onChange={(e) => setPrice(e.target.value)}
                                  min="0"
                                  step="0.01"
                                  required
                                />
                                <InputGroup.Text>€</InputGroup.Text>
                              </InputGroup>
                            </Form.Group>

                            <Row>
                              <Col md={6}>
                                <Form.Group controlId="brand" className="mb-3">
                                  <Form.Label>Marca</Form.Label>
                                  <InputGroup>
                                    <InputGroup.Text><FaTags /></InputGroup.Text>
                                    <Form.Control
                                      type="text"
                                      placeholder="Marca"
                                      value={brand}
                                      onChange={(e) => setBrand(e.target.value)}
                                      required
                                    />
                                  </InputGroup>
                                </Form.Group>
                              </Col>
                              <Col md={6}>
                                <Form.Group controlId="countInStock" className="mb-3">
                                  <Form.Label>Stock</Form.Label>
                                  <InputGroup>
                                    <InputGroup.Text><FaBoxOpen /></InputGroup.Text>
                                    <Form.Control
                                      type="number"
                                      placeholder="0"
                                      value={countInStock}
                                      onChange={(e) => setCountInStock(e.target.value)}
                                      min="0"
                                      required
                                    />
                                  </InputGroup>
                                </Form.Group>
                              </Col>
                            </Row>

                            <Form.Group controlId="category" className="mb-3">
                              <Form.Label>Categoría</Form.Label>
                              <Form.Select 
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                required
                              >
                                <option value="">Seleccionar categoría...</option>
                                {categories.map((cat) => (
                                  <option key={cat._id} value={cat._id}>
                                    {cat.name}
                                  </option>
                                ))}
                              </Form.Select>
                            </Form.Group>
                          </Card.Body>
                        </Card>
                      </Col>

                      <Col md={6}>
                        <Card className="mb-4 border-light shadow-sm">
                          <Card.Header className="bg-light">
                            <h4><FaImage className="me-2" />Imágenes</h4>
                          </Card.Header>
                          <Card.Body>
                            <Form.Group controlId="image" className="mb-3">
                              <Form.Label>Imagen Principal</Form.Label>
                              <InputGroup>
                                <InputGroup.Text><FaImage /></InputGroup.Text>
                                <Form.Control
                                  type="text"
                                  placeholder="URL de imagen"
                                  value={image}
                                  onChange={(e) => setImage(e.target.value)}
                                />
                              </InputGroup>
                            </Form.Group>
                            
                            <div className="image-preview-container mb-3 p-3 border rounded text-center">
                              {image ? (
                                <img 
                                  src={image} 
                                  alt="Vista previa" 
                                  className="img-fluid" 
                                  style={{maxHeight: '150px'}} 
                                />
                              ) : (
                                <div className="text-muted py-5">
                                  <FaImage size={40} />
                                  <p className="mt-2">Vista previa de imagen</p>
                                </div>
                              )}
                            </div>
                            
                            <div className="custom-file-upload mb-3">
                              <Button 
                                variant="outline-primary" 
                                className="w-100 d-flex align-items-center justify-content-center"
                                onClick={() => fileInputRef.current.click()}
                              >
                                <FaUpload className="me-2" /> Subir imagen principal
                                <Form.Control 
                                  type="file" 
                                  className="d-none" 
                                  ref={fileInputRef}
                                  onChange={uploadFileHandler}
                                />
                              </Button>
                            </div>

                            <Form.Group controlId="additionalImages" className="mb-3">
                              <Form.Label>Imágenes Adicionales</Form.Label>
                              <div className="custom-file-upload">
                                <Button 
                                  variant="outline-secondary" 
                                  className="w-100 d-flex align-items-center justify-content-center"
                                  onClick={() => multipleFileInputRef.current.click()}
                                >
                                  <FaUpload className="me-2" /> Subir imágenes adicionales
                                  <Form.Control 
                                    type="file" 
                                    className="d-none" 
                                    ref={multipleFileInputRef}
                                    multiple
                                    onChange={uploadMultipleFilesHandler}
                                  />
                                </Button>
                              </div>
                            </Form.Group>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                    
                    <Card className="mb-4 border-light shadow-sm">
                      <Card.Header className="bg-light">
                        <h4><FaInfoCircle className="me-2" />Descripción Detallada</h4>
                      </Card.Header>
                      <Card.Body>
                        <Form.Group controlId="description">
                          <Form.Control
                            as="textarea"
                            rows={5}
                            placeholder="Descripción detallada del producto..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                          />
                        </Form.Group>
                      </Card.Body>
                    </Card>
                    
                    <div className="d-flex justify-content-between mt-4">
                      <Link to="/admin/productlist">
                        <Button variant="outline-secondary" className="px-4">
                          <FaTimes className="me-2" /> Cancelar
                        </Button>
                      </Link>
                      <Button 
                        type="submit" 
                        variant="success" 
                        className="px-5 py-2"
                      >
                        <FaSave className="me-2" /> {id ? 'Actualizar' : 'Crear'}
                      </Button>
                    </div>
                  </Form>
                )}
              </Card.Body>
            </Card>
          </Container>
        </>
      )}
    </Can>
  );
};

export default ProductEditPage; 