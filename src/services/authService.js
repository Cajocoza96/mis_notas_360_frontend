import { store } from "../store/store";
import { cargarPreferencia } from "../store/preferenciaSlice";
import { cerrarSesionLocal } from "../store/authSlice";
import { establecerSesion } from "../store/authSlice";
import { logDesarrollo, errorDesarrollo, obtenerMensajeError } from "../utils/errorHandler";

const API_URL = import.meta.env.VITE_API_URL;

// ===============================
// ✅ FUNCIONES AUXILIARES
// ===============================

// Establecer sesión después del login
const establecerSesionUsuario = (token, usuario) => {
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    store.dispatch(establecerSesion({ token, usuario }));
    store.dispatch(cargarPreferencia());
};

// Limpiar sesión completamente
const limpiarSesion = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('theme');

    // Limpiar también el store Redux
    store.dispatch({ type: 'auth/cerrarSesionLocal' });
};

// Función helper para hacer fetch con timeout y manejo de errores
const fetchConTimeout = async (url, options = {}, timeout = 15000) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal,
            credentials: 'include',
        });

        clearTimeout(timeoutId);
        return response;

    } catch (error) {
        clearTimeout(timeoutId);

        if (error.name === 'AbortError') {
            throw new Error('La solicitud tardó demasiado tiempo. Por favor, intenta de nuevo.');
        }

        // Error de red
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            throw new Error('No se pudo conectar con el servidor. Verifica tu conexión a internet.');
        }

        throw error;
    }
};

// Función helper para manejar respuestas de autenticación
const manejarRespuestaAuth = async (response) => {
    const data = await response.json();

    if (!response.ok) {
        // Si es error de sesión inválida
        if (response.status === 401 && (data.sesionInvalida || data.tokenInvalido)) {
            limpiarSesion();
            throw new Error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        }

        // 🔥 CAMBIO: Lanzar el error con el mensaje específico del backend
        // Si existe data.error o data.mensaje, lo usamos; si no, mensaje genérico
        throw new Error(data.error || data.mensaje || 'Error en la operación');
    }

    return data;
};

// ===============================
// ✅ FUNCIONES DE AUTENTICACIÓN
// ===============================

// Registrar usuario
export const registrarUsuario = async (nombreUsuario, contrasena) => {
    try {
        const response = await fetchConTimeout(`${API_URL}/auth/registrar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nombreUsuario, contrasena }),
        });

        const data = await manejarRespuestaAuth(response);

        logDesarrollo('✅ Usuario registrado:', data);

        // Establecer sesión y cargar preferencias
        establecerSesionUsuario(data.token, data.usuario);

        return data;
    } catch (error) {
        errorDesarrollo('❌ Error al registrar:', error);
        throw new Error(obtenerMensajeError(error, 'Error al registrar usuario'));
    }
};

// Iniciar sesión
export const iniciarSesion = async (nombreUsuario, contrasena) => {
    try {
        const response = await fetchConTimeout(`${API_URL}/auth/iniciar-sesion`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nombreUsuario, contrasena }),
        });

        const data = await manejarRespuestaAuth(response);

        logDesarrollo('✅ Usuario ha iniciado sesión:', data);

        // Establecer sesión y cargar preferencias
        establecerSesionUsuario(data.token, data.usuario);

        return data;
    } catch (error) {
        errorDesarrollo('❌ Error al iniciar sesión:', error);
        throw new Error(obtenerMensajeError(error, 'Error al iniciar sesión'));
    }
};

// Autenticación con Google
export const autenticarConGoogle = async (credential) => {
    try {
        const response = await fetchConTimeout(`${API_URL}/auth/google`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ credential }),
        });

        const data = await manejarRespuestaAuth(response);

        logDesarrollo('✅ Usuario autenticado con Google:', data);

        // Establecer sesión y cargar preferencias
        establecerSesionUsuario(data.token, data.usuario);

        return data;
    } catch (error) {
        errorDesarrollo('❌ Error al autenticar con Google:', error);
        throw new Error(obtenerMensajeError(error, 'Error al autenticar con Google'));
    }
};

// ✅ AUTENTICACIÓN SEGURA CON FACEBOOK
export const autenticarConFacebook = async (facebookData) => {
    try {
        // ✅ CAMBIO CRÍTICO: Ahora enviamos solo el accessToken
        const response = await fetchConTimeout(`${API_URL}/auth/facebook`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                accessToken: facebookData.accessToken // ← Solo el token
            }),
        });

        const data = await manejarRespuestaAuth(response);

        logDesarrollo('✅ Usuario autenticado con Facebook:', data);

        // Establecer sesión y cargar preferencias
        establecerSesionUsuario(data.token, data.usuario);

        return data;
    } catch (error) {
        errorDesarrollo('❌ Error al autenticar con Facebook:', error);
        throw new Error(obtenerMensajeError(error, 'Error al autenticar con Facebook'));
    }
};

// Verificar token con reintentos
export const verificarToken = async (reintentos = 2) => {
    try {
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('No hay token');
        }

        const response = await fetchConTimeout(
            `${API_URL}/auth/verificar`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            },
            10000 // 10 segundos para verificación
        );

        const data = await manejarRespuestaAuth(response);

        // Actualizar usuario en localStorage
        localStorage.setItem('usuario', JSON.stringify(data.usuario));
        
        return data;

    } catch (error) {
        // Si es un error de red y quedan reintentos
        if ((error.message.includes('tiempo') || error.message.includes('conectar')) && reintentos > 0) {
            logDesarrollo(`⚠️ Reintentando verificación... (${reintentos} intentos restantes)`);
            await new Promise(resolve => setTimeout(resolve, 1500)); // Esperar 1.5 segundos
            return verificarToken(reintentos - 1);
        }

        // Si es error de sesión, limpiar
        if (error.message.includes('sesión') || error.message.includes('token')) {
            limpiarSesion();
        }

        throw error;
    }
};

// Cerrar sesión
export const cerrarSesion = async () => {
    try {
        const token = localStorage.getItem('token');

        if (token) {
            // Intentar cerrar sesión en el backend, pero no bloquear si falla
            await fetchConTimeout(
                `${API_URL}/auth/cerrar-sesion`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                },
                5000 // 5 segundos para cerrar sesión
            ).catch(error => {
                errorDesarrollo('Error al cerrar sesión en backend:', error);
                // No lanzar error, continuar con limpieza local
            });
        }
    } catch (error) {
        errorDesarrollo('Error al cerrar sesión:', error);
    } finally {
        // Siempre limpiar el localStorage y store
        limpiarSesion();
    }
};

// Eliminar cuenta
export const eliminarCuenta = async () => {
    try {
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('No hay sesión activa');
        }

        const response = await fetchConTimeout(`${API_URL}/auth/eliminar-cuenta`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        const data = await manejarRespuestaAuth(response);

        // Limpiar sesión después de eliminar cuenta
        limpiarSesion();

        return data;
    } catch (error) {
        errorDesarrollo('❌ Error al eliminar cuenta:', error);
        throw error;
    }
};

// Restablecer contraseña
export const restablecerContrasena = async (nombreUsuario, nuevaContrasena) => {
    try {
        const response = await fetchConTimeout(`${API_URL}/auth/restablecer-contrasena`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nombreUsuario, nuevaContrasena }),
        });

        const data = await manejarRespuestaAuth(response);

        return data;
    } catch (error) {
        errorDesarrollo('❌ Error al restablecer contraseña:', error);
        throw error;
    }
};

// ===============================
// ✅ FUNCIÓN PARA PETICIONES AUTENTICADAS
// ===============================

// Función mejorada para hacer peticiones autenticadas con manejo de sesión
export const fetchConAuth = async (url, options = {}) => {
    const token = localStorage.getItem('token');

    if (!token) {
        limpiarSesion();
        throw new Error('No hay sesión activa');
    }

    try {
        const response = await fetchConTimeout(
            url, // ✅ Ahora usa la URL tal cual viene
            {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    ...options.headers,
                },
            }
        );

        // Si la respuesta indica sesión inválida
        if (response.status === 401) {
            const data = await response.json();
            if (data.sesionInvalida || data.tokenInvalido) {
                limpiarSesion();
                // Redirigir a login
                window.location.href = '/iniciar-sesion';
                throw new Error('Sesión expirada');
            }
        }

        return response;

    } catch (error) {
        // Si es error de sesión, limpiar
        if (error.message.includes('sesión') || error.message.includes('Sesión')) {
            limpiarSesion();
        }
        throw error;
    }
};

// ===============================
// ✅ FUNCIONES AUXILIARES PÚBLICAS
// ===============================

// Obtener token
export const obtenerToken = () => {
    return localStorage.getItem('token');
};

// Obtener usuario actual
export const obtenerUsuarioActual = () => {
    const usuario = localStorage.getItem('usuario');
    return usuario ? JSON.parse(usuario) : null;
};

// Verificar si hay sesión activa
export const haySesionActiva = () => {
    return !!localStorage.getItem('token');
};