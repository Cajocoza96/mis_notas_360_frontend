import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { obtenerMensajeError, registrarError, logDesarrollo } from "../utils/errorHandler";

import { fetchConAuth } from "../services/authService";

const API_URL = import.meta.env.VITE_API_URL;

// Thunk para cargar las preferencias desde el backend
export const cargarPreferencia = createAsyncThunk(
    'preferencia/cargarPreferencia',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetchConAuth(`${API_URL}/auth/preferencia`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Error al cargar preferencia');
            }

            const data = await response.json();
            return {
                organizarPorColumna: data.organizarPorColumna,
                tema: data.tema, // 'claro', 'oscuro', 'sistema'
                verSoloFavoritos: data.verSoloFavoritos || false,
                verAnotacEstado: data.verAnotacEstado || 'ver_todos_estados',
                ordenAnotaciones: data.ordenAnotaciones || 'fecha_creacion'
            };
        } catch (error) {
            registrarError('Cargar preferencia', error);
            const mensajeSeguro = obtenerMensajeError(
                error, 
                'Error al cargar las preferencias'
            );
            return rejectWithValue(mensajeSeguro);
        }
    }
);

// Thunk para guardar la preferencia
export const guardarOrgColumna = createAsyncThunk(
    'preferencia/guardarOrgColumna',
    async (organizarPorColumna, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetchConAuth(`${API_URL}/auth/preferencia`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ organizarPorColumna })
            });

            if (!response.ok) {
                throw new Error('Error al guardar preferencia');
            }

            return organizarPorColumna;
        } catch (error) {
            registrarError('Guardar organización por columna', error);
            const mensajeSeguro = obtenerMensajeError(
                error, 
                'Error al guardar la preferencia de organización'
            );
            return rejectWithValue(mensajeSeguro);
        }
    }
);

// Thunk para guardar el tema
export const guardarTema = createAsyncThunk(
    'preferencia/guardarTema',
    async (tema, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetchConAuth(`${API_URL}/auth/preferencia`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ tema })
            });

            if (!response.ok) {
                throw new Error('Error al guardar tema');
            }

            return tema;
        } catch (error) {
            registrarError('Guardar tema', error);
            const mensajeSeguro = obtenerMensajeError(
                error, 
                'Error al guardar el tema'
            );
            return rejectWithValue(mensajeSeguro);
        }
    }
);

// Thunk para guardar verSoloFavoritos
export const guardarVerSoloFavoritos = createAsyncThunk(
    'preferencia/guardarVerSoloFavoritos',
    async (verSoloFavoritos, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetchConAuth(`${API_URL}/auth/preferencia`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ verSoloFavoritos })
            });

            if (!response.ok) {
                throw new Error('Error al guardar filtro de favoritos');
            }

            return verSoloFavoritos;
        } catch (error) {
            registrarError('Guardar filtro de favoritos', error);
            const mensajeSeguro = obtenerMensajeError(
                error, 
                'Error al guardar el filtro de favoritos'
            );
            return rejectWithValue(mensajeSeguro);
        }
    }
);

// Thunk para guardar el filtro de estado de anotaciones
export const guardarVerAnotacEstado = createAsyncThunk(
    'preferencia/guardarVerAnotacEstado',
    async (verAnotacEstado, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetchConAuth(`${API_URL}/auth/preferencia`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ verAnotacEstado })
            });

            if (!response.ok) {
                throw new Error('Error al guardar vista de estado');
            }

            return verAnotacEstado;
        } catch (error) {
            registrarError('Guardar vista de estado', error);
            const mensajeSeguro = obtenerMensajeError(
                error, 
                'Error al guardar la vista de estado'
            );
            return rejectWithValue(mensajeSeguro);
        }
    }
);

// Thunk para guardar el orden de anotaciones
export const guardarOrdenAnotaciones = createAsyncThunk(
    'preferencia/guardarOrdenAnotaciones',
    async (ordenAnotaciones, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetchConAuth(`${API_URL}/auth/preferencia`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ordenAnotaciones })
            });

            if (!response.ok) {
                throw new Error('Error al guardar orden de anotaciones');
            }

            return ordenAnotaciones;
        } catch (error) {
            registrarError('Guardar orden de anotaciones', error);
            const mensajeSeguro = obtenerMensajeError(
                error, 
                'Error al guardar el orden de anotaciones'
            );
            return rejectWithValue(mensajeSeguro);
        }
    }
);

const initialState = {
    organizarPorColumna: true,
    tema: 'sistema', // 'claro', 'oscuro', 'sistema'
    verSoloFavoritos: false,
    verAnotacEstado: 'ver_todos_estados', // 'ver_no_asignado', 'ver_pendiente', 'ver_finalizado', 'ver_todos_estados'
    ordenAnotaciones: 'fecha_creacion',
    verModo: false,
    verOrden: false,
    cargandoPreferencia: false,
    errorPreferencia: null
}

//  Función para aplicar tema inmediatamente
const aplicarTemaInmediato = (tema) => {
    const root = document.documentElement;
    const mediaquery = window.matchMedia("(prefers-color-scheme: dark)");
    const prefersDark = mediaquery.matches;

    const isDark = tema === "oscuro" || (tema === "sistema" && prefersDark);
    
    root.classList.toggle("dark", isDark);
    root.classList.toggle("light", !isDark);
    
    localStorage.setItem("theme", tema);
};

const preferenciaSlice = createSlice({
    name: 'preferencia',
    initialState,
    reducers: {
        toggleOrganizarPorColumna: (state) => {
            state.organizarPorColumna = !state.organizarPorColumna
        },
        setOrganizarPorColumna: (state, action) => {
            state.organizarPorColumna = action.payload
        },
        
        // Tema
        setTema: (state, action) => {
            state.tema = action.payload
        },

        // Ver Solo Favoritos
        toggleVerSoloFavoritos: (state) => {
            state.verSoloFavoritos = !state.verSoloFavoritos
        },
        setVerSoloFavoritos: (state, action) => {
            state.verSoloFavoritos = action.payload
        },

        // Ver Anotación Estado
        setVerAnotacEstado: (state, action) => {
            state.verAnotacEstado = action.payload
        },

        // Ver Orden Anotaciones
        setOrdenAnotaciones: (state, action) => {
            state.ordenAnotaciones = action.payload
        },

        // Ver Modo
        toggleVerModo: (state) => {
            state.verModo = !state.verModo
        },
        setVerModo: (state, action) => {
            state.verModo = action.payload
        },

        // Ver Orden
        toggleVerOrden: (state) => {
            state.verOrden = !state.verOrden
        },
        setVerOrden: (state, action) => {
            state.verOrden = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            // Cargar preferencias
            .addCase(cargarPreferencia.pending, (state) => {
                state.cargandoPreferencia = true;
                state.errorPreferencia = null;
            })
            .addCase(cargarPreferencia.fulfilled, (state, action) => {
                state.organizarPorColumna = action.payload.organizarPorColumna;
                state.tema = action.payload.tema;
                state.verSoloFavoritos = action.payload.verSoloFavoritos;
                state.verAnotacEstado = action.payload.verAnotacEstado;
                state.ordenAnotaciones = action.payload.ordenAnotaciones;
                state.cargandoPreferencia = false;
                
                //  Aplicar tema inmediatamente al cargar preferencias
                aplicarTemaInmediato(action.payload.tema);
            })
            .addCase(cargarPreferencia.rejected, (state, action) => {
                state.cargandoPreferencia = false;
                state.errorPreferencia = action.payload;
            })
            // Guardar preferencia
            .addCase(guardarOrgColumna.fulfilled, (state, action) => {
                state.organizarPorColumna = action.payload;
            })
            // Guardar tema
            .addCase(guardarTema.fulfilled, (state, action) => {
                state.tema = action.payload;
            })
            // Guardar ver solo favoritos
            .addCase(guardarVerSoloFavoritos.fulfilled, (state, action) => {
                state.verSoloFavoritos = action.payload;
            })
            // Guardar ver anotación estado
            .addCase(guardarVerAnotacEstado.fulfilled, (state, action) => {
                state.verAnotacEstado = action.payload;
            })
            // Guardar orden anotaciones
            .addCase(guardarOrdenAnotaciones.fulfilled, (state, action) => {
                state.ordenAnotaciones = action.payload;
            });
    }
})

export const {
    toggleOrganizarPorColumna,
    setOrganizarPorColumna,
    setTema,
    toggleVerSoloFavoritos, 
    setVerSoloFavoritos,
    setVerAnotacEstado,
    setOrdenAnotaciones,
    toggleVerModo,
    setVerModo,
    toggleVerOrden,
    setVerOrden
} = preferenciaSlice.actions

export default preferenciaSlice.reducer