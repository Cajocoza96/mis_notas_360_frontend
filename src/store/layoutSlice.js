import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    organizarPorColumna: true,
    verOpcionesCabecera: false,
    verModo: false,
    verModalCrear: false
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
        }
    }
})

export const { toggleOrganizarPorColumna, setOrganizarPorColumna,
                toggleVerOpcionesCabecera, setVerOpcionesCabecera,
                toogleVerModo, setVerModo,
                toggleVerModalCrear, setVerModalCrear } = layoutSlice.actions
export default layoutSlice.reducer