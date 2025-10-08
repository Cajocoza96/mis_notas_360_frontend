import { configureStore } from "@reduxjs/toolkit";
import layoutReducer from "./layoutSlice";
import tareasReducer from "./tareasSlice";

export const store = configureStore({
    reducer: {
        layout: layoutReducer,
        tareas: tareasReducer
    }
})