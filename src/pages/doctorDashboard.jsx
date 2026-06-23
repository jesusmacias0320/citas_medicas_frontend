import { useEffect, useState } from "react";
import {useNavigate } from "react-router-dom";
import axios from "axios";
import './Dashboard.css';
import Swal from "sweetalert2";

const DoctorDashboard = () => {
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    
    
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;

    const fetchAgenda = async () => {
        if (!user) return;
        try{
           const token = localStorage.getItem('token');

            console.log("1. Enviando orden al servidor..."); // <-- Cámara 1
            
            await axios.patch(`${import.meta.env.VITE_API_URL}/appointments/${citaId}/status`,
                {estado: nuevoEstado },
                {headers: {Authorization: `Bearer ${token}`} }
            );

            console.log("2. El servidor respondió correctamente!");
            
            setAppointments(response.data.appointments || []);
        }catch(error){
            console.error("Error al cargar la agenda médica: ", error);
            alert("No se pudo cargar la agenda en este momento.");
        }finally{
            setLoading(false);
        }
    };

    
    const handleStatusChange = async (citaId, nuevoEstado) => {
        
        const result = await Swal.fire({
            title: `¿Cambiar a ${nuevoEstado}?`,
            text: "Se notificará al paciente sobre este cambio",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, confirmar',
            cancelButtonText: 'Volver'
        });

        if(!result.isConfirmed) return;

        try{
            const token = localStorage.getItem('token');

            
            await axios.patch(`${import.meta.env.VITE_API_URL}/appointments/${citaId}/status`,
                {estado: nuevoEstado },
                {headers: {Authorization: `Bearer ${token}`} }
            );
            
            setAppointments(prevAppointments => {
                console.log("ID que queremos cambiar:", citaId);
                
                return prevAppointments.map(cita => {
                    console.log("Revisando cita:", cita); 
                    
                    if (cita.id == citaId) {
                        console.log("¡Coincidencia encontrada! Actualizando pantalla...");
                        return { ...cita, estado: nuevoEstado };
                    }
                    return cita;
                });
            });

            Swal.fire({
                icon: 'success',
                title: '¡Actualizado!',
                text: `La cita ahora está ${nuevoEstado}.`,
                timer: 2000,
                showCancelButton: false
            });


        }catch(error){
            console.error("Error al actualizar el estado. ", error);
            Swal.fire({
                icon: 'error',
                title: 'No se pudo actualizar',
                text: error.response?.data?.error || 'Error al actualizar el estado de la cita.'
            });

        }
    };
    
    useEffect(() => {
        fetchAgenda();
    }, []);

    
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const citasActivas = appointments.filter(cita => 
        cita.estado.toLowerCase() === 'pendiente' || cita.estado.toLowerCase() === 'confirmada'
    );

    return(
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h2>Panel del Médico</h2>
                <button className="logout-button" onClick={handleLogout}>
                    Cerrar Sesión
                </button>
            </div>

            <div className="welcome-card">
                <h3>!Hola, {user ? user.nombre : 'Médico'}!</h3>
                <p>Bienvenido a tu agenda virtual. Aquí podrás ver a los pacientes tienes programados para hoy</p>
            </div>

            <div className="appointments-section">
                <h3>Mi Agenda de Turnos</h3>
                
                {loading ? (
                    <p>Cargando tus citas médicas...</p>
                ) : citasActivas.length === 0 ? (
                    <p>No tienes pacientes agendados en este momento.</p>
                ) : (
                    citasActivas.map((cita) => (
                        <div key={cita.id} className="appointment-card">
                            
                        
                            <div className="appointment-info">
                                <h4>Paciente: {cita.Paciente ? cita.Paciente.nombre : "Usuario no encontrado"}</h4>
                                <p><strong>Correo:</strong> {cita.Paciente?.email}</p>
                                <p><strong>Fecha:</strong> {cita.fecha} | <strong>Hora:</strong> {cita.hora}</p>
                            </div>
                            
                            
                            <div className="appointment-actions">
                                <span className={`status-badge status-${cita.estado.toLowerCase()}`}>
                                    {cita.estado.toUpperCase()}
                                </span>
                                
                                
                                {cita.estado.toLowerCase() === 'pendiente' && (
                                    <button 
                                        className="action-btn confirm-btn"
                                        onClick={() => handleStatusChange(cita.id, 'confirmada')}
                                    >
                                        Confirmar
                                    </button>
                                )}

                                 
                                 {(cita.estado.toLowerCase() === 'pendiente' || cita.estado.toLowerCase() === 'confirmada') && (
                                    <button 
                                        className="action-btn cancel-btn"
                                        onClick={() => handleStatusChange(cita.id, 'cancelada')}
                                    >
                                        Cancelar
                                    </button>
                                )}
                                
                                {(cita.estado.toLowerCase() === 'pendiente' || cita.estado.toLowerCase() === 'confirmada') && (
                                    <button 
                                        className="action-btn complete-btn"
                                        onClick={() => handleStatusChange(cita.id, 'completada')}
                                    >
                                        Completar
                                    </button>
                                )}
                            </div>

                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default DoctorDashboard;