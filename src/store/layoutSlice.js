import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    organizarPorColumna: true,
    verOpcionesCabecera: false,
    verModo: false
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
        }
    }
})

export const { toggleOrganizarPorColumna, setOrganizarPorColumna,
                toggleVerOpcionesCabecera, setVerOpcionesCabecera,
                toogleVerModo, setVerModo } = layoutSlice.actions
export default layoutSlice.reducer