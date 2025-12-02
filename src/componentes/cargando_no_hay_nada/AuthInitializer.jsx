import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { inicializarAuth } from '../../store/authSlice';
import { cargarPreferencia } from '../../store/preferenciaSlice';

import { FaSpinner } from 'react-icons/fa';

export default function AuthInitializer({ children }) {
    const dispatch = useDispatch();
    const { inicializando, autenticado } = useSelector((state) => state.auth);

    useEffect(() => {
        // ✅ Verificar token solo una vez al montar la aplicación
        const inicializar = async () => {
            const result = await dispatch(inicializarAuth());
            
            // Si está autenticado, cargar preferencias
            if (result.payload?.autenticado) {
                await dispatch(cargarPreferencia());
            }
        };
        
        inicializar();
    }, [dispatch]); // ✅ Solo se ejecuta una vez

    // Mostrar pantalla de carga mientras inicializa
    if (inicializando) {
        return (
            <div className="fixed inset-0 bg-opacity-50 text-center
                            bg-white text-black dark:bg-gray-800 dark:text-white
                            flex flex-col items-center justify-center gap-2 
                            z-[9999] select-none">
                <FaSpinner className="animate-spin text-2xl md:text-3xl" />
                <p className="text-xl md:text-2xl font-bold">
                    Verificando sesión...
                </p>
            </div>
        );
    }

    return children;
}