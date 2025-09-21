import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    organizarPorColumna: true,
    verOpcionesCabecera: false
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
        }
    }
})

export const { toggleOrganizarPorColumna, setOrganizarPorColumna,
                toggleVerOpcionesCabecera, setVerOpcionesCabecera } = layoutSlice.actions
export default layoutSlice.reducer