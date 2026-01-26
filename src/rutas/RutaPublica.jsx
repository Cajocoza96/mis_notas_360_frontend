import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { hayRateLimitActivo } from "../services/authService"; // ✅ NUEVO

import useConexionInternet from "../hooks/useConexionInternet";

export default function RutaPublica({ children }) {
    const { autenticado, usuario } = useSelector((state) => state.auth);
    const location = useLocation();

    const { isOnline } = useConexionInternet();

    // ✅ CRÍTICO: Si hay rate limit activo, quedarse en la página pública
    if (hayRateLimitActivo()) {
        return children;
    }

    // Si está autenticado
    if (autenticado === true && isOnline) {

        // Si es primera vez (no vio bienvenida), ir a pagina-intro
        if (usuario && !usuario.vioBienvenida) {
            return <Navigate to="/pagina-intro" replace state={{ from: location }} />;
        }
        // Si ya vio bienvenida, ir al panel principal
        return <Navigate to="/panel-principal" replace state={{ from: location }} />;
    }

    // Si está autenticado pero no hay conexión, no redirigir
    if (autenticado === true && !isOnline) {
        return <Navigate to="/" replace state={{ from: location}} />
    }
    
    // Si no está autenticado, mostrar la página pública
    return children;
}