import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { HiCheckCircle, HiXCircle } from "react-icons/hi";

import { motion } from "framer-motion";

export default function ModalExitoError() {

    const dispatch = useDispatch();

    // ✅ Obtener el estado desde Redux
    const {
        mostrarModalNotificacion,
        mensajeNotificacion,
        esErrorNotificacion
    } = useSelector((state) => state.anotaciones);

    /*
    const handleCerrarModalExitoError = () => {
        dispatch(ocultarNotificacion());
    }
    */

    // ✅ Si no debe mostrarse, retornar null
    if (!mostrarModalNotificacion) {
        return null;
    }

    return (
        <>
            <motion.div
                className="fixed inset-0 z-50 bg-black/70
                                flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}>

                <div
                    className="bg-white dark:bg-gray-800 select-none
                                    z-50 p-3 overflow-hidden rounded-lg
                                    w-[90%] max-w-md h-auto shadow-2xl">

                    <div className="mx-auto w-full flex flex-col items-center gap-4 2xl:gap-8">
                        <div className="flex flex-col items-center gap-2 2xl:gap-6">

                            {/* Icono dinámico según el tipo de modal */}
                            {esErrorNotificacion ? (
                                <HiXCircle className="text-8xl 2xl:text-10xl text-red-500" />
                            ) : (
                                <HiCheckCircle className="text-8xl 2xl:text-10xl text-green-500" />
                            )}

                            <p className="text-center text-base md:text-lg 
                                    text-black dark:text-white">
                                {mensajeNotificacion}
                            </p>

                        </div>

                    </div>
                </div>

            </motion.div>
        </>
    );
}