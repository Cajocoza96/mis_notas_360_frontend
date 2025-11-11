import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { verificarToken, obtenerToken } from "../services/authService";
import { cargarPreferencia } from "../store/preferenciaSlice";

import CargandoNoHayNada from "../componentes/cargando_no_hay_nada/CargandoNoHayNada";

export default function RutaProtegida({ children }) {

    const [autenticado, setAutenticado] = useState(null);
    const [cargando, setCargando] = useState(true);
    const location = useLocation();
    const dispatch = useDispatch();

    const [preferenciasCargadas, setPreferenciasCargadas] = useState(false);

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

                // ✅ Cargar preferencias SOLO si aún no se han cargado
                if (!preferenciasCargadas) {
                    await dispatch(cargarPreferencia());
                    setPreferenciasCargadas(true);
                }

            } catch (error) {
                console.error('Error al verificar token:', error);
                setAutenticado(false);
            } finally {
                setCargando(false);
            }
        };

        verificar();
    }, [dispatch]);

    if (cargando) {
        return (
            <CargandoNoHayNada
                pantallaCompletaCarga={true}
            />
        );
    }

    if (!autenticado) {
        return <Navigate to="/iniciar-sesion" replace state={{ from: location }} />;
    }

    return children;
}