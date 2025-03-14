import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Row, Col, Form, Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Can } from '../../context/AbilityContext';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { 
  listCategories, 
  deleteCategory, 
  createCategory,
  updateCategory,
  clearCategoryState
} from '../../redux/slices/categorySlice';

const CategoryListPage = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.user);
  const { 
    categories, 
    loading, 
    error, 
    success 
  } = useSelector((state) => state.category);

  useEffect(() => {
    if (user && user.isAdmin) {
      dispatch(listCategories());
    } else {
      navigate('/login');
    }

    if (success) {
      setShowCreateModal(false);
      setShowEditModal(false);
      setShowDeleteModal(false);
      setName('');
      setDescription('');
      setSelectedCategory(null);
    }

    return () => {
      dispatch(clearCategoryState());
    };
  }, [dispatch, navigate, user, success]);

  const createCategoryHandler = () => {
    setShowCreateModal(true);
  };

  const editCategoryHandler = (category) => {
    setSelectedCategory(category);
    setName(category.name);
    setDescription(category.description || '');
    setShowEditModal(true);
  };

  const deleteHandler = (category) => {
    setSelectedCategory(category);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    dispatch(deleteCategory(selectedCategory._id));
  };

  const submitCreateHandler = (e) => {
    e.preventDefault();
    dispatch(createCategory({ name, description }));
  };

  const submitEditHandler = (e) => {
    e.preventDefault();
    dispatch(updateCategory({ 
      id: selectedCategory._id,
      categoryData: { name, description }
    }));
  };

  return (
    <Can I="manage" a="Category">
      {() => (
        <>
          <Row className="align-items-center">
            <Col>
              <h1>Categorías</h1>
            </Col>
            <Col className="text-end">
              <Button className="my-3" onClick={createCategoryHandler}>
                <i className="fas fa-plus"></i> Crear Categoría
              </Button>
            </Col>
          </Row>
          {loading ? (
            <Loader />
          ) : error ? (
            <Message variant="danger">{error}</Message>
          ) : (
            <Table striped bordered hover responsive className="table-sm">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>NOMBRE</th>
                  <th>DESCRIPCIÓN</th>
                  <th>ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category._id}>
                    <td>{category._id}</td>
                    <td>{category.name}</td>
                    <td>{category.description}</td>
                    <td>
                      <Button
                        variant="info"
                        className="btn-sm me-2"
                        onClick={() => editCategoryHandler(category)}
                      >
                        <i className="fas fa-edit"></i>
                      </Button>
                      <Button
                        variant="danger"
                        className="btn-sm"
                        onClick={() => deleteHandler(category)}
                      >
                        <i className="fas fa-trash"></i>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}

          {/* Modal para crear categoría */}
          <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Crear Categoría</Modal.Title>
            </Modal.Header>
            <Form onSubmit={submitCreateHandler}>
              <Modal.Body>
                <Form.Group controlId="name" className="mb-3">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nombre de la categoría"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="description">
                  <Form.Label>Descripción</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Descripción de la categoría"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
                  Cancelar
                </Button>
                <Button type="submit" variant="primary">
                  Crear
                </Button>
              </Modal.Footer>
            </Form>
          </Modal>

          {/* Modal para editar categoría */}
          <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Editar Categoría</Modal.Title>
            </Modal.Header>
            <Form onSubmit={submitEditHandler}>
              <Modal.Body>
                <Form.Group controlId="editName" className="mb-3">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nombre de la categoría"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="editDescription">
                  <Form.Label>Descripción</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Descripción de la categoría"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                  Cancelar
                </Button>
                <Button type="submit" variant="primary">
                  Actualizar
                </Button>
              </Modal.Footer>
            </Form>
          </Modal>

          {/* Modal de confirmación para eliminar categoría */}
          <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Confirmar eliminación</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {selectedCategory && (
                <p>
                  ¿Estás seguro de que deseas eliminar la categoría <strong>{selectedCategory.name}</strong>?
                  Esta acción no se puede deshacer.
                </p>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
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

export default CategoryListPage; 