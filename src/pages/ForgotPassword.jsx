import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import './Auth.css'

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try{
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/forgot-password`, { email });
            Swal.fire('¡Correo enviado!', response.data.message, 'success');
            setEmail('');
        }catch(error){
            Swal.fire('Error', error.response?.data?.error || 'No se pudo enviar el correo', 'error');
        }finally{
            setIsSubmitting(false);
        }

        };

        return (
            <div className="auth-container">
                <div className="auth-card">
                    <h2>Recuperar Contraseña</h2>
                    <p>Ingresa tu correo y te enviaremos un enlace seguro.</p>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Correo Electrónico:</label>
                            <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            />
                        </div>
                        <button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Enviando...' : 'Enviar Enlace'}
                        </button>
                    </form>
                </div>

            </div>
        );
    };

    export default ForgotPassword;
