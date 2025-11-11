import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { verificarToken, obtenerToken } from "../services/authService";

import CargandoNoHayNada from "../componentes/cargando_no_hay_nada/CargandoNoHayNada";

export default function RutaPublica({ children }) {
    const [autenticado, setAutenticado] = useState(null);
    const [cargando, setCargando] = useState(true);
    const location = useLocation();

    useEffect(() => {
        const verificar = async () => {
            try {
                // Verificar si existe un token antes de validar
                const token = obtenerToken();

                if (!token) {
                    setAutenticado(false);
                    setCargando(false);
                    return;
                }

                await verificarToken();
                setAutenticado(true);
            } catch (error) {
                console.error('Error al verificar token:', error);
                setAutenticado(false);
            } finally {
                setCargando(false);
            }
        };

        verificar();
    }, [location.pathname]);

    if (cargando) {
        return (
            <CargandoNoHayNada
                pantallaCompletaCarga={true}
            />
        );
    }

    if (autenticado) {
        return <Navigate to="/" replace state={{ from: location }} />;
    }

    return children;
}