import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    verToast: false,
    verModalEliminarUsuario: false,
    verModalCerrarSesion: false
}

const accesoSlice = createSlice({
    name: 'acceso',
    initialState,
    reducers: {
        toggleVerToast: (state) => {
            state.verToast = !state.verToast
        },
        setVerToast: (state, action) => {
            state.verToast = action.payload
        },

        toggleVerModalEliminarUsuario: (state) => {
            state.verModalEliminarUsuario = !state.verModalEliminarUsuario
        },
        setVerModalEliminarUsuario: (state, action) => {
            state.verModalEliminarUsuario = action.payload  // Corregido: era action.verModalEliminarUsuario
        },

        toggleVerModalCerrarSesion: (state) => {
            state.verModalCerrarSesion = !state.verModalCerrarSesion
        },
        setVerModalCerrarSesion: (state, action) => {
            state.verModalCerrarSesion = action.payload
        }
    }
})

export const {
    toggleVerToast,
    setVerToast,
    toggleVerModalEliminarUsuario,
    setVerModalEliminarUsuario,
    toggleVerModalCerrarSesion,
    setVerModalCerrarSesion
} = accesoSlice.actions

export default accesoSlice.reducer