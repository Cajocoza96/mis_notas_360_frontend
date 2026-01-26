import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { inicializarAuth, cerrarSesionLocal } from '../../store/authSlice';
import { cargarPreferencia } from '../../store/preferenciaSlice';
import { hayRateLimitActivo } from '../../services/authService'; // ✅ NUEVO

import { HiOutlineBookOpen } from 'react-icons/hi';
import { FaSpinner } from 'react-icons/fa';

export default function AuthInitializer({ children }) {
    const dispatch = useDispatch();
    const { inicializando, autenticado } = useSelector((state) => state.auth);

    useEffect(() => {
        // ✅ CRÍTICO: Verificar token solo si NO hay rate limit activo
        const inicializar = async () => {
            // Si hay rate limit activo, cerrar sesión y NO intentar verificar
            if (hayRateLimitActivo()) {
                dispatch(cerrarSesionLocal());
                return;
            }

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
                            bg-white dark:bg-gray-800 text-black dark:text-white
                            flex flex-col items-center justify-center gap-3 
                            z-[9999] select-none">
                <div className="flex flex-row items-center gap-2">
                    <div>
                        <HiOutlineBookOpen className="text-2xl md:text-3xl" />
                    </div>
                    <p className="w-full text-center text-lg md:text-xl
                                            font-bold select-none truncate" translate="no">
                        MisNotas360
                    </p>
                </div>
                <FaSpinner className="animate-spin text-lg md:text-xl" />
            </div>
        );
    }

    return children;
}