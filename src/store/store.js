import { configureStore } from "@reduxjs/toolkit";
import layoutReducer from "./layoutSlice";
import tareasReducer from "./tareasSlice";
import accesoReducer from "./accesoSlice";
import anotacionesReducer from "./anotacionesSlice";

export const store = configureStore({
    reducer: {
        layout: layoutReducer,
        tareas: tareasReducer,
        acceso: accesoReducer,
        anotaciones: anotacionesReducer
    }
})