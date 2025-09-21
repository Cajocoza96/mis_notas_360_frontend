import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    organizarPorColumna: true
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
        }
    }
})

export const { toggleOrganizarPorColumna, setOrganizarPorColumna } = layoutSlice.actions
export default layoutSlice.reducer