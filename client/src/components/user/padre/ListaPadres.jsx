import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ListaPadres = () => {
    const [padres, setPadres] = useState([]); 
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);

    const navigate = useNavigate();

    const handleEditClick = (id) => {
        navigate(`/dashboard/users/usuarios-padre/${id}/edit`);
    };

    const handleCreateClick = () => {
        navigate(`/dashboard/users/usuarios-padre/create`);
    };

    useEffect(() => {
        axios.get('http://192.168.1.25/usuarios/parents/')
          .then(response => {
            const padresData = response.data;
            // Carga los detalles de los hijos para cada padre
            const padresConHijosPromesas = padresData.map(async padre => {
              const hijos = await Promise.all(
                padre.children.map(childId => 
                  axios.get(`http://192.168.1.25/usuarios/students/${childId}/`)
                )
              );
              // Añade la información detallada de los hijos al objeto del padre
              return {
                ...padre,
                childrenDetails: hijos.map(respuesta => respuesta.data)
              };
            });
            // Una vez que todas las promesas se han resuelto, actualiza el estado
            Promise.all(padresConHijosPromesas).then(padresCompletos => {
              setPadres(padresCompletos);
            });
          })
          .catch(error => console.error('Error fetching data:', error));
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
        axios.delete(`http://192.168.1.25/usuarios/teachers/${selectedUserId}/`)
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
        fetch('http://192.168.1.25/usuarios/teachers/')
            .then(response => response.json())
            .then(data => setpadrees(data))
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
            <h2>Lista de Padres</h2>
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
           ➕ Crear padre
        </button>
            <table style={tableStyle}>
                <thead>
                    <tr>
                        <th style={cellStyle}>Nombre de usuario</th>
                        <th style={cellStyle}>Nombre</th>
                        <th style={cellStyle}>Apellido</th>
                        <th style={cellStyle}>Email</th>
                        <th style={cellStyle}>Foto</th>
                        <th style={cellStyle}>Hijos</th> 
                        <th style={cellStyle}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                {padres.map(padre => ( 
                <tr key={padre.user.id}>
                            <td style={cellStyle}>{padre.user.username}</td>
                            <td style={cellStyle}>{padre.user.first_name}</td>
                            <td style={cellStyle}>{padre.user.last_name}</td>
                            <td style={cellStyle}>{padre.user.email}</td>
                            <td style={cellStyle}><img src={padre.user.foto_perfil} alt="Foto" width="50" /></td>
                            <td style={cellStyle}>
        {/* Mapea childrenDetails para obtener los nombres de los hijos */}
        {padre.childrenDetails.map((child, index) => (
          <span key={index}>
            {child.user.first_name} {child.user.last_name}
            {index < padre.childrenDetails.length - 1 ? ', ' : ''} {/* Añade coma si no es el último hijo */}
          </span>
        ))}
      </td>
                            <td style={cellStyle}>
                                <button
                                    style={{ marginRight: '10px', cursor: 'pointer' }}
                                    onClick={() => handleEditClick(padre.user.id)}>
                                    ✏️ Editar
                                </button>
                                <button style={{ cursor: 'pointer' }}
                                        onClick={() => openModal(padre.user.id)}>
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

export default ListaPadres;