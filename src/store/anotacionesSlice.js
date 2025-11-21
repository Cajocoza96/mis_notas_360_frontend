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
    mostrandoResultados: false,
    error: null,

    // ✅ Nuevos estados para controlar la carga completa
    cargandoCabecera: false,
    cargandoCuerpo: false,

    //Administrar anotacion
    verAdminAnotacion: false,

    // ✅ Estado para el modal de éxito/error
    mostrarModalNotificacion: false,
    mensajeNotificacion: '',
    esErrorNotificacion: false,
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

        // ✅ Nuevas acciones para controlar la carga por componente
        setCargandoCabecera: (state, action) => {
            state.cargandoCabecera = action.payload;
        },
        setCargandoCuerpo: (state, action) => {
            state.cargandoCuerpo = action.payload;
        },

        // ✅ Acciones para el modal de notificación
        mostrarNotificacion: (state, action) => {
            state.mostrarModalNotificacion = true;
            state.mensajeNotificacion = action.payload.mensaje;
            state.esErrorNotificacion = action.payload.esError || false;
        },
        ocultarNotificacion: (state) => {
            state.mostrarModalNotificacion = false;
            state.mensajeNotificacion = '';
            state.esErrorNotificacion = false;
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
        setMostrandoResultados: (state, action) => {
            state.mostrandoResultados = action.payload
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
        },

        //Para resetear todo
        resetAllANotacionesState: (state) => {
            return initialState;
        }
    },

    /*
    extraReducers: (builder) => {
        builder
            // ✅ Cargar anotaciones
            .addCase(cargarAnotaciones.pending, (state) => {
                state.cargando = true;
                state.mostrandoResultados = false,
                state.error = null;
            })
            .addCase(cargarAnotaciones.fulfilled, (state, action) => {
                state.anotaciones = action.payload;
                state.cargando = false;
                state.error = null;
            })
            .addCase(cargarAnotaciones.rejected, (state, action) => {
                state.cargando = false;
                state.mostrandoResultados = true;
                state.error = action.payload || 'Error al cargar las anotaciones';
            });
    }
    */
})

export const {
    toggleVerAdminAnotacion,
    setVerAdminAnotacion,

    // ✅ Exportar las nuevas acciones
    mostrarNotificacion,
    ocultarNotificacion,

    setCargandoCabecera,
    setCargandoCuerpo,

    setAnotaciones,
    setAnotacionActual,
    setCargando,
    setMostrandoResultados,
    setError,
    agregarAnotacion,
    actualizarAnotacion,
    actualizarFavoritoLocal,
    papeleraAnotacion,
    eliminarAnotacion,
    restaurarAnotacion,
    eliminarTodasAnotaciones,

    resetAllANotacionesState
} = anotacionesSlice.actions

export default anotacionesSlice.reducer