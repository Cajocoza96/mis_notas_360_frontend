import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export default function RequiereBienvenida({ children }) {
    const { usuario, autenticado } = useSelector((state) => state.auth);
    const location = useLocation();

    // Si está autenticado y NO ha visto la bienvenida
    if (autenticado && usuario && !usuario.vioBienvenida) {
        // Si ya está en /pagina-intro, permitir acceso
        if (location.pathname === "/pagina-intro") {
            return children;
        }
        
        // Si intenta ir a cualquier otra ruta, redirigir a /pagina-intro
        return <Navigate to="/pagina-intro" replace />;
    }

    // Si ya vio la bienvenida o no está autenticado, permitir acceso normal
    return children;
}