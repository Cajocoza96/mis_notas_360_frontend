import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    anotaciones: [],
    anotacionActual: null,
    cargando: false,
    error: null
}

const anotacionesSlice = createSlice({
    name: 'anotaciones',
    initialState,
    reducers: {
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
    }
})

export const {
    setAnotaciones,
    setAnotacionActual,
    setCargando,
    setError,
    agregarAnotacion,
    actualizarAnotacion,
    papeleraAnotacion,
    eliminarAnotacion,
    restaurarAnotacion,
    eliminarTodasAnotaciones
} = anotacionesSlice.actions

export default anotacionesSlice.reducer