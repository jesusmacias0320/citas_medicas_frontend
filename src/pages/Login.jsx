import { useState } from "react";
import { Link, useNavigate} from "react-router-dom";
import axios from 'axios';
import './Auth.css';


const Login = () => {
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [error, setError] = useState('');

   const navigate = useNavigate();

   const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); 

    try{
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/users/login`, {
            email,
            password
        });


        localStorage.setItem('token', response.data.token);

        localStorage.setItem('user', JSON.stringify(response.data.user));

        if(response.data.user.rol === 'medico'){
            navigate('/doctor-dashboard');
        }else{
            navigate('/dashboard'); 
        }

    }catch (err){
        setError(err.response?.data?.error || 'Error al intentar iniciar sesión');

    }
   };

   return (
    <div className="auth-container">
        <h1 className="auth-title"> Iniciar Sesión</h1>

        {error && <p className="msg-error"> {error}</p>}

        <form className="auth-form" onSubmit={handleSubmit}>
            <label> Correo Electrónico:</label>
            <input 
            type="email" 
            className="auth-input"
            placeholder="Ingresa tu usuario"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            />

            <label> Contraseña:</label>
            <input 
            type="password" 
            className="auth-input"
            placeholder="Ingresa tu contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            />
            <button type="submit" className="auth-button">
                Ingresar
            </button>
            <Link to="/forgot-password" className="auth-link" style={{ marginTop: '15px', display: 'block' }}>
                        ¿Olvidaste tu contraseña?
                    </Link>
        </form>
        <Link to="/register" className="auth-link">
        ¿No tienes cuenta? Regístrate aquí
        </Link>
    </div>
   )
};

export default Login;