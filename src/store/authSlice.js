import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { verificarToken as verificarTokenService } from '../services/authService';

// Thunk para verificar token (se ejecuta solo una vez al inicio)
export const inicializarAuth = createAsyncThunk(
    'auth/inicializarAuth',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            
            if (!token) {
                return { autenticado: false, usuario: null };
            }

            const data = await verificarTokenService();
            return { 
                autenticado: true, 
                usuario: data.usuario 
            };
        } catch (error) {
            // Limpiar localStorage si el token es inválido
            localStorage.removeItem('token');
            localStorage.removeItem('usuario');
            localStorage.removeItem('theme');
            return rejectWithValue({ 
                autenticado: false, 
                usuario: null 
            });
        }
    }
);

// Thunk para login (registrar, iniciar sesión, Google, Facebook)
export const establecerSesion = createAsyncThunk(
    'auth/establecerSesion',
    async ({ token, usuario }, { rejectWithValue }) => {
        try {
            localStorage.setItem('token', token);
            localStorage.setItem('usuario', JSON.stringify(usuario));
            
            return { 
                autenticado: true, 
                usuario 
            };
        } catch (error) {
            return rejectWithValue({ 
                autenticado: false, 
                usuario: null 
            });
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        autenticado: null, // null = no inicializado, true = autenticado, false = no autenticado
        usuario: null,
        inicializando: true,
        error: null
    },
    reducers: {
        // Acción para cerrar sesión
        cerrarSesionLocal: (state) => {
            state.autenticado = false;
            state.usuario = null;
            state.inicializando = false;
            state.error = null;
            localStorage.removeItem('token');
            localStorage.removeItem('usuario');
            localStorage.removeItem('theme');
        },
        // Acción para actualizar datos del usuario
        actualizarUsuarioLocal: (state, action) => {
            if (state.usuario) {
                state.usuario = { ...state.usuario, ...action.payload };
                localStorage.setItem('usuario', JSON.stringify(state.usuario));
            }
        }
    },
    extraReducers: (builder) => {
        builder
            // Inicializar Auth
            .addCase(inicializarAuth.pending, (state) => {
                state.inicializando = true;
                state.error = null;
            })
            .addCase(inicializarAuth.fulfilled, (state, action) => {
                state.inicializando = false;
                state.autenticado = action.payload.autenticado;
                state.usuario = action.payload.usuario;
                state.error = null;
            })
            .addCase(inicializarAuth.rejected, (state, action) => {
                state.inicializando = false;
                state.autenticado = false;
                state.usuario = null;
                state.error = action.payload;
            })
            // Establecer Sesión
            .addCase(establecerSesion.fulfilled, (state, action) => {
                state.autenticado = action.payload.autenticado;
                state.usuario = action.payload.usuario;
                state.inicializando = false;
                state.error = null;
            });
    }
});

export const { cerrarSesionLocal, actualizarUsuarioLocal } = authSlice.actions;
export default authSlice.reducer;