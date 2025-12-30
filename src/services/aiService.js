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
        console.error('🚫 Rate Limit IA:', error.message);
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
        console.error(`❌ Error IA: ${error.message}`);
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
export const corregirTexto = async (texto) => {
    try {
        const token = obtenerToken();

        logDesarrollo('🤖 Enviando texto a IA para corrección:', texto.substring(0, 100) + '...');

        const response = await fetchConAuth(`${API_URL}/ai/correct`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ text: texto })
        });

        const data = await response.json();

        logDesarrollo('✅ Texto corregido:', data.result?.substring(0, 100) + '...');

        return data;
    } catch (error) {
        registrarError('corregirTexto', error);
        procesarError(error, 'Error al corregir el texto');
    }
};

// Mejorar redacción
export const mejorarRedaccion = async (texto) => {
    try {
        const token = obtenerToken();

        logDesarrollo('🤖 Enviando texto a IA para mejorar:', texto.substring(0, 100) + '...');

        const response = await fetchConAuth(`${API_URL}/ai/improve`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ text: texto })
        });

        const data = await response.json();

        logDesarrollo('✅ Redacción mejorada:', data.result?.substring(0, 100) + '...');

        return data;
    } catch (error) {
        registrarError('mejorarRedaccion', error);
        procesarError(error, 'Error al mejorar la redacción');
    }
};

// Resumir texto
export const resumirTexto = async (texto) => {
    try {
        const token = obtenerToken();

        logDesarrollo('🤖 Enviando texto a IA para resumir:', texto.substring(0, 100) + '...');

        const response = await fetchConAuth(`${API_URL}/ai/summarize`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ text: texto })
        });

        const data = await response.json();

        logDesarrollo('✅ Texto resumido:', data.result);

        return data;
    } catch (error) {
        registrarError('resumirTexto', error);
        procesarError(error, 'Error al resumir el texto');
    }
};

// Convertir texto a tareas
export const convertirTextoATareas = async (texto) => {
    try {
        const token = obtenerToken();

        logDesarrollo('🤖 Enviando texto a IA para convertir a tareas:', texto.substring(0, 100) + '...');

        const response = await fetchConAuth(`${API_URL}/ai/text-to-tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ text: texto })
        });

        const data = await response.json();

        logDesarrollo('✅ Tareas generadas:', data.tasks);

        return data;
    } catch (error) {
        registrarError('convertirTextoATareas', error);
        procesarError(error, 'Error al convertir texto a tareas');
    }
};

// Exportar también API_URL por si se necesita en otros lugares
export { API_URL };