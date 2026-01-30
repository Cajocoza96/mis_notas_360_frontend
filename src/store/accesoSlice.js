import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    verToast: false,
    mensajeToast: '',
    verModalEliminarUsuario: false,
    verModalCerrarSesion: false,
    verModalRestablecerContrasena: false,

    // ✅ NUEVO ESTADO GLOBAL
    autenticando: false,
    tipoAutenticacion: null, // 'google', 'facebook', 'local', 'restaContra', null
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
        setMensajeToast: (state, action) => {
            state.mensajeToast = action.payload
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
        },

        toggleVerModalRestablecerContrasena: (state) => {
            state.verModalRestablecerContrasena = !state.verModalRestablecerContrasena
        },
        setVerModalRestablecerContrasena: (state, action) => {
            state.verModalRestablecerContrasena = action.payload
        },

        // ✅ NUEVAS ACCIONES PARA AUTENTICACIÓN
        iniciarAutenticacion: (state, action) => {
            state.autenticando = true;
            state.tipoAutenticacion = action.payload; // 'google', 'facebook', 'restaContra', 'local'
        },
        finalizarAutenticacion: (state) => {
            state.autenticando = false;
            state.tipoAutenticacion = null;
        },

        //Para resetear todo
        resetAllAccesoState: (state) => {
            return initialState;
        }
    }
})

export const {
    toggleVerToast,
    setVerToast,
    setMensajeToast,
    toggleVerModalEliminarUsuario,
    setVerModalEliminarUsuario,
    toggleVerModalCerrarSesion,
    setVerModalCerrarSesion,
    toggleVerModalRestablecerContrasena,
    setVerModalRestablecerContrasena,
    iniciarAutenticacion,      // ✅ NUEVO
    finalizarAutenticacion,    // ✅ NUEVO

    resetAllAccesoState
} = accesoSlice.actions

export default accesoSlice.reducer