import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { obtenerAnotaciones } from "../services/anotacionesService";

import { obtenerMensajeError, registrarError, logDesarrollo } from "../utils/errorHandler";

// ✅ Thunk para cargar anotaciones
export const cargarAnotaciones = createAsyncThunk(
    'anotaciones/cargarAnotaciones',
    async (_, { rejectWithValue }) => {
        try {
            const anotacionesData = await obtenerAnotaciones();
            return anotacionesData;
        } catch (error) {
            // ✅ Registrar el error con contexto
            registrarError('Cargar anotaciones', error);

            // ✅ Retornar mensaje de error seguro
            const mensajeSeguro = obtenerMensajeError(
                error,
                'Error al cargar las anotaciones.'
            );
            return rejectWithValue(mensajeSeguro);
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

    // ✅ Estados mejorados para selección
    seleccionar: false,
    seleccionarTodo: false,
    anotacionesSeleccionadas: []
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

        // ✅ NUEVO: Toggle selección de una anotación específica
        toggleSeleccionAnotacion: (state, action) => {
            const anotacionId = action.payload;
            const index = state.anotacionesSeleccionadas.indexOf(anotacionId);

            if (index > -1) {
                // Si ya está seleccionada, la removemos
                state.anotacionesSeleccionadas.splice(index, 1);

                // Si no quedan anotaciones seleccionadas, desactivar modo selección
                if (state.anotacionesSeleccionadas.length === 0) {
                    state.seleccionar = false;
                    state.seleccionarTodo = false;
                }
            } else {
                // Si no está seleccionada, la agregamos
                state.anotacionesSeleccionadas.push(anotacionId);
            }

            // Verificar si todas están seleccionadas
            if (state.anotacionesSeleccionadas.length === state.anotaciones.length) {
                state.seleccionarTodo = true;
            } else {
                state.seleccionarTodo = false;
            }
        },

        // ✅ NUEVO: Seleccionar/deseleccionar todas
        toggleSeleccionarTodasAnotaciones: (state) => {
            if (state.seleccionarTodo) {
                // Deseleccionar todas
                state.anotacionesSeleccionadas = [];
                state.seleccionarTodo = false;
                state.seleccionar = false;
            } else {
                // Seleccionar todas
                state.anotacionesSeleccionadas = state.anotaciones.map(a => a.id);
                state.seleccionarTodo = true;
                state.seleccionar = true;
            }
        },

        // Eliminar múltiples anotaciones de la vista
        eliminarMultiplesAnotaciones: (state, action) => {
            const idsAEliminar = action.payload;
            state.anotaciones = state.anotaciones.filter(a => !idsAEliminar.includes(a.id));

            // Limpiar selección
            state.anotacionesSeleccionadas = [];
            state.seleccionar = false;
            state.seleccionarTodo = false;
        },

        // ✅ NUEVO: Limpiar selección
        limpiarSeleccion: (state) => {
            state.anotacionesSeleccionadas = [];
            state.seleccionar = false;
            state.seleccionarTodo = false;
        },

        // Mantener los existentes y actualizar
        toggleSeleccionar: (state) => {
            state.seleccionar = !state.seleccionar;
            if (!state.seleccionar) {
                // Al desactivar, limpiar selecciones
                state.anotacionesSeleccionadas = [];
                state.seleccionarTodo = false;
            }
        },

        setSeleccionar: (state, action) => {
            state.seleccionar = action.payload;
            if (!action.payload) {
                state.anotacionesSeleccionadas = [];
                state.seleccionarTodo = false;
            }
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
    }
})

export const {
    toggleVerAdminAnotacion,
    setVerAdminAnotacion,

    toggleSeleccionar,
    setSeleccionar,

    toggleSeleccionarTodo,
    setSeleccionarTodo,

    // ✅ EXPORTAR NUEVAS ACCIONES
    toggleSeleccionAnotacion,
    toggleSeleccionarTodasAnotaciones,
    limpiarSeleccion,

    eliminarMultiplesAnotaciones,

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