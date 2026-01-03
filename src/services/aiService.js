const API_URL = import.meta.env.VITE_API_URL;

import { logDesarrollo, errorDesarrollo, registrarError } from "../utils/errorHandler";
import { fetchConAuth } from "./authService";

// ===============================
// ✅ HELPER: Maneja errores de las peticiones HTTP
// ===============================
const procesarError = (error, mensajeGenerico) => {
    // 1️⃣ Si es rate limit de sesión (429 general - 200 req/15min)
    if (error.message === 'RATE_LIMIT_SESSION_CLOSED') {
        throw error;
    }
    
    // 2️⃣ Si es rate limit específico de IA (20 req/hora)
    if (error.message && (
        error.message.includes('Límite') || 
        error.message.includes('límite') ||
        error.message.includes('Rate limit') ||
        error.message.includes('IA')
    )) {
        errorDesarrollo('🚫 Rate Limit IA:', error.message);
        logDesarrollo('📛 Error de rate limit IA detectado');
        
        const rateLimitError = new Error(error.message);
        rateLimitError.code = 'RATE_LIMIT_AI';
        rateLimitError.status = 429;
        throw rateLimitError;
    }
    
    // 3️⃣ Para otros errores de sesión
    if (error.message && (
        error.message.includes('sesión') || 
        error.message.includes('Sesión')
    )) {
        throw error;
    }
    
    // 4️⃣ Otros errores
    if (import.meta.env.MODE === 'development') {
        errorDesarrollo(`❌ Error IA: ${error.message}`);
    }
    
    if (!error.message || error.message === 'Failed to fetch') {
        error.message = mensajeGenerico;
    }
    
    throw error;
};

// Obtiene el token de autenticación
const obtenerToken = () => {
    return localStorage.getItem('token');
};

// ===============================
// 🤖 FUNCIONES DE IA
// ===============================

// Corregir ortografía y gramática
export const corregirTexto = async (titulo, nota, tareas) => {
    try {
        const token = obtenerToken();

        logDesarrollo('🤖 Enviando a IA para corrección');

        const response = await fetchConAuth(`${API_URL}/ai/correct`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ titulo, nota, tareas })
        });

        const data = await response.json();

        // ✅ Manejo de código 207 (Multi-Status): Éxito parcial con advertencias
        if (response.status === 207) {
            logDesarrollo('⚠️ Texto corregido con advertencias:', data.mensaje);
            
            // Devolver datos con indicador de advertencia
            return {
                ...data,
                success: true,
                hasWarnings: true,
                warningMessage: data.mensaje
            };
        }

        // ✅ Éxito completo (código 200)
        if (response.ok) {
            logDesarrollo('✅ Texto corregido exitosamente');
            return {
                ...data,
                success: true,
                hasWarnings: false
            };
        }

        // ❌ Si llegamos aquí, hubo un error
        throw new Error(data.mensaje || 'Error al corregir el texto');

    } catch (error) {
        registrarError('corregirTexto', error);
        procesarError(error, 'Error al corregir el texto');
    }
};

// Mejorar redacción
export const mejorarRedaccion = async (titulo, nota, tareas) => {
    try {
        const token = obtenerToken();

        logDesarrollo('🤖 Enviando a IA para mejorar');

        const response = await fetchConAuth(`${API_URL}/ai/improve`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ titulo, nota, tareas })
        });

        const data = await response.json();

        // ✅ Manejo de código 207 (Multi-Status): Éxito parcial con advertencias
        if (response.status === 207) {
            logDesarrollo('⚠️ Texto mejorado con advertencias:', data.mensaje);
            
            // Devolver datos con indicador de advertencia
            return {
                ...data,
                success: true,
                hasWarnings: true,
                warningMessage: data.mensaje
            };
        }

        // ✅ Éxito completo (código 200)
        if (response.ok) {
            logDesarrollo('✅ Texto mejorado exitosamente');
            return {
                ...data,
                success: true,
                hasWarnings: false
            };
        }

        // ❌ Si llegamos aquí, hubo un error
        throw new Error(data.mensaje || 'Error al mejorar el texto');

    } catch (error) {
        registrarError('mejorarRedaccion', error);
        procesarError(error, 'Error al mejorar la redacción');
    }
};

// Resumir texto
export const resumirTexto = async (titulo, nota, tareas) => {
    try {
        const token = obtenerToken();

        logDesarrollo('🤖 Enviando a IA para resumir');

        const response = await fetchConAuth(`${API_URL}/ai/summarize`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ titulo, nota, tareas })
        });

        const data = await response.json();
        logDesarrollo('✅ Texto resumido');
        return data;
    } catch (error) {
        registrarError('resumirTexto', error);
        procesarError(error, 'Error al resumir el texto');
    }
};

// Convertir texto a tareas
export const convertirTextoATareas = async (titulo, nota, tareas) => {
    try {
        const token = obtenerToken();

        logDesarrollo('🤖 Enviando a IA para convertir a tareas');

        const response = await fetchConAuth(`${API_URL}/ai/text-to-tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ titulo, nota, tareas })
        });

        const data = await response.json();
        logDesarrollo('✅ Tareas generadas');
        return data;
    } catch (error) {
        registrarError('convertirTextoATareas', error);
        procesarError(error, 'Error al convertir texto a tareas');
    }
};

// Exportar también API_URL por si se necesita en otros lugares
export { API_URL };