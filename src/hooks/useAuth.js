import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
    cerrarSesion as cerrarSesionService, 
    eliminarCuenta as eliminarCuentaService
} from '../services/authService';
import { cerrarSesionLocal, actualizarUsuarioLocal } from '../store/authSlice';
import { 
    setVerModalEliminarUsuario, 
    setVerModalCerrarSesion,
    setVerToast 
} from '../store/accesoSlice';

export const useAuth = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    // ✅ Obtener datos del Redux store
    const { usuario, autenticado, inicializando } = useSelector((state) => state.auth);

    // Función para cerrar sesión
    const cerrarSesion = async () => {
        try {
            await cerrarSesionService();
            dispatch(cerrarSesionLocal());
            dispatch(setVerModalCerrarSesion(false));
            navigate('/iniciar-sesion');
            return { exito: true };
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            dispatch(cerrarSesionLocal());
            dispatch(setVerModalCerrarSesion(false));
            navigate('/iniciar-sesion');
            return { exito: false, error: error.message };
        }
    };

    // Función para eliminar cuenta
    const eliminarCuenta = async () => {
        try {
            await eliminarCuentaService();
            dispatch(cerrarSesionLocal());
            dispatch(setVerModalEliminarUsuario(false));
            navigate('/registrar');
            return { exito: true };
        } catch (error) {
            console.error('Error al eliminar cuenta:', error);
            dispatch(setVerModalEliminarUsuario(false));
            
            dispatch(setVerToast(true));
            setTimeout(() => {
                dispatch(setVerToast(false));
            }, 3000);
            
            return { exito: false, error: error.message };
        }
    };

    // Función para actualizar el usuario localmente
    const actualizarUsuario = (nuevosDatos) => {
        dispatch(actualizarUsuarioLocal(nuevosDatos));
    };

    return {
        usuario,
        cargando: inicializando,
        cerrarSesion,
        eliminarCuenta,
        actualizarUsuario,
        estaAutenticado: autenticado === true
    };
};