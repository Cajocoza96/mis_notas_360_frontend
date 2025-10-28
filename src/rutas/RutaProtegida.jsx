import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { verificarToken, obtenerToken } from "../services/authService";

export default function RutaProtegida({ children }) {
    const [autenticado, setAutenticado] = useState(null);
    const [cargando, setCargando] = useState(true);
    const location = useLocation();

    useEffect(() => {
        const verificar = async () => {
            try {
                // Verificar si existe un token antes de validar
                const token = obtenerToken();
                
                if (!token) {
                    setAutenticado(false);
                    setCargando(false);
                    return;
                }

                await verificarToken();
                setAutenticado(true);
            } catch (error) {
                console.error('Error al verificar token:', error);
                setAutenticado(false);
            } finally {
                setCargando(false);
            }
        };

        verificar();
    }, [location.pathname]);

    if (cargando) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-white dark:bg-gray-800">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-300 text-lg">Verificando sesión...</p>
                </div>
            </div>
        );
    }

    if (!autenticado) {
        return <Navigate to="/iniciar-sesion" replace state={{ from: location }} />;
    }

    return children;
}