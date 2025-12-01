import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { setVerToast, setMensajeToast } from '../../store/accesoSlice';
import useConexionInternet from '../../hooks/useConexionInternet';

export default function ConexionMonitor({ children }) {
    const dispatch = useDispatch();
    const location = useLocation();
    const { isOnline, justReconnected } = useConexionInternet();
    
    const toastTimeoutRef = useRef(null);
    const lastOfflineToastPath = useRef(null);
    const lastReconnectedToastPath = useRef(null);

    const mostrarToast = (mensaje) => {
        if (toastTimeoutRef.current) {
            clearTimeout(toastTimeoutRef.current);
        }

        dispatch(setMensajeToast(mensaje));
        dispatch(setVerToast(true));

        toastTimeoutRef.current = setTimeout(() => {
            dispatch(setVerToast(false));
        }, 3000);
    };

    // Monitorear conexión en cada cambio de ruta
    useEffect(() => {
        if (!isOnline && lastOfflineToastPath.current !== location.pathname) {
            mostrarToast("Sin conexion a internet");
            lastOfflineToastPath.current = location.pathname;
        }
    }, [location.pathname, isOnline]);

    // Monitorear reconexión (solo una vez por reconexión)
    useEffect(() => {
        if (isOnline && justReconnected && lastReconnectedToastPath.current !== location.pathname) {
            mostrarToast("Conexion a internet restablecida");
            lastReconnectedToastPath.current = location.pathname;
            // Resetear el flag de offline para futuras desconexiones
            lastOfflineToastPath.current = null;
        }
    }, [isOnline, justReconnected, location.pathname]);

    useEffect(() => {
        return () => {
            if (toastTimeoutRef.current) {
                clearTimeout(toastTimeoutRef.current);
            }
        };
    }, []);

    return children;
}