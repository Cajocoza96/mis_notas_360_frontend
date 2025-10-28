import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    verMenuHamburguesa: false,

    organizarPorColumna: true,
    verOpcionesCabecera: false,
    verOpcCabPagVisPrev: false,
    verModo: false,
    verOrden: false,
    verFechaCreaModCantText: false
}

const layoutSlice = createSlice({
    name: 'layout',
    initialState,
    reducers: {
        toggleVerMenuHamburguesa: (state) => {
            state.verMenuHamburguesa = !state.verMenuHamburguesa
        },
        setVerMenuHamburguesa: (state, action) => {
            state.verMenuHamburguesa = action.payload
        },

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

        toggleVerOpcCabPagVisPrev: (state) => {
            state.verOpcCabPagVisPrev = !state.verOpcCabPagVisPrev
        },
        setVerOpcCabPagVisPrev: (state, action) => {
            state.verOpcCabPagVisPrev = action.payload
        },

        toogleVerModo: (state) => {
            state.verModo = !state.verModo
        },
        setVerModo: (state, action) => {
            state.verModo = action.payload
        },

        toggleVerOrden: (state) => {
            state.verOrden = !state.verOrden
        },
        setVerOrden: (state, action) => {
            state.verOrden = action.payload
        },

        toggleVerFechaCreaModCantText: (state) => {
            state.verFechaCreaModCantText = !state.verFechaCreaModCantText
        },
        setVerFechaCreaModCantText: (state, action) => {
            state.verFechaCreaModCantText = action.payload
        }
    }
})

export const {
    toggleVerMenuHamburguesa,
    setVerMenuHamburguesa,
    toggleOrganizarPorColumna,
    setOrganizarPorColumna,
    toggleVerOpcionesCabecera,
    setVerOpcionesCabecera,
    toggleVerOpcCabPagVisPrev,
    setVerOpcCabPagVisPrev,
    toogleVerModo,
    setVerModo,
    toggleVerOrden,
    setVerOrden,
    toggleVerFechaCreaModCantText,
    setVerFechaCreaModCantText
} = layoutSlice.actions

export default layoutSlice.reducer