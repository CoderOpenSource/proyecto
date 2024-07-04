import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './../../AuthContext';

function PadreEdit() {
    const { id } = useParams();
    const [parent, setParent] = useState({ user: {}, children: [], childrenDetails: [] });
    const [allStudents, setAllStudents] = useState([]);
    const [selectedChildren, setSelectedChildren] = useState([]);
    const [newAvatar, setNewAvatar] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { authToken } = useAuth();

    // Cargar los detalles del padre y los estudiantes
    useEffect(() => {
        const fetchParentAndStudents = async () => {
            try {
                const parentRes = await axios.get(`http://192.168.1.25/usuarios/parents/${id}/`, {
                    headers: { 'Authorization': `Bearer ${authToken}` },
                });
                console.log('Parent Response:', parentRes.data); // Log to check the data
    
                const childrenResponses = await Promise.all(
                    parentRes.data.children.map(childId => 
                        axios.get(`http://192.168.1.25/usuarios/students/${childId}/`)
                    )
                );
                const childrenDetails = childrenResponses.map(resp => resp.data);
                console.log('Children Details:', childrenDetails); // Log to check the data
    
                setParent({
                    ...parentRes.data,
                    childrenDetails, // Assuming this is the correct structure
                });
    
                const studentsRes = await axios.get('http://192.168.1.25/usuarios/students/', {
                    headers: { 'Authorization': `Bearer ${authToken}` },
                });
                console.log('All Students:', studentsRes.data); // Log to check the data
                setAllStudents(studentsRes.data);
    
            } catch (error) {
                console.error("Error fetching data:", error);
                setError("Error fetching data.");
            }
        };
    
        fetchParentAndStudents();
    }, [id, authToken]);
    

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('user.first_name', parent.user.first_name);
        formData.append('user.last_name', parent.user.last_name);
        formData.append('user.email', parent.user.email);
        console.log(selectedChildren);
        selectedChildren.forEach(childId => {
            formData.append('children', childId);
        });
        if (newAvatar) {
            formData.append('user.foto_perfil', newAvatar, newAvatar.name);
        }

        try {
            await axios.put(`http://192.168.1.25/usuarios/parents/${id}/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${authToken}`,
                },
            });
            navigate(`/dashboard/users/usuarios-padre/`);
        } catch (error) {
            console.error("Error al actualizar los datos del padre:", error);
            setError("Hubo un error al actualizar. Por favor intenta nuevamente.");
        }
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setParent(prevParent => ({
            ...prevParent,
            user: { ...prevParent.user, [name]: value }
        }));
    };

    const handleSelectStudent = (event) => {
        const childId = parseInt(event.target.value);
        setSelectedChildren(prevSelectedChildren => {
          if (prevSelectedChildren.includes(childId)) {
            // If child is already selected, remove them
            return prevSelectedChildren.filter(id => id !== childId);
          } else {
            // Otherwise, add the new child
            return [...prevSelectedChildren, childId];
          }
        });
      };
      

    const handleAvatarChange = (event) => {
        const file = event.target.files[0];
        setNewAvatar(file);
    };

    if (!parent.user || allStudents.length === 0) return <p>Cargando...</p>;
    return (
        <div style={styles.container}>
          <div style={styles.card}>
            <h2 style={styles.title}>Editar Datos del Padre</h2>
      
            {parent.user.foto_perfil && (
              <img
                src={parent.user.foto_perfil}
                alt="Foto de Perfil Actual"
                style={styles.currentAvatar}
              />
            )}
      
            <form onSubmit={handleSubmit}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Nombre:</label>
                <input
                  type="text"
                  name="first_name"
                  value={parent.user.first_name}
                  onChange={handleInputChange}
                  style={styles.whiteInput}
                />
              </div>
      
              <div style={styles.formGroup}>
                <label style={styles.label}>Apellido:</label>
                <input
                  type="text"
                  name="last_name"
                  value={parent.user.last_name || ''}
                  onChange={handleInputChange}
                  style={styles.whiteInput}
                />
              </div>
      
              <div style={styles.formGroup}>
                <label style={styles.label}>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={parent.user.email}
                  onChange={handleInputChange}
                  style={styles.whiteInput}
                />
              </div>
      
              <div style={styles.formGroup}>
                <label style={styles.label}>Cambiar Foto de Perfil:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  style={styles.uploadButton}
                />
                {newAvatar && (
                  <div style={styles.right}>
                    <img
                      src={URL.createObjectURL(newAvatar)}
                      alt="Nuevo Avatar"
                      style={styles.avatar}
                    />
                  </div>
                )}
              </div>
              <div style={styles.formGroup}>
  <label style={styles.label}>Hijos Asignados:</label>
  {parent.children.length > 0 ? (
    parent.children.map(childId => {
      const child = allStudents.find(student => student.user.id === childId);
      console.log(`Child ID: ${childId}, found:`, child); // This will log whether each child was found
      return child ? (
        <div key={childId}>
          {child.user.first_name} {child.user.last_name}
        </div>
      ) : null;
    })
  ) : (
    <p>No hay hijos asignados.</p>
  )}
</div>


          <div style={styles.formGroup}>
                <label style={styles.label}>Seleccionar Hijos:</label>
                <select value={[]} onChange={handleSelectStudent}>
  {allStudents.map(student => (
    <option key={student.id} value={student.id}>
      {student.user.first_name} {student.user.last_name}
    </option>
  ))}
</select>

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

export default PadreEdit;
