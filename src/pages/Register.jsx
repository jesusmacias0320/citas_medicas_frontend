import {useState} from 'react';
import { Link, useNavigate} from "react-router-dom";
import axios from 'axios';
import './Auth.css';

const Register = () => {
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        setError('');
        setSuccess('');

        try{
            const response = await axios.post('http://localhost:5000/api/users', {
                nombre,
                email,
                password, 
                rol: 'paciente' 
            });

            setSuccess('¡Usuario creado con exito!');

            setTimeout(() => {
                navigate('/login');
            }, 2000);

        }catch(err){
            setError(err.response?.data.error || 'Hubo un error en el servidor');
        }
    };

    return(
        <div className='auth-container'>
            <h1 className='auth-title'>Registro de Pacientes</h1>

            {error && <p className='msg-error'>{error}</p>}
            {success && <p className='msg-success'>{success}</p>}

            <form className="auth-form" onSubmit={handleSubmit}>
                <label> Nombre Completo:</label>
                <input 
                type="text"
                className='auth-input'
                placeholder = 'Escribe nombre completo'
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                />

                <label>Correo Electrónico:</label>
                <input
                 type="text" 
                 className='auth-input'
                 placeholder='ejemplo@corre.com'
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 required
                 />

                <label>Contraseña:</label>
                <input
                 type="text" 
                 className='auth-input'
                 placeholder='Mínimo 6 caracteres'
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 required
                 />

                 <button type='submit' className='auth-button'>
                    Registrarme
                 </button>
            </form>

            <Link to="/login" className='auth-link'>
            ¿Ya tienes cuenta? Inicia sesión
            </Link>
        </div>
    );
};



export default Register;