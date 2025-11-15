import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export default function RutaPublica({ children }) {
    const { autenticado } = useSelector((state) => state.auth);
    const location = useLocation();

    // Si está autenticado, redirigir al panel principal
    if (autenticado === true) {
        return <Navigate to="/panel-principal" replace state={{ from: location }} />;
    }

    // Si no está autenticado, mostrar la página pública
    return children;
}