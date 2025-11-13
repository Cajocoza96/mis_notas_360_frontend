import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { verificarToken, obtenerToken } from "../services/authService";
import { iniciarVerificacionToken, finalizarVerificacionToken } from "../store/loadingSlice";

export default function RutaPublica({ children }) {
    const [autenticado, setAutenticado] = useState(null);
    const location = useLocation();
    const dispatch = useDispatch();

    useEffect(() => {
        const verificar = async () => {
            try {
                const token = obtenerToken();

                if (!token) {
                    setAutenticado(false);
                    return;
                }

                // ✅ Activar overlay global ANTES de verificar
                dispatch(iniciarVerificacionToken('Verificando sesión...'));

                await verificarToken();
                setAutenticado(true);

            } catch (error) {
                console.error('Error al verificar token:', error);
                setAutenticado(false);
            } finally {
                // ✅ Desactivar overlay después de verificar
                dispatch(finalizarVerificacionToken());
            }
        };

        verificar();
    }, [dispatch, location.pathname]);

    // Mientras verifica, NO renderiza nada
    // El overlay global se muestra sobre la ruta anterior
    if (autenticado === null) {
        return null;
    }

    // Si está autenticado, redirige a la página principal
    if (autenticado === true) {
        return <Navigate to="/panel-principal" replace state={{ from: location }} />;
    }

    // Si NO está autenticado, muestra la página pública
    return children;
}