import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    verificandoToken: false,
    mensaje: ''
};

const loadingSlice = createSlice({
    name: 'loading',
    initialState,
    reducers: {
        iniciarVerificacionToken: (state, action) => {
            state.verificandoToken = true;
            state.mensaje = action.payload || 'Verificando...';
        },
        finalizarVerificacionToken: (state) => {
            state.verificandoToken = false;
            state.mensaje = '';
        }
    }
});

export const { 
    iniciarVerificacionToken, 
    finalizarVerificacionToken 
} = loadingSlice.actions;

export default loadingSlice.reducer;