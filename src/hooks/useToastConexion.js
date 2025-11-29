import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { setVerToast, setMensajeToast } from '../store/accesoSlice';
import useConexionInternet from './useConexionInternet';

export default function useToastConexion() {
    const dispatch = useDispatch();
    const { isOnline, justReconnected } = useConexionInternet();
    
    const toastTimeoutRef = useRef(null);
    const hasShownOfflineToast = useRef(false);
    const hasShownReconnectedToast = useRef(false);

    const mostrarToast = (mensaje) => {
        // Limpiar timeout anterior si existe
        if (toastTimeoutRef.current) {
            clearTimeout(toastTimeoutRef.current);
        }

        dispatch(setMensajeToast(mensaje));
        dispatch(setVerToast(true));

        toastTimeoutRef.current = setTimeout(() => {
            dispatch(setVerToast(false));
        }, 3000);
    };

    // Efecto para manejar cambios de conexión
    useEffect(() => {
        if (!isOnline && !hasShownOfflineToast.current) {
            mostrarToast("Sin conexion a internet");
            hasShownOfflineToast.current = true;
            hasShownReconnectedToast.current = false;
        } else if (isOnline && justReconnected && !hasShownReconnectedToast.current) {
            mostrarToast("Conexion a internet restablecida");
            hasShownReconnectedToast.current = true;
            hasShownOfflineToast.current = false;
        }
    }, [isOnline, justReconnected]);

    // Limpiar timeout al desmontar
    useEffect(() => {
        return () => {
            if (toastTimeoutRef.current) {
                clearTimeout(toastTimeoutRef.current);
            }
        };
    }, []);

    // Retornar la función mostrarToast por si se necesita usar para otros propósitos
    return { mostrarToast, isOnline };
}