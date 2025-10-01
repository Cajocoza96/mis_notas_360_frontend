import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    organizarPorColumna: true,
    verOpcionesCabecera: false,
    verModo: false,
    verModalCrear: false,
    verOrden: false,
    verPaletaColores: false,
    
    // Estados para CrearEditNota
    isTituloFocused: false,
    isNotaFocused: false,
    titulo: "",
    nota: "",
    canUndo: false,
    canRedo: false
}

const layoutSlice = createSlice({
    name: 'layout',
    initialState, 
    reducers: {
        toggleOrganizarPorColumna: (state) => {
            state.organizarPorColumna = !state.organizarPorColumna
        },
        setOrganizarPorColumna: (state, action) => {
            state.organizarPorColumna = action.payload
        },

        toggleVerOpcionesCabecera: (state) => {
            state.verOpcionesCabecera = !state.verOpcionesCabecera
        },
        setVerOpcionesCabecera: (state, action) => {
            state.verOpcionesCabecera = action.payload
        },

        toogleVerModo: (state) => {
            state.verModo = !state.verModo
        },
        setVerModo: (state, action) => {
            state.verModo = action.payload
        },

        toggleVerModalCrear: (state) => {
            state.verModalCrear = !state.verModalCrear
        },
        setVerModalCrear: (state, action) => {
            state.verModalCrear = action.payload
        },

        toggleVerOrden: (state) => {
            state.verOrden = !state.verOrden
        },
        setVerOrden: (state, action) => {
            state.verOrden = action.payload
        },

        toggleVerPaletaColores: (state) => {
            state.verPaletaColores = !state.verPaletaColores
        },
        setVerPaletaColores: (state, action) => {
            state.verPaletaColores = action.payload
        },


        // Nuevos reducers para CrearEditNota
        setIsTituloFocused: (state, action) => {
            state.isTituloFocused = action.payload
        },
        setIsNotaFocused: (state, action) => {
            state.isNotaFocused = action.payload
        },
        setTitulo: (state, action) => {
            state.titulo = action.payload
        },
        setNota: (state, action) => {
            state.nota = action.payload
        },
        setCanUndo: (state, action) => {
            state.canUndo = action.payload
        },
        setCanRedo: (state, action) => {
            state.canRedo = action.payload
        },

        // Resetear estado de la nota
        resetNotaState: (state) => {
            state.isTituloFocused = false
            state.isNotaFocused = false
            state.titulo = ""
            state.nota = ""
            state.canUndo = false
            state.canRedo = false
        }
    }
})

export const { 
    toggleOrganizarPorColumna, 
    setOrganizarPorColumna,
    toggleVerOpcionesCabecera, 
    setVerOpcionesCabecera,
    toogleVerModo, 
    setVerModo,
    toggleVerModalCrear, 
    setVerModalCrear,
    toggleVerOrden,
    setVerOrden,
    toggleVerPaletaColores,
    setVerPaletaColores,
    setIsTituloFocused,
    setIsNotaFocused,
    setTitulo,
    setNota,
    setCanUndo,
    setCanRedo,
    resetNotaState
} = layoutSlice.actions

export default layoutSlice.reducer