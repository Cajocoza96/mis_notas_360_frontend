import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export default function RutaProtegida({ children }) {
    const { autenticado } = useSelector((state) => state.auth);
    const location = useLocation();

    // Si no está autenticado, redirigir a login
    if (autenticado === false) {
        return <Navigate to="/iniciar-sesion" replace state={{ from: location }} />;
    }

    // Si está autenticado, mostrar el contenido
    return children;
}