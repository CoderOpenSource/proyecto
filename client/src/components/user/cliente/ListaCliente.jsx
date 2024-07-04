import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ListaCliente = () => {
    const [profesores, setProfesores] = useState([]); 
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);

    const navigate = useNavigate();

    const handleEditClick = (id) => {
        navigate(`/dashboard/users/usuarios-cliente/${id}/edit`);
    };

    const handleCreateClick = () => {
        navigate(`/dashboard/users/usuarios-cliente/create`);
    };

    const fetchProfesores = () => {
        axios.get('http://192.168.0.16/usuarios/teachers/') // Cambiado de students a teachers
            .then(response => setProfesores(response.data)) // Cambiado de estudiantes a profesores
            .catch(error => console.error('Error fetching data:', error));
    };
    useEffect(() => {
        fetchProfesores(); // Cambiado de estudiantes a profesores
    }, []);
    const openModal = (userId) => {
        setSelectedUserId(userId);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedUserId(null);
    };

    const handleConfirmDelete = () => {
        axios.delete(`http://192.168.0.16/usuarios/teachers/${selectedUserId}/`)
            .then(() => {
                closeModal();
                fetchTrabajadores();
            })
            .catch(error => {
                console.error("Error al eliminar el usuario:", error);
                alert("Hubo un error al eliminar el usuario. Por favor intenta nuevamente.");
            });
    };

    useEffect(() => {
        fetch('http://192.168.0.16/usuarios/teachers/')
            .then(response => response.json())
            .then(data => setProfesores(data))
            .catch(error => console.error('Error fetching data:', error));
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
            <h2>Lista de Profesores</h2>
            <button
           style={{
              backgroundColor: '#4CAF50', // verde
              color: 'white',
              padding: '10px 15px',
              borderRadius: '5px',
              marginBottom: '20px',
              cursor: 'pointer'
           }}
           onClick={handleCreateClick}
        >
           ➕ Crear Profesor
        </button>
            <table style={tableStyle}>
                <thead>
                    <tr>
                        <th style={cellStyle}>Nombre de usuario</th>
                        <th style={cellStyle}>Nombre</th>
                        <th style={cellStyle}>Email</th>
                        <th style={cellStyle}>Foto de perfil</th>
                        <th style={cellStyle}>Departamento</th> 
                        <th style={cellStyle}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                {profesores.map(profesor => ( 
                <tr key={profesor.user.id}>
                            <td style={cellStyle}>{profesor.user.username}</td>
                            <td style={cellStyle}>{profesor.user.first_name}</td>
                            <td style={cellStyle}>{profesor.user.email}</td>
                            <td style={cellStyle}><img src={profesor.user.foto_perfil} alt="Foto de perfil" width="50" /></td>
                            <td style={cellStyle}>{profesor.department}</td>
                            <td style={cellStyle}>
                                <button
                                    style={{ marginRight: '10px', cursor: 'pointer' }}
                                    onClick={() => handleEditClick(profesor.user.id)}>
                                    ✏️ Editar
                                </button>
                                <button style={{ cursor: 'pointer' }}
                                        onClick={() => openModal(profesor.user.id)}>
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

export default ListaCliente;