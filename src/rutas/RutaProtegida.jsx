import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { verificarToken, obtenerToken } from "../services/authService";
import { cargarPreferencia } from "../store/preferenciaSlice";
import { iniciarVerificacionToken, finalizarVerificacionToken } from "../store/loadingSlice";

export default function RutaProtegida({ children }) {
    const [autenticado, setAutenticado] = useState(null);
    const location = useLocation();
    const dispatch = useDispatch();
    const [preferenciasCargadas, setPreferenciasCargadas] = useState(false);

    useEffect(() => {
        const verificar = async () => {
            try {
                const token = obtenerToken();

                if (!token) {
                    setAutenticado(false);
                    return;
                }

                // ✅ Activar overlay ANTES de verificar
                dispatch(iniciarVerificacionToken('Verificando sesión...'));

                await verificarToken();
                setAutenticado(true);

                // Cargar preferencias SOLO si aún no se han cargado
                if (!preferenciasCargadas) {
                    await dispatch(cargarPreferencia());
                    setPreferenciasCargadas(true);
                }

            } catch (error) {
                console.error('Error al verificar token:', error);
                setAutenticado(false);
            } finally {
                // ✅ Desactivar overlay después de verificar
                dispatch(finalizarVerificacionToken());
            }
        };

        verificar();
    }, [dispatch]);

    // ✅ Ya NO mostramos pantalla de carga aquí
    // El overlay global lo maneja

    if (autenticado === false) {
        return <Navigate to="/iniciar-sesion" replace state={{ from: location }} />;
    }

    if (autenticado === null) {
        // Mientras verifica, NO renderiza nada (el overlay se muestra sobre la ruta anterior)
        return null;
    }

    return children;
}