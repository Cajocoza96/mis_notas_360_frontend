import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { cerrarSesionLocal } from '../store/authSlice';
import { logDesarrollo } from '../utils/errorHandler';

/**
 * Hook para sincronizar autenticación entre pestañas
 * Detecta cambios en localStorage y sincroniza el estado
 */
export const useSyncAuth = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const { autenticado } = useSelector((state) => state.auth);
    
    // Ref para evitar loops infinitos
    const procesandoCambio = useRef(false);

    useEffect(() => {
        const handleStorageChange = (e) => {
            // Ignorar si ya estamos procesando un cambio
            if (procesandoCambio.current) return;

            // Solo procesar cambios del token
            if (e.key === 'token') {
                procesandoCambio.current = true;

                // CASO 1: Token eliminado (cierre de sesión o eliminación de cuenta)
                if (!e.newValue && e.oldValue) {
                    logDesarrollo('🔄 Sesión cerrada en otra pestaña, sincronizando...');
                    
                    // Limpiar Redux
                    dispatch(cerrarSesionLocal());
                    
                    // Redirigir a inicio y recargar
                    navigate('/');
                    setTimeout(() => {
                        window.location.reload();
                    }, 100);
                }

                // CASO 2: Token nuevo o cambiado (login o cambio de cuenta)
                else if (e.newValue && e.newValue !== e.oldValue) {
                    logDesarrollo('🔄 Nueva sesión iniciada en otra pestaña, sincronizando...');
                    
                    // Si estábamos autenticados con otra cuenta, limpiar primero
                    if (autenticado) {
                        dispatch(cerrarSesionLocal());
                    }
                    
                    // Redirigir a inicio y recargar para cargar la nueva sesión
                    navigate('/');
                    setTimeout(() => {
                        window.location.reload();
                    }, 100);
                }

                // Resetear flag después de procesar
                setTimeout(() => {
                    procesandoCambio.current = false;
                }, 500);
            }
        };

        // Escuchar cambios en localStorage desde otras pestañas
        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [navigate, dispatch, autenticado, location.pathname]);
};