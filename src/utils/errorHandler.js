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
 * En desarrollo: muestra el error real
 * En producción: muestra mensaje genérico
 */
export const obtenerMensajeError = (error, mensajeGenerico = 'Ocurrió un error') => {
    if (esDesarrollo()) {
        return error.message || error.toString();
    }
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