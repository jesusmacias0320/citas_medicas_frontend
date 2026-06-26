import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import './Auth.css';

const ResetPassword = () => {

    const { token } = useParams();
    const navigate = useNavigate();

    const [passwords, setPasswords] = useState({
        newPassword: '',
        confirmPassword: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setPasswords({
            ...passwords,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(passwords.newPassword !== passwords.confirmPassword) {
            return Swal.fire({
                icon: 'error',
                title: 'Las contraseñas no coinciden',
                text: 'Por favor, verifica que escribiste la misma contraseña en ambos campos'
            });
        }
        setIsSubmitting(true);

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/reset-password/${token}`, {
                newPassword: passwords.newPassword
            });
            
            Swal.fire({
                icon: 'success',
                title: '¡Contraseña Actualizada!',
                text: response.data.message
            }).then(() => {
                navigate('/login'); 
            });

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error de validación',
                text: error.response?.data?.error || 'El enlace caducó o es inválido.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };
    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Crea tu nueva contraseña</h2>
                <p>Ingresa una clave segura que no vayas a olvidar.</p>
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Nueva Contraseña:</label>
                        <input 
                            type="password" 
                            name="newPassword" 
                            value={passwords.newPassword} 
                            onChange={handleChange} 
                            required 
                            minLength="6"
                            placeholder="Mínimo 6 caracteres"
                            autoComplete="new-password"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Confirmar Contraseña:</label>
                        <input 
                            type="password" 
                            name="confirmPassword" 
                            value={passwords.confirmPassword} 
                            onChange={handleChange} 
                            required 
                            minLength="6"
                            placeholder="Repite tu contraseña"
                            autoComplete="new-password"
                        />
                    </div>
                    
                    <button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Guardando...' : 'Guardar Contraseña'}
                    </button>
                </form>
            </div>
        </div>
    );  
};

export default ResetPassword;
