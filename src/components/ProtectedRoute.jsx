import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRole}) => {

    
    const token = localStorage.getItem('token');
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;

    if(!token) {
        return <Navigate to ="/login" replace/>
    }

    if(allowedRole && user.rol !== allowedRole){
        const redirectPath = user.rol === 'paciente' ? '/dashboard' : '/login';
        return <Navigate to={redirectPath} replace/>
    }

    return children;
};

export default ProtectedRoute;