import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { 
    cerrarSesion as cerrarSesionService, 
    eliminarCuenta as eliminarCuentaService,
    obtenerUsuarioActual,
    verificarToken
} from '../services/authService';
import { 
    setVerModalEliminarUsuario, 
    setVerModalCerrarSesion,
    setVerToast 
} from '../store/accesoSlice';

export const useAuth = () => {
    const [usuario, setUsuario] = useState(null);
    const [cargando, setCargando] = useState(true);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Cargar información del usuario al montar el componente
    useEffect(() => {
        const cargarUsuario = async () => {
            try {
                const usuarioLocal = obtenerUsuarioActual();
                if (usuarioLocal) {
                    // Verificar que el token siga siendo válido
                    await verificarToken();
                    setUsuario(usuarioLocal);
                }
            } catch (error) {
                // Si el token no es válido, limpiar y redirigir
                cerrarSesionService();
                navigate('/iniciar-sesion');
            } finally {
                setCargando(false);
            }
        };

        cargarUsuario();
    }, [navigate]);

    // Función para cerrar sesión
    const cerrarSesion = async () => {
        try {
            await cerrarSesionService();
            dispatch(setVerModalCerrarSesion(false));
            setUsuario(null);
            navigate('/iniciar-sesion');
            return { exito: true };
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            // Aún así cerramos la sesión localmente
            dispatch(setVerModalCerrarSesion(false));
            setUsuario(null);
            navigate('/iniciar-sesion');
            return { exito: false, error: error.message };
        }
    };

    // Función para eliminar cuenta
    const eliminarCuenta = async () => {
        try {
            await eliminarCuentaService();
            dispatch(setVerModalEliminarUsuario(false));
            setUsuario(null);
            navigate('/registrar');
            return { exito: true };
        } catch (error) {
            console.error('Error al eliminar cuenta:', error);
            dispatch(setVerModalEliminarUsuario(false));
            
            // Mostrar toast con el error
            dispatch(setVerToast(true));
            setTimeout(() => {
                dispatch(setVerToast(false));
            }, 3000);
            
            return { exito: false, error: error.message };
        }
    };

    // Función para actualizar el usuario localmente
    const actualizarUsuario = (nuevosDatos) => {
        const usuarioActualizado = { ...usuario, ...nuevosDatos };
        setUsuario(usuarioActualizado);
        localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));
    };

    return {
        usuario,
        cargando,
        cerrarSesion,
        eliminarCuenta,
        actualizarUsuario,
        estaAutenticado: !!usuario
    };
};