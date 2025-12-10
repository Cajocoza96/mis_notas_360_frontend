import React from "react";

import { useDispatch, useSelector } from "react-redux";

import { toggleVerModalPapeleraNota, toggleVerModalEliminarNotaDefinitiva, setAnotacionId } from "../../store/tareasSlice";

import { toggleVerAdminAnotacion, toggleSeleccionar,
        toggleSeleccionAnotacion } from "../../store/anotacionesSlice";

import { motion } from "framer-motion";

export default function AdminAnotacion() {

    const dispatch = useDispatch();

    const verAdminAnotacion = useSelector((state) => state.anotaciones.verAdminAnotacion);

    const anotacionId = useSelector((state) => state.tareas.anotacionId);

    const handleVerAdminAnotacion = () => {
        dispatch(toggleVerAdminAnotacion());
    }

    const handleSeleccionar = () => {
        if(verAdminAnotacion) {
            dispatch(toggleVerAdminAnotacion())
        }

        // ✅ Activar modo selección
        dispatch(toggleSeleccionar());
        
        // ✅ Seleccionar automáticamente esta anotación
        dispatch(toggleSeleccionAnotacion(anotacionId));
    }

    const handleVerPapeleraNota = () => {
        if (verAdminAnotacion) {
            dispatch(toggleVerAdminAnotacion())
        }

        dispatch(setAnotacionId(anotacionId))
        dispatch(toggleVerModalPapeleraNota())
    }

    const handleVerEliminarNotaDefinitiva = () => {
        if (verAdminAnotacion) {
            dispatch(toggleVerAdminAnotacion())
        }

        dispatch(setAnotacionId(anotacionId))
        dispatch(toggleVerModalEliminarNotaDefinitiva())
    }

    return (
        <>
            <motion.div
                onClick={handleVerAdminAnotacion}
                className="fixed inset-0 z-50 bg-black/70 select-none
                            flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}>

                <div
                    onClick={(e) => e.stopPropagation()}
                    className="bg-violet-700
                        z-50 p-3 overflow-hidden rounded-lg
                        h-auto shadow-2xl">

                    <div className="text-base md:text-lg text-white
                            flex flex-col gap-4">

                        <p 
                            onClick={handleSeleccionar}
                            className="cursor-pointer whitespace-nowrap">
                            Seleccionar
                        </p>

                        <p
                            onClick={handleVerPapeleraNota}
                            className="cursor-pointer whitespace-nowrap">
                            Mover a papelera
                        </p>

                        <p
                            onClick={handleVerEliminarNotaDefinitiva}
                            className="cursor-pointer whitespace-nowrap">
                            Eliminar definitivamente
                        </p>
                    </div>

                </div>

            </motion.div>
        </>
    );
}