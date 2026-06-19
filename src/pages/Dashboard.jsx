import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './Dashboard.css';
import Swal from "sweetalert2";

const Dashboard = () => {
    const navigate = useNavigate();

    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [medicos, setMedicos] = useState([]);

    const [showForm, setShowForm] = useState(false);
    const [doctorId, setDoctorId] = useState('');
    const [fecha, setFecha] = useState('');
    const [hora, setHora] = useState('');
    const [msg, setMsg] = useState({ text: '', type: ''});
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;

    const [availableSlots, setAvailableSlots] = useState([]);
    const [loadingSlots, setLoadingSlots] = useState(false);

    const fechaHoy = new Date().toISOString().split('T')[0];

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const fetchAppointments = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/appointments/my-appointments`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAppointments(response.data.appointments || []);
        } catch (err) { 
            console.error('Error al cargar las citas: ', err);
            if (err.response?.status === 401) {
                handleLogout();
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchMedicos = async() => {
        try{
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/doctors/lista`);
            setMedicos(response.data);

        }catch(error){
            console.error("Error al cargar los médicos", error);
        }
    };

    
    useEffect(() => {
        fetchAppointments();
        fetchMedicos();

    }, []); 

    useEffect(() => {
        const fetchAvailableSlots = async () => {
            
            if(doctorId && fecha) {
                setLoadingSlots(true);
                try{
                    const response = await axios.get(`${import.meta.env.VITE_API_URL}/appointments/available/${doctorId}/${fecha}`);
                    setAvailableSlots(response.data.availableSlots || []);
                }catch(error){
                    console.error("Error al cargar horarios disponibles", error);
                    setAvailableSlots([]);
                }finally{
                    setLoadingSlots(false);
                }
            }else{
                setAvailableSlots([]);
            }
        };
        fetchAvailableSlots();
        setHora(''); 
        }, [doctorId, fecha]); 


    
    const handleBookAppointment = async (e) => {
        e.preventDefault();
    
        if(!doctorId || !fecha || !hora) {
            Swal.fire({
                icon: 'warning',
                title: 'Datos incompletos',
                text: 'Por favor, selecciona el médico, la fecha y la hora.'
            });
            return;
        }

        setIsSubmitting(true); 

        try {
            const token = localStorage.getItem('token');
            await axios.post(`${import.meta.env.VITE_API_URL}/appointments/book`,
               { doctor_id: doctorId, fecha, hora },
               { headers: { Authorization: `Bearer ${token}` } } 
            );
            
            Swal.fire({
                icon: 'success',
                title: '¡Cita Agendada!',
                text: 'Tu cita ha sido agendada correctamente'
            });

            setShowForm(false);
            setDoctorId('');
            setFecha('');
            setHora('');

            await fetchAppointments();

            setTimeout(() => setMsg({text: '', type: ''}), 3000);

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'No se pudo agendar',
                text: error.response?.data?.error || 'Hubo un problema al procesar tu solicitud.',
                confirmButtonColor: '#d33'
            });
        } finally {
            setIsSubmitting(false); 
        }
    }


    const handleCancelAppointment = async (citaId) => {

        const result = await Swal.fire({
            title: '¿Cancelar cita?',
            text: "Esta acción no se puede deshacer.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, cancelar cita',
            cancelButtonText: 'No, mantenerla'
        });

        
        if(!result.isConfirmed) return;
        

        try{
            const token = localStorage.getItem('token');
            await axios.put(`${import.meta.env.VITE_API_URL}/appointments/cancel/${citaId}` ,
                {},
                {headers: {Authorization: `Bearer ${token}`} }
            );

            
            await fetchAppointments();

            //Swal de exito
            Swal.fire(
                'Cancelada',
                'Tu cita ha sido cancelada correctamente',
                'success'
            );

        }catch(error){
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Oops....',
                text: error.response?.data?.error || 'Hubo un error al cancelar la cita'
            });
        }
    };

    return (
        <div className="dashboard-container">

            
            <div className="dashboard-header">
                <h2>Panel de control</h2>
                <button className="logout-button" onClick={handleLogout}>
                    Cerrar Sesión
                </button>
            </div>

            
            <div className="welcome-card">
                <h3>¡Hola, {user ? user.nombre : 'Paciente'}!</h3>
                <p>Bienvenido a tu portal médico. Desde aquí podrás gestionar tus citas.</p>
                <p className="email-text">
                    Tu correo registrado es: {user ? user.email : 'No disponible'}
                </p>
            </div>

            <button
                className="toggle-form-btn"
                onClick={() => setShowForm(!showForm)}
            >
                {showForm ? 'Cancelar Agendamiento' : 'Agendar Nueva Cita'}
            </button>

            {showForm && (
                <div className="book-section">
                    <h3>Detalles de la Cita</h3>

                    {msg.text && (
                        <p className={`form-feedback ${msg.type === 'error' ? 'msg-error' : 'msg-success'}`}>
                            {msg.text}
                        </p>
                    )}
                    <form className="book-form" onSubmit={handleBookAppointment}>
                        <div className="form-group">
                            <label>Médico</label>
                            <select className="book-input" value={doctorId} onChange={(e) => setDoctorId(e.target.value)} required>
                                <option value="">Selecciona un médico...</option>
                                {medicos.map((medico) => (
                                    <option key={medico.id} value={medico.id}>
                                        {medico.User?.nombre} - {medico.especialidad}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Fecha</label>
                            <input type="date" className="book-input" value={fecha} onChange={(e) => setFecha(e.target.value)} min={fechaHoy} required />
                        </div>
                        <div className="form-group">
                            <label>Hora Disponible</label>
                            <select className="book-input" value={hora} onChange={(e) => setHora(e.target.value)} required disabled={!doctorId || !fecha || loadingSlots}>
                                <option value="">
                                    {loadingSlots ? "Buscando horarios..." :
                                    (!doctorId || !fecha) ? "Selecciona médico y fecha primero" :
                                    availableSlots.length === 0? "No hay turnos disponibles " :
                                    "Selecciona una hora..."}
                                </option>

                                {availableSlots.map((slot, index) => (
                                    <option key={index} value={slot}>
                                        
                                        {slot.substring(0, 5)}
                                    </option>
                                ))}
                            </select>
                            {doctorId && fecha && availableSlots.length === 0 && !loadingSlots && (
                                <p className="no-slots-msg">
                                    El médico no tiene agenda abierta o turnos libres para este día.
                                </p>
                            )}
                        </div>

                        <button type="submit" className="book-button" disabled={isSubmitting}>
                            {isSubmitting ? 'Agendando...' : 'Confirmar Cita'}
                        </button>
                    </form>
                </div>
            )}

            {/* SECCIÓN DEL HISTORIAL DE CITAS */}
            <div className="appointments-section">
                <h3>Mis Citas Médicas</h3>
                <br />
                
                {loading ? (
                    <p>Cargando tu historial...</p>
                ) : appointments.length === 0 ? (
                    <p>No tienes citas agendadas aún. ¡Estás al día!</p>
                ) : (
                    appointments.map((cita) => (
                        <div key={cita.id} className="appointment-card">
                            <div className="appointment-info">
                                <h4>Fecha: {cita.fecha}</h4>
                                <p>Hora: {cita.hora}</p>
                            </div>
                            <div>
                                <span className={`status-badge status-${cita.estado}`}>
                                    {cita.estado}
                                </span>
                                {cita.estado.toLowerCase() === 'pendiente' && (
                                    <button className="cancel-btn"
                                onClick={() => handleCancelAppointment(cita.id)}
                                >
                                Cancelar
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

export default Dashboard;