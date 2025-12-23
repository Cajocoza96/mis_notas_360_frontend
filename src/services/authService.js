import { store } from "../store/store";
import { cargarPreferencia } from "../store/preferenciaSlice";
import { cerrarSesionLocal } from "../store/authSlice";
import { establecerSesion } from "../store/authSlice";
import { setVerToast, setMensajeToast } from "../store/accesoSlice";
import { logDesarrollo, errorDesarrollo, obtenerMensajeError } from "../utils/errorHandler";

const API_URL = import.meta.env.VITE_API_URL;

// ===============================
// ✅ CONFIGURACIÓN DE TIMEOUTS
// ===============================
const TIMEOUTS = {
    AUTH: 45000,      // 45 segundos para login/registro (servidor puede estar dormido)
    VERIFICAR: 30000, // 30 segundos para verificar token
    NORMAL: 15000,    // 15 segundos para operaciones normales
    CERRAR: 5000      // 5 segundos para cerrar sesión
};

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
    store.dispatch({ type: 'auth/cerrarSesionLocal' });
};

// ✅ NUEVO: Manejar cierre de sesión por rate limit
const manejarRateLimitExcedido = (mensaje = 'Demasiadas solicitudes, intenta más tarde') => {
    limpiarSesion();

    // Mostrar mensaje toast
    store.dispatch(setMensajeToast(mensaje));
    store.dispatch(setVerToast(true));

    setTimeout(() => {
        store.dispatch(setVerToast(false));
    }, 4000);

    // Redirigir a panel principal
    setTimeout(() => {
        window.location.href = '/panel-principal';
    }, 500);
};

// ✅ NUEVO: Función para hacer warm-up del servidor
const warmUpServer = async () => {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 segundos de timeout

        await fetch(`${API_URL}/health`, {
            method: 'GET',
            signal: controller.signal
        });

        clearTimeout(timeoutId);
        logDesarrollo('✅ Servidor despierto');
        return true;
    } catch (error) {
        logDesarrollo('⚠️ Servidor podría estar durmiendo:', error.message);
        return false;
    }
};

// ✅ MEJORADO: Fetch con timeout y manejo de rate limit
const fetchConTimeout = async (url, options = {}, timeout = TIMEOUTS.NORMAL, intentos = 1) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal,
            credentials: 'include',
        });

        clearTimeout(timeoutId);

        // ✅ CRÍTICO: Verificar si es error 429 (Rate Limit Exceeded)
        if (response.status === 429) {
            const data = await response.json();

            // Si el backend indica que debe cerrar sesión
            if (data.sesionExpirada || data.debeRenovarSesion) {
                manejarRateLimitExcedido(data.error || 'Demasiadas solicitudes, intenta más tarde');

                // Lanzar error para que no continúe el proceso
                throw new Error('RATE_LIMIT_SESSION_CLOSED');
            }

            // Si es rate limit pero sin cierre de sesión (rutas públicas)
            throw new Error(data.error || 'Demasiadas solicitudes, intenta más tarde');
        }

        return response;

    } catch (error) {
        clearTimeout(timeoutId);

        // Si ya se manejó el rate limit, no hacer nada más
        if (error.message === 'RATE_LIMIT_SESSION_CLOSED') {
            throw error;
        }

        if (error.name === 'AbortError') {
            if (intentos === 1 && (url.includes('/auth/iniciar-sesion') ||
                url.includes('/auth/registrar') ||
                url.includes('/auth/google') ||
                url.includes('/auth/facebook'))) {
                logDesarrollo('⏳ Servidor tardando en responder, reintentando...');
                return fetchConTimeout(url, options, timeout * 1.5, intentos + 1);
            }

            throw new Error('La solicitud tardó demasiado tiempo. El servidor podría estar iniciándose, intenta de nuevo en unos segundos.');
        }

        if (!navigator.onLine) {
            throw new Error('¡Ups! No podemos conectarnos en este momento. Verifica tu conexión a internet e intenta nuevamente.');
        }

        if (error.message.includes('Failed to fetch')) {
            throw new Error('No se pudo conectar con el servidor. Inténtalo nuevamente más tarde.');
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

        throw new Error(data.error || data.mensaje || 'Error en la operación');
    }

    return data;
};

// ===============================
// ✅ FUNCIONES DE AUTENTICACIÓN
// ===============================

// ✅ MEJORADO: Registrar usuario con warm-up
export const registrarUsuario = async (nombreUsuario, contrasena) => {
    try {
        // Intentar despertar el servidor primero
        await warmUpServer();

        const response = await fetchConTimeout(
            `${API_URL}/auth/registrar`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombreUsuario, contrasena }),
            },
            TIMEOUTS.AUTH // 45 segundos
        );

        const data = await manejarRespuestaAuth(response);
        logDesarrollo('✅ Usuario registrado:', data);

        establecerSesionUsuario(data.token, data.usuario);
        return data;
    } catch (error) {
        errorDesarrollo('❌ Error al registrar:', error);
        throw new Error(obtenerMensajeError(error, 'Error al registrar usuario'));
    }
};

// ✅ MEJORADO: Iniciar sesión con warm-up
export const iniciarSesion = async (nombreUsuario, contrasena) => {
    try {
        // Intentar despertar el servidor primero
        await warmUpServer();

        const response = await fetchConTimeout(
            `${API_URL}/auth/iniciar-sesion`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombreUsuario, contrasena }),
            },
            TIMEOUTS.AUTH // 45 segundos
        );

        const data = await manejarRespuestaAuth(response);
        logDesarrollo('✅ Usuario ha iniciado sesión:', data);

        establecerSesionUsuario(data.token, data.usuario);
        return data;
    } catch (error) {
        errorDesarrollo('❌ Error al iniciar sesión:', error);
        throw new Error(obtenerMensajeError(error, 'Error al iniciar sesión'));
    }
};

// ✅ MEJORADO: Autenticación con Google
export const autenticarConGoogle = async (credential) => {
    try {
        await warmUpServer();

        const response = await fetchConTimeout(
            `${API_URL}/auth/google`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ credential }),
            },
            TIMEOUTS.AUTH
        );

        const data = await manejarRespuestaAuth(response);
        logDesarrollo('✅ Usuario autenticado con Google:', data);

        establecerSesionUsuario(data.token, data.usuario);
        return data;
    } catch (error) {
        errorDesarrollo('❌ Error al autenticar con Google:', error);
        throw new Error(obtenerMensajeError(error, 'Error al autenticar con Google'));
    }
};

// ✅ MEJORADO: Autenticación con Facebook
export const autenticarConFacebook = async (facebookData) => {
    try {
        await warmUpServer();

        const response = await fetchConTimeout(
            `${API_URL}/auth/facebook`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ accessToken: facebookData.accessToken }),
            },
            TIMEOUTS.AUTH
        );

        const data = await manejarRespuestaAuth(response);
        logDesarrollo('✅ Usuario autenticado con Facebook:', data);

        establecerSesionUsuario(data.token, data.usuario);
        return data;
    } catch (error) {
        errorDesarrollo('❌ Error al autenticar con Facebook:', error);
        throw new Error(obtenerMensajeError(error, 'Error al autenticar con Facebook'));
    }
};

// ✅ Verificar token con reintentos
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
            TIMEOUTS.VERIFICAR
        );

        const data = await manejarRespuestaAuth(response);
        localStorage.setItem('usuario', JSON.stringify(data.usuario));

        return data;

    } catch (error) {
        // Si fue cerrado por rate limit, no reintentar
        if (error.message === 'RATE_LIMIT_SESSION_CLOSED') {
            throw error;
        }

        if ((error.message.includes('tiempo') || error.message.includes('conectar')) && reintentos > 0) {
            logDesarrollo(`⚠️ Reintentando verificación... (${reintentos} intentos restantes)`);
            await new Promise(resolve => setTimeout(resolve, 2000));
            return verificarToken(reintentos - 1);
        }

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
            await fetchConTimeout(
                `${API_URL}/auth/cerrar-sesion`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                },
                TIMEOUTS.CERRAR
            ).catch(error => {
                errorDesarrollo('Error al cerrar sesión en backend:', error);
            });
        }
    } catch (error) {
        errorDesarrollo('Error al cerrar sesión:', error);
    } finally {
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

        const response = await fetchConTimeout(
            `${API_URL}/auth/eliminar-cuenta`,
            {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            },
            TIMEOUTS.NORMAL
        );

        const data = await manejarRespuestaAuth(response);
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
        const response = await fetchConTimeout(
            `${API_URL}/auth/restablecer-contrasena`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombreUsuario, nuevaContrasena }),
            },
            TIMEOUTS.AUTH
        );

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

export const fetchConAuth = async (url, options = {}) => {
    const token = localStorage.getItem('token');

    if (!token) {
        limpiarSesion();
        throw new Error('No hay sesión activa');
    }

    try {
        const response = await fetchConTimeout(
            url,
            {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    ...options.headers,
                },
            },
            TIMEOUTS.NORMAL
        );

        // ✅ Verificar respuestas de error que requieren acción
        if (!response.ok) {
            const data = await response.json();

            // 401: Sesión inválida/expirada
            if (response.status === 401 && (data.sesionInvalida || data.tokenInvalido)) {
                limpiarSesion();
                window.location.href = '/iniciar-sesion';
                throw new Error(data.error || 'Sesión expirada');
            }

            // 429: Rate limit (ya manejado en fetchConTimeout, pero por si acaso)
            if (response.status === 429) {
                // Si tiene sesionExpirada, ya fue manejado
                if (data.sesionExpirada || data.debeRenovarSesion) {
                    throw new Error('RATE_LIMIT_SESSION_CLOSED');
                }

                // ✅ Rate limit específico (favoritos, crear, editar)
                // Usar el mensaje "detail" si existe, sino "error"
                const mensaje = data.detail || data.error || 'Demasiadas solicitudes, intenta más tarde';
                throw new Error(mensaje);
            }

            // Otros errores - usar detail si existe, sino error
            throw new Error(data.detail || data.error || data.mensaje || `Error ${response.status}`);
        }

        return response;

    } catch (error) {
        // No cerrar sesión si fue por rate limit (ya se manejó)
        if (error.message === 'RATE_LIMIT_SESSION_CLOSED') {
            throw error;
        }

        // Para otros errores de sesión, limpiar
        if (error.message.includes('sesión') || error.message.includes('Sesión')) {
            limpiarSesion();
        }

        throw error;
    }
};

// ===============================
// ✅ FUNCIONES AUXILIARES PÚBLICAS
// ===============================

export const obtenerToken = () => {
    return localStorage.getItem('token');
};

export const obtenerUsuarioActual = () => {
    const usuario = localStorage.getItem('usuario');
    return usuario ? JSON.parse(usuario) : null;
};

export const haySesionActiva = () => {
    return !!localStorage.getItem('token');
};