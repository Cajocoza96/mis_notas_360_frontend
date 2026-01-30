const API_URL = import.meta.env.VITE_API_URL;

import { logDesarrollo, errorDesarrollo, registrarError } from "../utils/errorHandler";

import { fetchConAuth } from "./authService";

// ===============================
//  HELPER: Maneja errores de las peticiones HTTP
// Esta versión trabaja con errores que ya vienen de fetchConAuth
// ===============================
const procesarError = (error, mensajeGenerico) => {
    // 1️⃣ Si es rate limit de sesión (429 general - 200 req/15min)
    // Este ya fue manejado en authService (cerró sesión automáticamente)
    if (error.message === 'RATE_LIMIT_SESSION_CLOSED') {
        throw error; // Propagar sin modificar
    }

    // 2️⃣ Si es rate limit específico (favoritos, crear, editar)
    // El error ya tiene el mensaje del backend desde fetchConAuth
    if (error.message && (
        error.message.includes('Límite') ||
        error.message.includes('límite') ||
        error.message.includes('Rate limit')
    )) {
        //  Mostrar en consola para debugging
        errorDesarrollo('🚫 Rate Limit:', error.message);
        logDesarrollo('📛 Error de rate limit detectado');

        //  Crear error con código para que Cabecera lo detecte
        const rateLimitError = new Error(error.message);
        rateLimitError.code = 'RATE_LIMIT_EXCEEDED';
        rateLimitError.status = 429;
        throw rateLimitError;
    }

    // 3️⃣ Para otros errores de sesión
    if (error.message && (
        error.message.includes('sesión') ||
        error.message.includes('Sesión')
    )) {
        throw error; // Ya manejado en authService
    }

    // 4️⃣ Otros errores - usar mensaje genérico
    if (import.meta.env.MODE === 'development') {
        errorDesarrollo(`❌ Error: ${error.message}`);
    }

    // Si el error no tiene un mensaje útil, usar el genérico
    if (!error.message || error.message === 'Failed to fetch') {
        error.message = mensajeGenerico;
    }

    throw error;
};

//Obtiene el token de autenticación del localStorage
const obtenerToken = () => {
    return localStorage.getItem('token');
};

//Obtiene los contadores de notas por estado
export const obtenerContadores = async () => {
    try {
        const token = obtenerToken();

        logDesarrollo('📤 Obteniendo contadores:');

        const response = await fetchConAuth(`${API_URL}/anotaciones/contadores`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        //  fetchConAuth ya verificó que response.ok === true
        const data = await response.json();

        logDesarrollo(' Contadores obtenidos:', data);

        return data;
    } catch (error) {
        registrarError('obtenerContadores', error);
        procesarError(error, 'Error al obtener contadores');
        //throw error;
    }
};

//Obtiene todas las anotaciones activas (no eliminadas)
export const obtenerAnotaciones = async () => {
    try {
        const token = obtenerToken();

        logDesarrollo('📤 Obteniendo notas:');

        const response = await fetchConAuth(`${API_URL}/anotaciones/obtener`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        //  fetchConAuth ya verificó que response.ok === true
        const data = await response.json();

        logDesarrollo(' Notas obtenidas:', data);

        return data.anotaciones;
    } catch (error) {
        registrarError('obtenerAnotaciones', error);
        procesarError(error, 'Error al obtener notas');
    }
};

//Obtiene todas las anotaciones eliminadas (papelera)
export const obtenerAnotacionesEliminadas = async () => {
    try {
        const token = obtenerToken();

        logDesarrollo('📤 Obteniendo notas eliminadas:');

        const response = await fetchConAuth(`${API_URL}/anotaciones/obtener-papelera`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        //  fetchConAuth ya verificó que response.ok === true
        const data = await response.json();

        logDesarrollo(' Notas eliminadas obtenidas:', data);

        return data.anotaciones;
    } catch (error) {
        registrarError('obtenerAnotacionesEliminadas', error);
        procesarError(error, 'Error al obtener notas eliminadas');
    }
};

// Actualizar estado de favorito de una anotación
export const actualizarFavorito = async (anotacionId, favorito) => {
    try {
        const token = obtenerToken();

        logDesarrollo('📤 Asignando como favorita la nota:', anotacionId, favorito);

        const response = await fetchConAuth(`${API_URL}/anotaciones/favorito/${anotacionId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ favorito })
        });

        //  fetchConAuth ya verificó que response.ok === true
        const data = await response.json();

        logDesarrollo(' Nota asignada como favorita:', data);

        return data;
    } catch (error) {
        registrarError('actualizarFavorito', error);
        procesarError(error, 'Error al actualizar favorito');
    }
};

//Mueve una anotación a la papelera (soft delete)
export const moverAPapelera = async (id) => {
    try {
        const token = obtenerToken();

        logDesarrollo('📤 En proceso de mover nota a papelera:', id);

        const response = await fetchConAuth(`${API_URL}/anotaciones/papelera/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        //  fetchConAuth ya verificó que response.ok === true
        const data = await response.json();

        logDesarrollo(' Nota movida a papelera:', data);

        return data;
    } catch (error) {
        registrarError('moverAPapelera', error);
        procesarError(error, 'Error al mover a papelera');
    }
};

// Mover múltiples anotaciones a papelera
export const moverTodasAPapelera = async (anotacionesIds, aplicarFiltros = false) => {
    try {
        const token = obtenerToken();

        logDesarrollo('📤 En proceso de mover notas a papelera:', { anotacionesIds, aplicarFiltros });

        const response = await fetchConAuth(`${API_URL}/anotaciones/obtener/mover-todas-papelera`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ anotacionesIds, aplicarFiltros })
        });

        //  fetchConAuth ya verificó que response.ok === true
        const data = await response.json();

        logDesarrollo(' Notas movidas a papelera:', data);

        return data;
    } catch (error) {
        registrarError('moverTodasAPapelera', error);
        procesarError(error, 'Error al mover todas a papelera');
    }
};

//Restaura una anotación desde la papelera
export const restaurarDesdePapelera = async (anotacionId) => {
    try {
        const token = obtenerToken();

        logDesarrollo('📤 En proceso de restaurar la nota:', anotacionId);

        const response = await fetchConAuth(`${API_URL}/anotaciones/restaurar/${anotacionId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        //  fetchConAuth ya verificó que response.ok === true
        const data = await response.json();

        logDesarrollo(' Nota restaurada desde la papelera:', data);

        return data;
    } catch (error) {
        registrarError('restaurarDesdePapelera', error);
        procesarError(error, 'Error al restaurar desde papelera');
    }
};

//Elimina definitivamente una anotación
export const eliminarDefinitivamente = async (anotacionId) => {
    try {
        const token = obtenerToken();

        logDesarrollo('📤 En proceso de eliminar definitivamente la nota:', anotacionId);

        const response = await fetchConAuth(`${API_URL}/anotaciones/eliminar-definitivamente/${anotacionId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        //  fetchConAuth ya verificó que response.ok === true
        const data = await response.json();

        logDesarrollo(' Nota eliminada definitivamente:', data);

        return data;
    } catch (error) {
        registrarError('eliminarDefinitivamente', error);
        procesarError(error, 'Error al eliminar definitivamente');
    }
};

// Eliminar múltiples anotaciones definitivamente
export const eliminarTodasDefinitivamente = async (anotacionesIds, aplicarFiltros = false) => {
    try {
        const token = obtenerToken();

        logDesarrollo('📤 En proceso de eliminar definitivamente las notas:', { anotacionesIds, aplicarFiltros });

        const response = await fetchConAuth(`${API_URL}/anotaciones/obtener/eliminar-todas-definitivamente`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ anotacionesIds, aplicarFiltros })
        });

        //  fetchConAuth ya verificó que response.ok === true
        const data = await response.json();

        logDesarrollo(' Notas eliminadas definitivamente:', data);

        return data;
    } catch (error) {
        registrarError('eliminarTodasDefinitivamente', error);
        procesarError(error, 'Error al eliminar todas definitivamente');
    }
};

//Eliminar definitivamente una anotación desde la papelera
export const vaciarPorId = async (anotacionId) => {
    try {
        const token = obtenerToken();

        logDesarrollo('📤 En proceso de eliminar definitivamente la nota desde la papelera:', anotacionId);

        const response = await fetchConAuth(`${API_URL}/anotaciones/obtener-papelera/vaciar/${anotacionId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        //  fetchConAuth ya verificó que response.ok === true
        const data = await response.json();

        logDesarrollo(' Nota eliminada definitivamente desde la papelera:', data);

        return data;
    } catch (error) {
        registrarError('vaciarPorId', error);
        procesarError(error, 'Error al eliminar definitivamente la nota desde la papelera');
    }
};

//Vacía completamente la papelera (elimina todas las anotaciones eliminadas)
export const vaciarPapelera = async () => {
    try {
        const token = obtenerToken();

        logDesarrollo('📤 Papelera vaciando..');

        const response = await fetchConAuth(`${API_URL}/anotaciones/obtener-papelera/vaciar`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        //  fetchConAuth ya verificó que response.ok === true
        const data = await response.json();

        logDesarrollo(' Papelera vaciada:', data);

        return data;
    } catch (error) {
        registrarError('vaciarPapelera', error);
        procesarError(error, 'Error al vaciar papelera');
    }
};

//Busca anotaciones por término de búsqueda
export const buscarAnotaciones = async (termino) => {
    try {
        const token = obtenerToken();

        logDesarrollo('📤 Buscando nota:', termino);

        const response = await fetchConAuth(
            `${API_URL}/anotaciones/buscar?q=${encodeURIComponent(termino)}`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        //  fetchConAuth ya verificó que response.ok === true
        const data = await response.json();

        logDesarrollo(' Nota buscada:', data);

        return data.anotaciones;
    } catch (error) {
        registrarError('buscarAnotaciones', error);
        procesarError(error, 'Error al buscar notas');
    }
};

//Obtiene una anotación específica por su ID para editar
export const obtenerAnotacionPorId = async (id) => {
    try {
        const token = obtenerToken();

        logDesarrollo('📤 obteniendo nota por id:', id);

        const response = await fetchConAuth(`${API_URL}/anotaciones/obtener/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        //  fetchConAuth ya verificó que response.ok === true
        const data = await response.json();

        logDesarrollo(' Obtenida id de nota:', data);

        return data.anotacion;
    } catch (error) {
        registrarError('obtenerAnotacionPorId', error);

        //  CRÍTICO: Si el error indica que la nota no fue encontrada (404)
        if (error.message?.includes('404') ||
            error.message?.toLowerCase().includes('no encontrada') ||
            error.message?.toLowerCase().includes('not found')) {
            logDesarrollo('❌ Nota no encontrada (404)');
            return null; // ← Retornar null para notas inexistentes
        }

        //  Para cualquier otro error (conexión, servidor, etc.)
        procesarError(error, 'Error al obtener notas por id');
        // ❌ procesarError lanza el error, pero necesitas propagarlo explícitamente
        // Como procesarError ya hace throw, técnicamente no llegas aquí,
        // pero por claridad del código es bueno agregarlo:
        throw error; // ← Esto asegura que el error se propague
    }
};

//Crea una nueva anotación
export const crearAnotacion = async (datosAnotacion) => {
    try {
        const token = obtenerToken();

        //  Log solo en desarrollo
        logDesarrollo('📤 Enviando nota:', datosAnotacion);

        const response = await fetchConAuth(`${API_URL}/anotaciones/guardar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(datosAnotacion)
        });

        //  fetchConAuth ya verificó que response.ok === true
        const data = await response.json();

        //  Log solo en desarrollo
        logDesarrollo(' Nota guardada:', data);

        return data;
    } catch (error) {
        //  Registrar error de forma segura
        registrarError('crearAnotacion', error);
        procesarError(error, 'Error al crear nota');
    }
};

//Actualiza una anotación existente
export const actualizarAnotacion = async (anotacionId, datosAnotacion) => {
    try {
        const token = obtenerToken();

        //  Log solo en desarrollo
        logDesarrollo('📤 Actualizando anotación:', anotacionId, datosAnotacion);

        const response = await fetchConAuth(`${API_URL}/anotaciones/actualizar/${anotacionId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(datosAnotacion)
        });

        //  fetchConAuth ya verificó que response.ok === true
        const data = await response.json();

        logDesarrollo(' Nota actualizada:', data);

        return data;
    } catch (error) {
        registrarError('actualizarAnotacion', error);
        procesarError(error, 'Error al actualizar nota');
    }
};

// Exportar también API_URL por si se necesita en otros lugares
export { API_URL };