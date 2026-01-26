import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { hayRateLimitActivo } from "../services/authService"; // ✅ NUEVO

export default function RutaProtegida({ children }) {
    const { autenticado } = useSelector((state) => state.auth);
    const location = useLocation();

    // ✅ CRÍTICO: Si hay rate limit activo, redirigir a login
    if (hayRateLimitActivo()) {
        return <Navigate to="/iniciar-sesion" replace state={{ from: location }} />;
    }

    // Si no está autenticado, redirigir a login
    if (autenticado === false) {
        return <Navigate to="/iniciar-sesion" replace state={{ from: location }} />;
    }

    // Si está autenticado, mostrar el contenido
    return children;
}