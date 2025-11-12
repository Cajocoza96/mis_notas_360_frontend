import { configureStore } from "@reduxjs/toolkit";
import layoutReducer, { resetAllLayoutState } from "./layoutSlice";
import tareasReducer from "./tareasSlice";
import accesoReducer from "./accesoSlice";
import anotacionesReducer from "./anotacionesSlice";
import busquedaReducer from "./busquedaSlice";
import preferenciaReducer from "./preferenciaSlice"
import loadingReducer from "./loadingSlice";

export const store = configureStore({
    reducer: {
        layout: layoutReducer,
        tareas: tareasReducer,
        acceso: accesoReducer,
        anotaciones: anotacionesReducer,
        busqueda: busquedaReducer,
        preferencia: preferenciaReducer,
        loading: loadingReducer
    }
})