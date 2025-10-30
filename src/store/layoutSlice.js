import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    verMenuHamburguesa: false,

    verOpcionesCabecera: false,
    verOpcCabPagVisPrev: false,
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
    toggleVerOpcionesCabecera,
    setVerOpcionesCabecera,
    toggleVerOpcCabPagVisPrev,
    setVerOpcCabPagVisPrev,
    toggleVerFechaCreaModCantText,
    setVerFechaCreaModCantText
} = layoutSlice.actions

export default layoutSlice.reducer