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
                setJustReconnected(true);
                setWasOffline(true);
                
                if (offlineTimer) {
                    clearInterval(offlineTimer);
                    offlineTimer = null;
                }
                
                // Resetear justReconnected después de un tiempo
                setTimeout(() => {
                    setJustReconnected(false);
                }, 100);
            }
            setIsOnline(true);
        };

        const handleOffline = () => {
            setIsOnline(false);
            setWasOffline(true);
            setJustReconnected(false);
            setTimeOffline(0);
            
            offlineTimer = setInterval(() => {
                setTimeOffline(prev => prev + 1);
            }, 1000);
        };

        if (!navigator.onLine) {
            handleOffline();
        }

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
            if (offlineTimer) {
                clearInterval(offlineTimer);
            }
        };
    }, [isOnline]);

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