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

import { logDesarrollo, errorDesarrollo, registrarError } from "../utils/errorHandler";

export const useAuth = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    //  Obtener datos del Redux store
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
            //  Registrar el error de forma segura
            registrarError('Cerrar sesión', error);

            // Cerrar sesión localmente de todas formas
            dispatch(cerrarSesionLocal());
            dispatch(setVerModalCerrarSesion(false));
            navigate('/iniciar-sesion');

            //  Retornar mensaje de error seguro
            return {
                exito: false,
                error: obtenerMensajeError(error, 'Error al cerrar sesión')
            };
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
            //  Registrar el error de forma segura
            registrarError('Eliminar cuenta', error);

            dispatch(setVerModalEliminarUsuario(false));

            //  Mostrar mensaje de error seguro al usuario
            const mensajeSeguro = obtenerMensajeError(
                error,
                'Error al eliminar la cuenta. Por favor intenta más tarde'
            );
            dispatch(setMensajeToast(mensajeSeguro));
            dispatch(setVerToast(true));

            setTimeout(() => {
                dispatch(setVerToast(false));
            }, 3000);

            return {
                exito: false,
                error: mensajeSeguro
            };
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