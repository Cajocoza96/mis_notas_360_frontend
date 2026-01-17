import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import useConexionInternet from "../hooks/useConexionInternet";

export default function RutaIntro({ children}){
    const { usuario } = useSelector((state) => state.auth);
    const { isOnline } = useConexionInternet();

    // NO redirigir si no hay internet - permitir acceso offline
    if (!isOnline) {
        return children;
    }

    // Si el usuario ya vio la bienvenida, redirigir a /
    if (usuario?.vioBienvenida) {
        return <Navigate to="/" replace />;
    }

    return children;
}