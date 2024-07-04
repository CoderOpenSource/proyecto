import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './../../AuthContext';

function TrabajadorEdit() {
  const { id } = useParams();
  const [estudiante, setEstudiante] = useState(null); // Cambiado a null para la inicialización
  const [newAvatar, setNewAvatar] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { authToken } = useAuth();

  useEffect(() => {
    const fetchEstudiante = async () => {
      try {
        const response = await axios.get(`http://192.168.0.16/usuarios/students/${id}/`, {
          headers: {
            'Authorization': `Bearer ${authToken}`,
          },
        });
        setEstudiante(response.data);
      } catch (error) {
        console.error("Error al obtener los datos del estudiante:", error);
      }
    };

    fetchEstudiante();
  }, [id, authToken]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
   
  formData.append('user.first_name', estudiante.user.first_name);
  formData.append('user.last_name', estudiante.user.last_name);
  formData.append('user.email', estudiante.user.email);
  formData.append('grade', estudiante.grade);
  if (newAvatar) {
    formData.append('user.foto_perfil', newAvatar);
  }

  try {
    const response = await axios.put(`http://192.168.0.16/usuarios/students/${id}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${authToken}`,
      },
    });
    console.log(response.data); 

    navigate(`/dashboard/users/usuarios-Trabajador/`);
  } catch (error) {
    console.error("Error al actualizar los datos del usuario:", error);
    setError("Hubo un error al actualizar. Por favor intenta nuevamente.");  // <- Establecer el mensaje de error aquí
  }

}
const handleInputChange = (event) => {
  const { name, value } = event.target;
  setEstudiante(prevEstudiante => ({
    ...prevEstudiante,
    user: { ...prevEstudiante.user, [name]: value }
  }));
}

const handleAvatarChange = (event) => {
  const file = event.target.files[0];
  setNewAvatar(file);
}

if (!estudiante) return <p>Cargando...</p>;
return (
  <div style={styles.container}>
    <div style={styles.card}>
      <h2 style={styles.title}>Editar Datos</h2>

      {estudiante.user.foto_perfil && <img src={estudiante.user.foto_perfil} alt="Foto de Perfil Actual" style={styles.currentAvatar} />}

      <form onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Nombre:</label>
          <input type="text" name="first_name" value={estudiante.user.first_name} onChange={handleInputChange} style={styles.whiteInput} />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Apellido:</label>
          <input type="text" name="last_name" value={estudiante.user.last_name || ''} onChange={handleInputChange} style={styles.whiteInput} />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Email:</label>
          <input type="email" name="email" value={estudiante.user.email} onChange={handleInputChange} style={styles.whiteInput} />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Grado:</label>
          <input type="text" name="grade" value={estudiante.grade} onChange={handleInputChange} style={styles.whiteInput} />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Cambiar Foto de Perfil:</label>
          <input type="file" accept="image/*" onChange={handleAvatarChange} style={styles.uploadButton} />
          {newAvatar &&
            <div style={styles.right}>
              <img src={URL.createObjectURL(newAvatar)} alt="Nuevo Avatar" style={styles.avatar} />
            </div>
          }
        </div>

        {error && <p style={styles.error}>{error}</p>}

        <button style={styles.saveButton} type="submit">
          💾 Guardar
        </button>
      </form>
    </div>
  </div>
);
}

const styles = {
  table: {
    // Tus otros estilos...
    borderCollapse: 'separate',
    borderSpacing: '0 1em', // Esto añade espacio entre filas
  },
  td: {
    // Tus otros estilos...
    borderBottom: '1px solid #ccc', // Esto añade
  },
  link: {
    display: 'inline-block',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '360px'
  },
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    height: '100vh',
    paddingTop: '50px'
  },
  card: {
    padding: '30px',
    borderRadius: '15px',
    backgroundColor: '#002855',
    color: 'white',
    width: '400px',
    textAlign: 'center',
  },
  title: {
    fontSize: '24px',
    marginBottom: '20px',
  },
  formGroup: {
    marginBottom: '15px',
    textAlign: 'left',
  },
  label: {
    fontSize: '18px',
    marginBottom: '5px',
  },
  avatar: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    marginTop: '10px',
  },
  error: {
    color: 'red',
    marginBottom: '10px',
  },
  saveButton: {
    marginTop: '25px',
    backgroundColor: 'white',
    color: '#002855',
    border: 'none',
    borderRadius: '7px',
    cursor: 'pointer',
    padding: '8px 16px',
    fontSize: '18px',
  },
  whiteInput: {
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    backgroundColor: 'white',
    color: 'black',
    fontSize: '16px',
  },
  uploadButton: {
    display: 'inline-block',
    padding: '8px 16px',
    borderRadius: '7px',
    cursor: 'pointer',
    background: '#002855',
    color: 'white',
    border: 'none',
    fontSize: '16px',
    textAlign: 'center',
    marginTop: '5px',
    outline: 'none',
    appearance: 'none',
    WebkitAppearance: 'none',
    MozAppearance: 'none',
  },
  currentAvatar: {
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    marginBottom: '15px'
  },
  right: {
    textAlign: 'right',
    marginTop: '10px',
  },
};

export default TrabajadorEdit;
