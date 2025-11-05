import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = import.meta.env.VITE_API_URL;

// Thunk para cargar las preferencias desde el backend
export const cargarPreferencia = createAsyncThunk(
    'preferencia/cargarPreferencia',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/auth/preferencia`, {
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
                verAnotacEstado: data.verAnotacEstado || 'ver_todos_estados'
            };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Thunk para guardar la preferencia
export const guardarPreferencia = createAsyncThunk(
    'preferencia/guardarPreferencia',
    async (organizarPorColumna, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/auth/preferencia`, {
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
            return rejectWithValue(error.message);
        }
    }
);

// Thunk para guardar el tema
export const guardarTema = createAsyncThunk(
    'preferencia/guardarTema',
    async (tema, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/auth/preferencia`, {
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
            return rejectWithValue(error.message);
        }
    }
);

// Thunk para guardar el filtro de estado de anotaciones
export const guardarVerAnotacEstado = createAsyncThunk(
    'preferencia/guardarVerAnotacEstado',
    async (verAnotacEstado, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/auth/preferencia`, {
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
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    organizarPorColumna: true,
    tema: 'sistema', // 'claro', 'oscuro', 'sistema'
    verAnotacEstado: 'ver_todos_estados', // 'ver_no_asignado', 'ver_pendiente', 'ver_finalizado', 'ver_todos_estados'
    verModo: false,
    verOrden: false,
    cargandoPreferencia: false,
    errorPreferencia: null
}

// ✅ Función para aplicar tema inmediatamente
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

        // Ver Anotación Estado
        setVerAnotacEstado: (state, action) => {
            state.verAnotacEstado = action.payload
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
                state.verAnotacEstado = action.payload.verAnotacEstado;
                state.cargandoPreferencia = false;
                
                // ✅ Aplicar tema inmediatamente al cargar preferencias
                aplicarTemaInmediato(action.payload.tema);
            })
            .addCase(cargarPreferencia.rejected, (state, action) => {
                state.cargandoPreferencia = false;
                state.errorPreferencia = action.payload;
            })
            // Guardar preferencia
            .addCase(guardarPreferencia.fulfilled, (state, action) => {
                state.organizarPorColumna = action.payload;
            })
            // Guardar tema
            .addCase(guardarTema.fulfilled, (state, action) => {
                state.tema = action.payload;
            })
            // Guardar ver anotación estado
            .addCase(guardarVerAnotacEstado.fulfilled, (state, action) => {
                state.verAnotacEstado = action.payload;
            });
    }
})

export const {
    toggleOrganizarPorColumna,
    setOrganizarPorColumna,
    setTema,
    setVerAnotacEstado,
    toggleVerModo,
    setVerModo,
    toggleVerOrden,
    setVerOrden
} = preferenciaSlice.actions

export default preferenciaSlice.reducer