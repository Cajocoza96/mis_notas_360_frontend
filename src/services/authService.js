import { store } from "../store/store";
import { cargarPreferencia } from "../store/preferenciaSlice";
import { establecerSesion } from "../store/authSlice"; // ✅ Nuevo

const API_URL = import.meta.env.VITE_API_URL;

// Función auxiliar para establecer sesión después del login
const establecerSesionUsuario = (token, usuario) => {
    store.dispatch(establecerSesion({ token, usuario }));
    store.dispatch(cargarPreferencia());
};

// Registrar usuario
export const registrarUsuario = async (nombreUsuario, contrasena) => {
    try {
        const response = await fetch(`${API_URL}/auth/registrar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nombreUsuario, contrasena }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Error al registrar usuario');
        }

        // ✅ Establecer sesión y cargar preferencias
        establecerSesionUsuario(data.token, data.usuario);

        return data;
    } catch (error) {
        throw error;
    }
};

// Iniciar sesión
export const iniciarSesion = async (nombreUsuario, contrasena) => {
    try {
        const response = await fetch(`${API_URL}/auth/iniciar-sesion`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nombreUsuario, contrasena }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Error al iniciar sesión');
        }

        // ✅ Establecer sesión y cargar preferencias
        establecerSesionUsuario(data.token, data.usuario);

        return data;
    } catch (error) {
        throw error;
    }
};

// Autenticación con Google
export const autenticarConGoogle = async (credential) => {
    try {
        const response = await fetch(`${API_URL}/auth/google`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ credential }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Error al autenticar con Google');
        }

        // ✅ Establecer sesión y cargar preferencias
        establecerSesionUsuario(data.token, data.usuario);

        return data;
    } catch (error) {
        throw error;
    }
};

// Autenticación con Facebook
export const autenticarConFacebook = async (facebookData) => {
    try {
        const response = await fetch(`${API_URL}/auth/facebook`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(facebookData),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Error al autenticar con Facebook');
        }

        // ✅ Establecer sesión y cargar preferencias
        establecerSesionUsuario(data.token, data.usuario);

        return data;
    } catch (error) {
        throw error;
    }
};

// Verificar token (ahora solo se usa internamente)
export const verificarToken = async () => {
    try {
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('No hay token');
        }

        const response = await fetch(`${API_URL}/auth/verificar`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            if (data.sesionInvalida || data.tokenInvalido) {
                localStorage.removeItem('token');
                localStorage.removeItem('usuario');
                localStorage.removeItem('theme');
                throw new Error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
            }
            throw new Error(data.error || 'Token inválido');
        }

        localStorage.setItem('usuario', JSON.stringify(data.usuario));
        return data;
    } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        localStorage.removeItem('theme');
        throw error;
    }
};

// Cerrar sesión
export const cerrarSesion = async () => {
    try {
        const token = localStorage.getItem('token');
        
        if (token) {
            await fetch(`${API_URL}/auth/cerrar-sesion`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
        }
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
    } finally {
        // Siempre limpiar el localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        localStorage.removeItem('theme');
    }
};

// Eliminar cuenta
export const eliminarCuenta = async () => {
    try {
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('No hay sesión activa');
        }

        const response = await fetch(`${API_URL}/auth/eliminar-cuenta`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Error al eliminar cuenta');
        }

        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        localStorage.removeItem('theme');

        return data;
    } catch (error) {
        throw error;
    }
};

// Restablecer contraseña
export const restablecerContrasena = async (nombreUsuario, nuevaContrasena) => {
    try {
        const response = await fetch(`${API_URL}/auth/restablecer-contrasena`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nombreUsuario, nuevaContrasena }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Error al restablecer contraseña');
        }

        return data;
    } catch (error) {
        throw error;
    }
};

// Obtener token
export const obtenerToken = () => {
    return localStorage.getItem('token');
};

// Obtener usuario actual
export const obtenerUsuarioActual = () => {
    const usuario = localStorage.getItem('usuario');
    return usuario ? JSON.parse(usuario) : null;
};