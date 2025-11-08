import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { obtenerAnotaciones } from "../services/anotacionesService";

// ✅ Thunk para cargar anotaciones
export const cargarAnotaciones = createAsyncThunk(
    'anotaciones/cargarAnotaciones',
    async (_, { rejectWithValue }) => {
        try {
            const anotacionesData = await obtenerAnotaciones();
            return anotacionesData;
        } catch (error) {
            return rejectWithValue(error.message || 'Error al cargar las anotaciones');
        }
    }
);

const initialState = {
    anotaciones: [],
    anotacionActual: null,
    cargando: false,
    error: null,

    //Administrar anotacion
    verAdminAnotacion : false
}

const anotacionesSlice = createSlice({
    name: 'anotaciones',
    initialState,
    reducers: {
        // Para ver Administrar anotacion
        toggleVerAdminAnotacion: (state) => {
            state.verAdminAnotacion = !state.verAdminAnotacion
        },
        setVerAdminAnotacion: (state, action) => {
            state.verAdminAnotacion = action.payload
        },

        setAnotaciones: (state, action) => {
            state.anotaciones = action.payload
        },
        setAnotacionActual: (state, action) => {
            state.anotacionActual = action.payload
        },
        setCargando: (state, action) => {
            state.cargando = action.payload
        },
        setError: (state, action) => {
            state.error = action.payload
        },
        agregarAnotacion: (state, action) => {
            state.anotaciones.unshift(action.payload)
        },
        actualizarAnotacion: (state, action) => {
            const index = state.anotaciones.findIndex(a => a.id === action.payload.id)
            if (index !== -1) {
                state.anotaciones[index] = action.payload
            }
        },

        // ✅ Actualizar favorito local (sin filtrado)
        actualizarFavoritoLocal: (state, action) => {
            const { anotacionId, favorito } = action.payload;
            
            // Actualizar en la lista de anotaciones
            const anotacion = state.anotaciones.find(a => a.id === anotacionId);
            if (anotacion) {
                anotacion.favorito = favorito;
            }
            
            // Actualizar en anotacionActual si coincide
            if (state.anotacionActual && state.anotacionActual.id === anotacionId) {
                state.anotacionActual.favorito = favorito;
            }
        },

        papeleraAnotacion: (state, action) => {
            state.anotaciones = state.anotaciones.filter(a => a.id !== action.payload)
        },

        eliminarAnotacion: (state, action) => {
            state.anotaciones = state.anotaciones.filter(a => a.id !== action.payload)
        },
        // Nueva acción para restaurar nota (la elimina de la vista de papelera)
        restaurarAnotacion: (state, action) => {
            state.anotaciones = state.anotaciones.filter(a => a.id !== action.payload)
        },
        // Nueva acción para eliminar todas las notas (limpiar el array)
        eliminarTodasAnotaciones: (state) => {
            state.anotaciones = []
        }
    },
    extraReducers: (builder) => {
        builder
            // ✅ Cargar anotaciones
            .addCase(cargarAnotaciones.pending, (state) => {
                state.cargando = true;
                state.error = null;
            })
            .addCase(cargarAnotaciones.fulfilled, (state, action) => {
                state.anotaciones = action.payload;
                state.cargando = false;
                state.error = null;
            })
            .addCase(cargarAnotaciones.rejected, (state, action) => {
                state.cargando = false;
                state.error = action.payload || 'Error al cargar las anotaciones';
            });
    }
})

export const {
    toggleVerAdminAnotacion,
    setVerAdminAnotacion,
    
    setAnotaciones,
    setAnotacionActual,
    setCargando,
    setError,
    agregarAnotacion,
    actualizarAnotacion,
    actualizarFavoritoLocal,
    papeleraAnotacion,
    eliminarAnotacion,
    restaurarAnotacion,
    eliminarTodasAnotaciones
} = anotacionesSlice.actions

export default anotacionesSlice.reducer