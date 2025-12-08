const API_URL = import.meta.env.VITE_API_URL;

import { logDesarrollo, errorDesarrollo, registrarError } from "../utils/errorHandler";

import { fetchConAuth } from "./authService";

//Maneja errores de las peticiones HTTP
const manejarErrorRespuesta = async (response, mensajeError) => {
    if (!response.ok) {
        // ✅ Solo mostrar URL en desarrollo
        if (import.meta.env.MODE === 'development') {
            console.error(`❌ Error en: ${response.url}`);
        }
        
        // ✅ Detectar específicamente el error 429 (Rate Limit)
        if (response.status === 429) {
            try {
                // Clonar la respuesta para poder leerla sin consumirla
                const responseClone = response.clone();
                const errorData = await responseClone.json();
                
                // ✅ Extraer detail para el usuario y error para la consola
                const mensajeUsuario = errorData.detail || 'Límite de solicitudes alcanzado. Por favor, espera un momento.';
                const mensajeTecnico = errorData.error || 'Rate limit exceeded';
                
                // ✅ Mostrar error técnico en consola para debugging
                console.error('🚫 Rate Limit:', mensajeTecnico);
                logDesarrollo('📛 Detalles completos:', errorData);
                
                // ✅ Lanzar error con el mensaje amigable para el Toast
                const error = new Error(mensajeUsuario);
                error.code = 'RATE_LIMIT_EXCEEDED';
                error.status = 429;
                throw error;
                
            } catch (parseError) {
                // ✅ Si falla el parsing JSON (muy raro), usar mensaje genérico
                console.error('⚠️ No se pudo parsear respuesta 429:', parseError);
                
                const error = new Error('Límite de solicitudes alcanzado. Por favor, espera un momento.');
                error.code = 'RATE_LIMIT_EXCEEDED';
                error.status = 429;
                throw error;
            }
        }
        
        // ✅ Para cualquier otro error, usar el mensaje proporcionado
        throw new Error(mensajeError);
    }
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

        manejarErrorRespuesta(response, 'Error al cargar contadores');

        const data = await response.json();

        logDesarrollo('✅ Contadores obtenidos:', data);

        return data;
    } catch (error) {
        registrarError('obtenerContadores', error);
        throw error;
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

        manejarErrorRespuesta(response, 'Error al cargar notas');

        const data = await response.json();

        logDesarrollo('✅ Notas obtenidas:', data);

        return data.anotaciones;
    } catch (error) {
        registrarError('obtenerAnotaciones', error);
        throw error;
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

        manejarErrorRespuesta(response, 'Error al cargar notas eliminadas');

        const data = await response.json();

        logDesarrollo('✅ Notas eliminadas obtenidas:', data);

        return data.anotaciones;
    } catch (error) {
        registrarError('obtenerAnotacionesEliminadas', error);
        throw error;
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

        manejarErrorRespuesta(response, 'Error al actualizar favorito');

        const data = await response.json();

        logDesarrollo('✅ Nota asignada como favorita:', data);

        return data;
    } catch (error) {
        registrarError('actualizarFavorito', error);
        throw error;
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

        manejarErrorRespuesta(response, 'Error al mover a papelera');

        const data = await response.json();

        logDesarrollo('✅ Nota movida a papelera:', data);

        return data;
    } catch (error) {
        registrarError('moverAPapelera', error);
        throw error;
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

        manejarErrorRespuesta(response, 'Error al restaurar nota desde la papelera');

        const data = await response.json();

        logDesarrollo('✅ Nota restaurada desde la papelera:', data);

        return data;
    } catch (error) {
        registrarError('restaurarDesdePapelera', error);
        throw error;
    }
};

//Elimina definitivamente una anotación desde la papelera
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

        manejarErrorRespuesta(response, 'Error al eliminar la nota definitivamente');

        const data = await response.json();

        logDesarrollo('✅ Nota eliminada definitivamente:', data);

        return data;
    } catch (error) {
        registrarError('eliminarDefinitivamente', error);
        throw error;
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

        manejarErrorRespuesta(response, 'Error al vaciar la papelera');

        const data = await response.json();

        logDesarrollo('✅ Papelera vaciada:', data);

        return data;
    } catch (error) {
        registrarError('vaciarPapelera', error);
        throw error;
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

        manejarErrorRespuesta(response, 'Error al buscar anotaciones');

        const data = await response.json();

        logDesarrollo('✅ Nota buscada:', data);

        return data.anotaciones;
    } catch (error) {
        registrarError('buscarAnotaciones', error);
        throw error;
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

        manejarErrorRespuesta(response, 'Error al cargar la anotación');

        const data = await response.json();

        logDesarrollo('✅ Obtenida id de nota:', data);

        return data.anotacion;
    } catch (error) {
        registrarError('obtenerAnotacionPorId', error);
        throw error;
    }
};

//Crea una nueva anotación
export const crearAnotacion = async (datosAnotacion) => {
    try {
        const token = obtenerToken();

        // ✅ Log solo en desarrollo
        logDesarrollo('📤 Enviando nota:', datosAnotacion);

        const response = await fetchConAuth(`${API_URL}/anotaciones/guardar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(datosAnotacion)
        });

        await manejarErrorRespuesta(response, 'Error al guardar la nota');

        const data = await response.json();

        // ✅ Log solo en desarrollo
        logDesarrollo('✅ Nota guardada:', data);

        return data;
    } catch (error) {
        // ✅ Registrar error de forma segura
        registrarError('crearAnotacion', error);
        throw error;
    }
};

//Actualiza una anotación existente
export const actualizarAnotacion = async (anotacionId, datosAnotacion) => {
    try {
        const token = obtenerToken();

        // ✅ Log solo en desarrollo
        logDesarrollo('📤 Actualizando anotación:', anotacionId, datosAnotacion);

        const response = await fetchConAuth(`${API_URL}/anotaciones/actualizar/${anotacionId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(datosAnotacion)
        });

        await manejarErrorRespuesta(response, 'Error al actualizar la nota');

        const data = await response.json();

        logDesarrollo('✅ Nota actualizada:', data);

        return data;
    } catch (error) {
        registrarError('actualizarAnotacion', error);
        throw error;
    }
};

// Exportar también API_URL por si se necesita en otros lugares
export { API_URL };