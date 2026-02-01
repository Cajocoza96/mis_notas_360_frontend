import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import useConexionInternet from "../hooks/useConexionInternet";

export default function RutaPublica({ children }) {
    const { autenticado, usuario } = useSelector((state) => state.auth);
    const location = useLocation();

    const { isOnline } = useConexionInternet();

    // Si está autenticado
    if (autenticado === true && isOnline) {

        // Si es primera vez (no vio bienvenida), ir a pagina-intro
        if (usuario && !usuario.vioBienvenida) {
            return <Navigate to="/pagina-intro" replace state={{ from: location }} />;
        }
        // Si ya vio bienvenida, ir al panel principal
        return <Navigate to="/" replace state={{ from: location }} />;
    }


    // Si está autenticado pero no hay conexión, no redirigir
    // Esto previene el loop infinito cuando pierdes conexión
    if (autenticado === true && !isOnline) {
        // Permitir que se quede en la página actual (login/registro)
        // o redirigir a una página offline específica
        return <Navigate to="/" replace state={{ from: location}} />
    }
    // Si no está autenticado, mostrar la página pública
    return children;
}