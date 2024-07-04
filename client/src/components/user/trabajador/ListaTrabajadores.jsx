import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ListaTrabajadores = () => {
    const [estudiantes, setEstudiantes] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);

    const navigate = useNavigate();

    const handleEditClick = (id) => {
        navigate(`/dashboard/users/usuarios-Trabajador/${id}/edit`);
    };

    const handleCreateClick = () => {
        navigate(`/dashboard/users/usuarios-Trabajador/create`);
    };

    const fetchEstudiantes = () => {
        axios.get('http://192.168.0.16/usuarios/students/')
            .then(response => setEstudiantes(response.data))
            .catch(error => console.error('Error fetching data:', error));
    };

    const openModal = (userId) => {
        setSelectedUserId(userId);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedUserId(null);
    };

    const handleConfirmDelete = () => {
        axios.delete(`http://192.168.0.16/usuarios/students/${selectedUserId}/`)
            .then(() => {
                closeModal();
                fetchEstudiantes();
            })
            .catch(error => {
                console.error("Error al eliminar el estudiante:", error);
                alert("Hubo un error al eliminar el estudiante. Por favor intenta nuevamente.");
            });
    };

    useEffect(() => {
        fetchEstudiantes();
    }, []);
    const tableStyle = {
        width: '100%',
        marginTop: '20px',
        borderCollapse: 'collapse',
        borderSpacing: '0',
      };
      
      // Estilos para los encabezados y celdas de la tabla
      const cellStyle = {
        borderBottom: '1px solid #fff', // Línea blanca para las celdas y encabezados
        padding: '10px',
        textAlign: 'left',
      };

    const cardStyle = {
        padding: '20px',
        backgroundColor: '#002855',
        borderRadius: '8px',
        color: 'white',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
    };

    const modalStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    };

    const modalContentStyle = {
    width: '300px',
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '8px',
    textAlign: 'center',
    color: '#333',  // Color de texto oscuro
};


    const modalButtonStyle = {
        padding: '10px 20px',
        margin: '10px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    };

    if (isModalOpen) {
        return (
            <div style={modalStyle}>
                <div style={modalContentStyle}>
                    <h2>Eliminar Usuario</h2>
                    <p>¿Estás seguro de que deseas eliminar este usuario?</p>
                    <button style={{...modalButtonStyle, backgroundColor: '#e74c3c'}}
                            onClick={handleConfirmDelete}>
                        Confirmar
                    </button>
                    <button style={{...modalButtonStyle, backgroundColor: '#ccc'}}
                            onClick={closeModal}>
                        Cancelar
                    </button>
                </div>
            </div>
        );
    }


    return (
        <div style={cardStyle}>
          <h2>Lista de Estudiantes</h2>
          <button onClick={handleCreateClick}>
            ➕ Crear Estudiante
          </button>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={cellStyle}>ID</th>
                <th style={cellStyle}>Nombre de usuario</th>
                <th style={cellStyle}>Nombre</th>
                <th style={cellStyle}>Apellido</th>
                <th style={cellStyle}>Email</th>
                <th style={cellStyle}>Grado</th>
                <th style={cellStyle}>Foto</th> {/* Agrega esta línea */}
                <th style={cellStyle}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {estudiantes.map(estudiante => (
                <tr key={estudiante.user.id}>
                  <td style={cellStyle}>{estudiante.user.id}</td>
                  <td style={cellStyle}>{estudiante.user.username}</td>
                  <td style={cellStyle}>{estudiante.user.first_name}</td>
                  <td style={cellStyle}>{estudiante.user.last_name}</td>
                  <td style={cellStyle}>{estudiante.user.email}</td>
                  <td style={cellStyle}>{estudiante.grade}</td>
                  <td style={cellStyle}>
                    <img 
                      src={estudiante.user.foto_perfil} 
                      alt="Foto" 
                      style={{ width: '50px', height: '50px' }}  // Ajusta el tamaño como prefieras
                    />
                  </td> {/* Y esta línea */}
                  <td style={cellStyle}>
                    <button onClick={() => handleEditClick(estudiante.user.id)}>
                      ✏️ Editar
                    </button>
                    <button onClick={() => openModal(estudiante.user.id)}>
                      🗑️ Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      
}

export default ListaTrabajadores;

