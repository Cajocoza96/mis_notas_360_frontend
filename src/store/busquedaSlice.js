import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    terminoBusqueda: '',
    resultadosBusqueda: [],
    cargandoBusqueda: false,
    errorBusqueda: null
}

const busquedaSlice = createSlice({
    name: 'busqueda',
    initialState,
    reducers: {
        setTerminoBusqueda: (state, action) => {
            state.terminoBusqueda = action.payload
        },
        setResultadosBusqueda: (state, action) => {
            state.resultadosBusqueda = action.payload
        },
        setCargandoBusqueda: (state, action) => {
            state.cargandoBusqueda = action.payload
        },
        setErrorBusqueda: (state, action) => {
            state.errorBusqueda = action.payload
        },
        limpiarBusqueda: (state) => {
            state.terminoBusqueda = ''
            state.resultadosBusqueda = []
            state.cargandoBusqueda = false
            state.errorBusqueda = null
        }
    }
})

export const {
    setTerminoBusqueda,
    setResultadosBusqueda,
    setCargandoBusqueda,
    setErrorBusqueda,
    limpiarBusqueda
} = busquedaSlice.actions

export default busquedaSlice.reducer