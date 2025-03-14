import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col, Image } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Can } from '../../context/AbilityContext';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import FormContainer from '../../components/FormContainer';
import { 
  listProductDetails, 
  updateProduct, 
  uploadProductImage,
  resetProductUpdate 
} from '../../redux/slices/productSlice';
import { listCategories } from '../../redux/slices/categorySlice';

const ProductEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');
  const [featured, setFeatured] = useState(false);
  const [uploading, setUploading] = useState(false);

  const { product, loading, error, success } = useSelector((state) => state.product);
  const { categories } = useSelector((state) => state.category);
  const { user } = useSelector((state) => state.user);

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
      navigate('/admin/products');
    } else {
      if (!product || !product.name || product._id !== id) {
        dispatch(listProductDetails(id));
      } else {
        setName(product.name);
        setPrice(product.price);
        setImage(product.image);
        setBrand(product.brand);
        setCategory(product.category);
        setCountInStock(product.countInStock);
        setDescription(product.description);
        setFeatured(product.featured);
      }
    }
  }, [dispatch, id, product, success, navigate, user]);

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);

    try {
      const result = await dispatch(uploadProductImage(formData)).unwrap();
      setImage(result.image);
      setUploading(false);
    } catch (error) {
      console.error(error);
      setUploading(false);
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(updateProduct({
      _id: id,
      name,
      price,
      image,
      brand,
      category,
      description,
      countInStock,
      featured
    }));
  };

  return (
    <Can I="update" a="Product">
      {() => (
        <>
          <Link to="/admin/products" className="btn btn-light my-3">
            Volver
          </Link>
          <FormContainer>
            <h1>Editar Producto</h1>
            {loading ? (
              <Loader />
            ) : error ? (
              <Message variant="danger">{error}</Message>
            ) : (
              <Form onSubmit={submitHandler}>
                <Form.Group controlId="name" className="mb-3">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nombre del producto"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="price" className="mb-3">
                  <Form.Label>Precio</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Precio"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="image" className="mb-3">
                  <Form.Label>Imagen</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="URL de la imagen"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                  />
                  <Form.Control
                    type="file"
                    label="Elegir archivo"
                    onChange={uploadFileHandler}
                    className="mt-2"
                  />
                  {uploading && <Loader />}
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group controlId="brand" className="mb-3">
                      <Form.Label>Marca</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Marca"
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group controlId="category" className="mb-3">
                      <Form.Label>Categoría</Form.Label>
                      <Form.Select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                      >
                        <option value="">Seleccionar categoría</option>
                        {categories.map((cat) => (
                          <option key={cat._id} value={cat._id}>
                            {cat.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group controlId="countInStock" className="mb-3">
                  <Form.Label>Cantidad en Stock</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Cantidad en Stock"
                    value={countInStock}
                    onChange={(e) => setCountInStock(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="description" className="mb-3">
                  <Form.Label>Descripción</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Descripción"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="featured" className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Producto destacado"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                  />
                </Form.Group>

                <Button type="submit" variant="primary" className="w-100">
                  Actualizar
                </Button>
              </Form>
            )}
          </FormContainer>
        </>
      )}
    </Can>
  );
};

export default ProductEditPage; 