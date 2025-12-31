import { useRef, useCallback, useState } from 'react';

import { logDesarrollo, errorDesarrollo, registrarError } from "../utils/errorHandler";

/**
 * Hook personalizado para manejar reintentos inteligentes con backoff exponencial
 * Evita la acumulación de peticiones y respeta el rate limiting
 */
export default function useReintentoInteligente() {
    const reintentoRef = useRef(null);
    const intentosRef = useRef(0);
    const maxIntentosRef = useRef(3); // Máximo 3 intentos
    
    // ✅ Estado para rastrear intentos en tiempo real
    const [intentosActuales, setIntentosActuales] = useState(0);
    const [intentosAgotados, setIntentosAgotados] = useState(false);

    /**
     * Calcula el delay con backoff exponencial
     * Intento 1: 3 segundos
     * Intento 2: 6 segundos  
     * Intento 3: 12 segundos
     */
    const calcularDelay = (numeroIntento) => {
        return Math.min(3000 * Math.pow(2, numeroIntento - 1), 30000); // Max 30s
    };

    /**
     * Ejecuta la función con reintentos inteligentes
     * @param {Function} funcionReintento - Función async a ejecutar
     * @param {boolean} isOnline - Estado de conexión
     * @param {Function} onError - Callback cuando se agotan los reintentos (opcional)
     */
    const ejecutarConReintento = useCallback((funcionReintento, isOnline, onError) => {
        // Limpiar reintento previo
        if (reintentoRef.current) {
            clearTimeout(reintentoRef.current);
            reintentoRef.current = null;
        }

        // Si no hay internet o se agotaron los intentos, no reintentar
        if (!isOnline || intentosRef.current >= maxIntentosRef.current) {
            if (intentosRef.current >= maxIntentosRef.current) {
                setIntentosAgotados(true);
                if (onError) {
                    onError('Se agotaron los reintentos');
                }
            }
            return;
        }

        // Incrementar contador de intentos
        intentosRef.current += 1;
        const intentoActual = intentosRef.current;
        
        // ✅ Actualizar estado de intentos
        setIntentosActuales(intentoActual);
        
        const delay = calcularDelay(intentoActual);

        logDesarrollo(`Reintento ${intentoActual}/${maxIntentosRef.current} programado en ${delay/1000}s`);

        // Programar reintento
        reintentoRef.current = setTimeout(async () => {
            if (isOnline) {
                try {
                    await funcionReintento();
                    // Si tuvo éxito, resetear intentos
                    intentosRef.current = 0;
                    setIntentosActuales(0);
                    setIntentosAgotados(false);
                } catch (error) {
                    errorDesarrollo(`Reintento ${intentoActual} falló:`, error);
                    // Si falló, intentar de nuevo (recursivo)
                    ejecutarConReintento(funcionReintento, isOnline, onError);
                }
            }
        }, delay);
    }, []);

    /**
     * Resetea el contador de intentos
     * Útil cuando se recupera la conexión o se navega a otra página
     */
    const resetearIntentos = useCallback(() => {
        if (reintentoRef.current) {
            clearTimeout(reintentoRef.current);
            reintentoRef.current = null;
        }
        intentosRef.current = 0;
        setIntentosActuales(0);
        setIntentosAgotados(false);
    }, []);

    /**
     * Limpia todos los timeouts activos
     */
    const limpiar = useCallback(() => {
        if (reintentoRef.current) {
            clearTimeout(reintentoRef.current);
            reintentoRef.current = null;
        }
    }, []);

    /**
     * Obtiene el número de intentos actuales
     */
    const obtenerIntentos = useCallback(() => {
        return intentosRef.current;
    }, []);

    /**
     * Calcula los intentos restantes
     */
    const obtenerIntentosRestantes = useCallback(() => {
        return Math.max(0, maxIntentosRef.current - intentosRef.current);
    }, [intentosActuales]);

    return {
        ejecutarConReintento,
        resetearIntentos,
        limpiar,
        obtenerIntentos,
        obtenerIntentosRestantes,
        intentosActuales,
        intentosAgotados,
        maxIntentos: maxIntentosRef.current
    };
}