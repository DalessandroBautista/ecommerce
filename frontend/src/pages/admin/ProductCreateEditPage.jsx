/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Row, Col, Card, Container, Image, InputGroup, Badge } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { 
  FaArrowLeft, FaUpload, FaTags, FaBoxOpen, FaMoneyBillWave, 
  FaImage, FaFont, FaInfoCircle, FaSave, FaRuler, FaLayerGroup, 
  FaTools, FaTrash, FaStar
} from 'react-icons/fa';
import { 
  getProductDetails, 
  createProduct, 
  updateProduct, 
  resetProductCreate, 
  resetProductUpdate 
} from '../../redux/slices/productSlice';
import { listCategories } from '../../redux/slices/categorySlice';
import FormContainer from '../../components/FormContainer';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import axios from 'axios';
import config from '../../config';

const ProductCreateEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [additionalImages, setAdditionalImages] = useState([]);
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [material, setMaterial] = useState('');
  const [technique, setTechnique] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const { user } = useSelector(state => state.user);
  const { categories } = useSelector(state => state.category);
  const { 
    product, 
    loading, 
    error, 
    success: successUpdate 
  } = useSelector(state => state.product);

  const isEditMode = Boolean(id);

  useEffect(() => {
    dispatch(listCategories());

    if (isEditMode) {
      if (!product || product._id !== id) {
        dispatch(getProductDetails(id));
      } else {
        setName(product.name || '');
        setPrice(product.price || 0);
        setImage(product.image || '');
        setAdditionalImages(product.additionalImages || []);
        setBrand(product.brand || '');
        setCategory(product.category || '');
        setCountInStock(product.countInStock || 0);
        setDescription(product.description || '');
        setIsFeatured(product.isFeatured || false);
        setWidth(product.dimensions?.width || '');
        setHeight(product.dimensions?.height || '');
        setMaterial(product.material || '');
        setTechnique(product.technique || '');
      }
    } else {
      dispatch(resetProductCreate());
    }
  }, [dispatch, id, product, isEditMode]);

  const uploadFileHandler = async (e, isMainImage = true) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);
    setUploadError('');

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${user.token}`
        }
      };

      const { data } = await axios.post(`${config.API_URL}/api/upload`, formData, config);

      if (isMainImage) {
        setImage(data.imageUrl);
      } else {
        setAdditionalImages([...additionalImages, data.imageUrl]);
      }
      setUploading(false);
    } catch (error) {
      console.error('Error al subir imagen:', error);
      setUploadError('Error al subir la imagen. Intente nuevamente.');
      setUploading(false);
    }
  };

  const removeAdditionalImage = (index) => {
    const newImages = [...additionalImages];
    newImages.splice(index, 1);
    setAdditionalImages(newImages);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    
    const productData = {
      name,
      price: Number(price),
      image,
      brand,
      category,
      countInStock: Number(countInStock),
      description,
      isFeatured,
      additionalImages,
      dimensions: {
        width: width ? Number(width) : undefined,
        height: height ? Number(height) : undefined
      },
      material,
      technique
    };
    
    if (isEditMode) {
      dispatch(updateProduct({ _id: id, ...productData }));
    } else {
      dispatch(createProduct(productData));
    }
  };

  return (
    <Container className="py-4">
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center py-3">
          <div className="d-flex align-items-center">
            <Link to="/admin/productlist" className="btn btn-light me-3">
              <FaArrowLeft /> Volver
            </Link>
            <h2 className="mb-0">{isEditMode ? 'Editar Alfombra' : 'Crear Nueva Alfombra'}</h2>
          </div>
          {isEditMode && (
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
                {/* COLUMNA IZQUIERDA */}
                <Col lg={6}>
                  <Card className="mb-4 border-light shadow-sm">
                    <Card.Header className="bg-light">
                      <h4><FaFont className="me-2" /> Información Básica</h4>
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
                          <Form.Group controlId="category" className="mb-3">
                            <Form.Label>Categoría</Form.Label>
                            <InputGroup>
                              <InputGroup.Text><FaLayerGroup /></InputGroup.Text>
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
                            </InputGroup>
                          </Form.Group>
                        </Col>
                      </Row>

                      <Form.Group controlId="countInStock" className="mb-3">
                        <Form.Label>Cantidad en Stock</Form.Label>
                        <InputGroup>
                          <InputGroup.Text><FaBoxOpen /></InputGroup.Text>
                          <Form.Control
                            type="number"
                            placeholder="Cantidad disponible"
                            value={countInStock}
                            onChange={(e) => setCountInStock(e.target.value)}
                            min="0"
                            required
                          />
                        </InputGroup>
                      </Form.Group>

                      <Form.Group controlId="isFeatured" className="mb-3">
                        <div className="d-flex align-items-center">
                          <Form.Check
                            type="checkbox"
                            id="custom-featured"
                            checked={isFeatured}
                            onChange={(e) => setIsFeatured(e.target.checked)}
                            className="me-2"
                          />
                          <Form.Label htmlFor="custom-featured" className="mb-0 d-flex align-items-center">
                            <FaStar className="text-warning me-2" /> Destacar en página principal
                          </Form.Label>
                        </div>
                      </Form.Group>
                    </Card.Body>
                  </Card>

                  <Card className="mb-4 border-light shadow-sm">
                    <Card.Header className="bg-light">
                      <h4><FaInfoCircle className="me-2" /> Descripción</h4>
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
                </Col>

                {/* COLUMNA DERECHA */}
                <Col lg={6}>
                  <Card className="mb-4 border-light shadow-sm">
                    <Card.Header className="bg-light">
                      <h4><FaImage className="me-2" /> Imágenes</h4>
                    </Card.Header>
                    <Card.Body>
                      <Form.Group controlId="image" className="mb-3">
                        <Form.Label>Imagen Principal</Form.Label>
                        <div className={`image-preview-container mb-3 ${image ? 'has-image' : ''}`}>
                          {image ? (
                            <Image 
                              src={image} 
                              alt="Vista previa" 
                              fluid 
                              style={{ maxHeight: '200px', objectFit: 'contain' }}
                            />
                          ) : (
                            <div className="text-center text-muted">
                              <FaImage size={40} className="mb-2" />
                              <p>Vista previa de imagen</p>
                            </div>
                          )}
                        </div>
                        
                        <InputGroup className="mb-3">
                          <InputGroup.Text><FaImage /></InputGroup.Text>
                          <Form.Control
                            type="text"
                            placeholder="URL de imagen"
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                          />
                        </InputGroup>
                        
                        <Button 
                          variant="primary" 
                          className="w-100 mb-3"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            document.getElementById('imageUpload').click();
                          }}
                        >
                          <FaUpload className="me-2" /> Subir imagen principal
                        </Button>
                        
                        <Form.Control
                          id="imageUpload"
                          type="file"
                          onChange={(e) => uploadFileHandler(e, true)}
                          className="d-none"
                        />
                        
                        {uploading && <Loader />}
                        {uploadError && <Message variant='danger'>{uploadError}</Message>}
                      </Form.Group>

                      <Form.Group controlId="additionalImages">
                        <Form.Label>Imágenes Adicionales</Form.Label>
                        <Button 
                          variant="outline-secondary" 
                          className="w-100 mb-3"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            document.getElementById('additionalImagesUpload').click();
                          }}
                        >
                          <FaUpload className="me-2" /> Añadir imagen adicional
                        </Button>
                        
                        <Form.Control
                          id="additionalImagesUpload"
                          type="file"
                          onChange={(e) => uploadFileHandler(e, false)}
                          className="d-none"
                        />
                        
                        {additionalImages.length > 0 && (
                          <div className="p-3 border rounded">
                            <Row>
                              {additionalImages.map((img, index) => (
                                <Col key={index} xs={6} md={4} className="mb-3">
                                  <div className="position-relative">
                                    <Image 
                                      src={img} 
                                      alt={`Imagen adicional ${index+1}`} 
                                      thumbnail 
                                      className="w-100"
                                      style={{ height: '100px', objectFit: 'cover' }}
                                    />
                                    <Button 
                                      variant="danger" 
                                      size="sm"
                                      className="position-absolute top-0 end-0 rounded-circle p-1"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        removeAdditionalImage(index);
                                      }}
                                    >
                                      <FaTrash size={10} />
                                    </Button>
                                  </div>
                                </Col>
                              ))}
                            </Row>
                          </div>
                        )}
                      </Form.Group>
                    </Card.Body>
                  </Card>

                  <Card className="mb-4 border-light shadow-sm">
                    <Card.Header className="bg-light">
                      <h4><FaRuler className="me-2" /> Especificaciones</h4>
                    </Card.Header>
                    <Card.Body>
                      <Row className="mb-3">
                        <Col md={6}>
                          <Form.Group controlId="width">
                            <Form.Label>Ancho (cm)</Form.Label>
                            <InputGroup>
                              <InputGroup.Text><FaRuler /></InputGroup.Text>
                              <Form.Control
                                type="number"
                                placeholder="Ancho"
                                value={width}
                                onChange={(e) => setWidth(e.target.value)}
                                min="0"
                              />
                            </InputGroup>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group controlId="height">
                            <Form.Label>Largo (cm)</Form.Label>
                            <InputGroup>
                              <InputGroup.Text><FaRuler /></InputGroup.Text>
                              <Form.Control
                                type="number"
                                placeholder="Largo"
                                value={height}
                                onChange={(e) => setHeight(e.target.value)}
                                min="0"
                              />
                            </InputGroup>
                          </Form.Group>
                        </Col>
                      </Row>

                      <Form.Group controlId="material" className="mb-3">
                        <Form.Label>Material</Form.Label>
                        <InputGroup>
                          <InputGroup.Text><FaLayerGroup /></InputGroup.Text>
                          <Form.Control
                            type="text"
                            placeholder="Material (ej: Lana, Algodón, Seda)"
                            value={material}
                            onChange={(e) => setMaterial(e.target.value)}
                          />
                        </InputGroup>
                      </Form.Group>

                      <Form.Group controlId="technique">
                        <Form.Label>Técnica</Form.Label>
                        <InputGroup>
                          <InputGroup.Text><FaTools /></InputGroup.Text>
                          <Form.Control
                            type="text"
                            placeholder="Técnica de fabricación (ej: Anudado a mano)"
                            value={technique}
                            onChange={(e) => setTechnique(e.target.value)}
                          />
                        </InputGroup>
                      </Form.Group>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
              
              <div className="d-flex justify-content-between mt-4">
                <Link to="/admin/productlist">
                  <Button variant="outline-secondary" className="px-4">
                    <FaArrowLeft className="me-2" /> Cancelar
                  </Button>
                </Link>
                <Button 
                  type="submit" 
                  variant="success" 
                  className="px-5 py-2"
                >
                  <FaSave className="me-2" /> {isEditMode ? 'Actualizar Alfombra' : 'Crear Alfombra'}
                </Button>
              </div>
            </Form>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ProductCreateEditPage; 