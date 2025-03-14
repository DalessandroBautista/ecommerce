import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Row, Col, Form, Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { listUsers, deleteUser, updateUserAdmin, clearAdminState } from '../../redux/slices/adminSlice';
import { FaCheck, FaTimes, FaEdit, FaTrash } from 'react-icons/fa';

const UserListPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.user);
  const { users, loading, error, success } = useSelector((state) => state.admin);

  useEffect(() => {
    if (user && user.isAdmin) {
      dispatch(listUsers());
    } else {
      navigate('/login');
    }
    
    // Limpiar estado al desmontar
    return () => {
      dispatch(clearAdminState());
    };
  }, [dispatch, navigate, user, success]);

  const deleteHandler = (id) => {
    // Confirmación antes de eliminar
    const userToDelete = users.find(u => u._id === id);
    setUserToDelete(userToDelete);
    setShowModal(true);
  };

  const confirmDelete = () => {
    dispatch(deleteUser(userToDelete._id));
    setShowModal(false);
  };

  const toggleAdminStatus = (id, currentStatus) => {
    dispatch(updateUserAdmin({ id, isAdmin: !currentStatus }));
  };

  return (
    <>
      <Row className="align-items-center mb-3">
        <Col>
          <h1>Usuarios</h1>
        </Col>
      </Row>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Table striped hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>NOMBRE</th>
              <th>USUARIO</th>
              <th>EMAIL</th>
              <th>TELÉFONO</th>
              <th>ADMIN</th>
              <th>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>{user.username}</td>
                <td>
                  <a href={`mailto:${user.email}`}>{user.email}</a>
                </td>
                <td>{user.phone}</td>
                <td>
                  <Form.Check
                    type="switch"
                    id={`admin-switch-${user._id}`}
                    checked={user.isAdmin}
                    onChange={() => toggleAdminStatus(user._id, user.isAdmin)}
                    label=""
                  />
                </td>
                <td>
                  <Button
                    variant="danger"
                    className="btn-sm"
                    onClick={() => deleteHandler(user._id)}
                  >
                    <FaTrash />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Modal de confirmación para eliminar usuario */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {userToDelete && (
            <p>
              ¿Estás seguro de que deseas eliminar al usuario <strong>{userToDelete.name}</strong>?
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
  );
};

export default UserListPage; 