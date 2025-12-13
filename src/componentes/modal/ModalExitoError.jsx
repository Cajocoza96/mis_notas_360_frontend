import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { HiCheckCircle, HiXCircle } from "react-icons/hi";

import iconoError from "../../assets/lottie/modal_exito_error/iconoError.json";
import iconoExito from "../../assets/lottie/modal_exito_error/iconoExito.json";

import { motion } from "framer-motion";

import Lottie from "lottie-react";

export default function ModalExitoError({ animado }) {

    const dispatch = useDispatch();

    // ✅ Obtener el estado desde Redux
    const {
        mostrarModalNotificacion,
        mensajeNotificacion,
        esErrorNotificacion
    } = useSelector((state) => state.anotaciones);

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
                                animado ? (
                                    <div className="w-[80%] lg:w-[60%] flex items-center justify-center">
                                        <Lottie className="w-full object-cover"
                                            animationData={iconoError} loop={true} />
                                    </div>
                                ) : (
                                    < HiXCircle className="text-8xl 2xl:text-10xl text-red-500" />
                                )

                            ) : (
                                animado ? (
                                    <div className="w-[80%] lg:w-[60%] flex items-center justify-center">
                                        <Lottie className="w-full object-cover"
                                            animationData={iconoExito} loop={true} />
                                    </div>
                                ) : (
                                    <HiCheckCircle className="text-8xl 2xl:text-10xl text-green-500" />
                                )
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