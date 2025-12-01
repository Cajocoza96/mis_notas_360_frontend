/**
 * Determina si estamos en modo desarrollo
 * Vite usa import.meta.env.MODE
 */
const esDesarrollo = () => {
    return import.meta.env.MODE === 'development';
};

/**
 * Muestra console.log solo en desarrollo
 */
export const logDesarrollo = (...args) => {
    if (esDesarrollo()) {
        console.log(...args);
    }
};

/**
 * Muestra console.error solo en desarrollo
 */
export const errorDesarrollo = (...args) => {
    if (esDesarrollo()) {
        console.error(...args);
    }
};

/**
 * Obtiene un mensaje de error seguro para mostrar al usuario
 * 🔥 CAMBIO: Ahora siempre muestra el mensaje del backend si existe
 */
export const obtenerMensajeError = (error, mensajeGenerico = 'Ocurrió un error') => {
    // Si el error tiene un mensaje, lo mostramos (viene del backend)
    if (error?.message) {
        return error.message;
    }
    
    // Si no hay mensaje específico, usamos el genérico
    return mensajeGenerico;
};

/**
 * Registra un error de forma segura
 * En desarrollo: console.error completo
 * En producción: silencioso o enviar a servicio de logging
 */
export const registrarError = (contexto, error) => {
    if (esDesarrollo()) {
        console.error(`[${contexto}]`, error);
    } else {
        // En producción, aquí podrías enviar a un servicio como Sentry
        // Por ahora solo registramos de forma silenciosa
        console.error(`Error en ${contexto}`); // Solo el contexto, sin detalles
    }
};