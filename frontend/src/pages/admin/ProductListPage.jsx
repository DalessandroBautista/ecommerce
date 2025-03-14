import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Table, Button, Row, Col, Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Can } from '../../context/AbilityContext';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import Paginate from '../../components/Paginate';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import {
  listProducts,
  deleteProduct,
  createProduct,
  resetProductCreate
} from '../../redux/slices/productSlice';

const ProductListPage = () => {
  const { pageNumber = 1 } = useParams();
  const [showModal, setShowModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

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

  const deleteHandler = (product) => {
    setProductToDelete(product);
    setShowModal(true);
  };

  const confirmDelete = () => {
    dispatch(deleteProduct(productToDelete._id));
    setShowModal(false);
  };

  const createProductHandler = () => {
    dispatch(createProduct());
  };

  return (
    <Can I="manage" a="Product">
      {() => (
        <>
          <Row className="align-items-center">
            <Col>
              <h1>Productos</h1>
            </Col>
            <Col className="text-end">
              <Button className="my-3" onClick={createProductHandler}>
                <FaPlus /> Crear Producto
              </Button>
            </Col>
          </Row>
          {loading ? (
            <Loader />
          ) : error ? (
            <Message variant="danger">{error}</Message>
          ) : (
            <>
              <Table striped bordered hover responsive className="table-sm">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>NOMBRE</th>
                    <th>PRECIO</th>
                    <th>CATEGORÍA</th>
                    <th>MARCA</th>
                    <th>STOCK</th>
                    <th>DESTACADO</th>
                    <th>ACCIONES</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id}>
                      <td>{product._id}</td>
                      <td>{product.name}</td>
                      <td>${product.price}</td>
                      <td>{product.category && product.category.name}</td>
                      <td>{product.brand}</td>
                      <td>{product.countInStock}</td>
                      <td>
                        {product.featured ? (
                          <i className="fas fa-check" style={{ color: "green" }}></i>
                        ) : (
                          <i className="fas fa-times" style={{ color: "red" }}></i>
                        )}
                      </td>
                      <td>
                        <Link to={`/admin/product/${product._id}/edit`}>
                          <Button variant="light" className="btn-sm me-2">
                            <FaEdit />
                          </Button>
                        </Link>
                        <Button
                          variant="danger"
                          className="btn-sm"
                          onClick={() => deleteHandler(product)}
                        >
                          <FaTrash />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <Paginate pages={pages} page={page} isAdmin={true} />
            </>
          )}

          {/* Modal de confirmación para eliminar producto */}
          <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Confirmar eliminación</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {productToDelete && (
                <p>
                  ¿Estás seguro de que deseas eliminar el producto <strong>{productToDelete.name}</strong>?
                  Esta acción no se puede deshacer.
                </p>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancelar
              </Button>
              <Button variant="danger" onClick={confirmDelete}>
                Eliminar
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      )}
    </Can>
  );
};

export default ProductListPage; 