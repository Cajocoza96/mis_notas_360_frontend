import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import useConexionInternet from "../hooks/useConexionInternet";

export default function RutaPrincipal({ children }) {
    const { usuario } = useSelector((state) => state.auth);
    const { isOnline } = useConexionInternet();

    // NO redirigir si no hay internet - permitir acceso offline
    if (!isOnline) {
        return children;
    }

    // Si es la primera vez, redirigir a /pagina-intro
    if (usuario && !usuario.vioBienvenida) {
        return <Navigate to="/pagina-intro" replace />;
    }

    return children;
}