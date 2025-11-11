import { useState, useEffect } from 'react';

export default function useConexionInternet() {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [wasOffline, setWasOffline] = useState(false);
    const [justReconnected, setJustReconnected] = useState(false);
    const [timeOffline, setTimeOffline] = useState(0);

    useEffect(() => {
        let offlineTimer = null;

        const handleOnline = () => {
            if (!isOnline) {
                // Solo marcar como reconectado si realmente estaba offline
                setJustReconnected(true);
                setWasOffline(true);
                
                // Limpiar el timer de tiempo offline
                if (offlineTimer) {
                    clearInterval(offlineTimer);
                    offlineTimer = null;
                }
            }
            setIsOnline(true);
        };

        const handleOffline = () => {
            setIsOnline(false);
            setWasOffline(true);
            setJustReconnected(false);
            setTimeOffline(0);
            
            // Iniciar contador de tiempo offline
            offlineTimer = setInterval(() => {
                setTimeOffline(prev => prev + 1);
            }, 1000);
        };

        // Verificar conexión inicial
        if (!navigator.onLine) {
            handleOffline();
        }

        // Agregar event listeners
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // Limpiar event listeners y timer
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
            if (offlineTimer) {
                clearInterval(offlineTimer);
            }
        };
    }, [isOnline]);

    // Función para resetear el estado de reconexión
    const resetReconnectionState = () => {
        setJustReconnected(false);
        setWasOffline(false);
        setTimeOffline(0);
    };

    return { 
        isOnline, 
        wasOffline, 
        justReconnected, 
        timeOffline,
        resetReconnectionState 
    };
}