import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";

import { FcCheckmark, FcEditImage, FcList, FcTodoList } from "react-icons/fc";

import { toggleVerModalModosIA } from "../../store/tareasSlice";

export default function ModalModosIA() {

    const dispatch = useDispatch();

    const verModalModosIA = useSelector((state) => state.tareas.verModalModosIA);

    const handleCancelar = () => {
        if (verModalModosIA) {
            dispatch(toggleVerModalModosIA());
        }
    }

    return (
        <>
            <motion.div
                onClick={handleCancelar}
                className="fixed inset-0 z-30 bg-black/70
                                            flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}>

                <div
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white dark:bg-gray-800 
                                            z-50 p-3 overflow-hidden
                                            w-[75%] 2xs:w-[55%] select-none
                                            flex flex-col max-h-[90dvh] ">

                    <div className="flex flex-col flex-1 
                                                overflow-y-auto overflow-x-hidden min-h-0">

                        <div className="flex flex-col gap-2">

                            {/* Corregir ortografía y gramática */}
                            <div
                                className="w-fit cursor-pointer
                                                    flex flex-row items-center gap-4">
                                <div className="text-2xl md:text-3xl">
                                    <FcCheckmark/>
                                </div>
                                <p className="text-base md:text-lg text-black dark:text-white">
                                    Corregir ortografía y gramática
                                </p>
                            </div>

                            {/* Mejorar redacción */}
                            <div
                                className="w-fit cursor-pointer
                                                    flex flex-row items-center gap-4">
                                <div className="text-2xl md:text-3xl">
                                    <FcEditImage/>
                                </div>
                                <p className="text-base md:text-lg text-black dark:text-white">
                                    Mejorar redacción
                                </p>
                            </div>

                            {/* Resumir texto */}
                            <div
                                className="w-fit cursor-pointer
                                                    flex flex-row items-center gap-4">
                                <div className="text-2xl md:text-3xl">
                                    <FcList/>
                                </div>
                                <p className="text-base md:text-lg text-black dark:text-white">
                                    Resumir texto
                                </p>
                            </div>

                            {/* Convertir texto a tareas */}
                            <div
                                className="w-fit cursor-pointer
                                                    flex flex-row items-center gap-4">
                                <div className="text-2xl md:text-3xl">
                                    <FcTodoList/>
                                </div>
                                <p className="text-base md:text-lg text-black dark:text-white">
                                    Convertir texto a tareas
                                </p>
                            </div>

                        </div>

                    </div>

                    <div className="flex flex-row flex-shrink-0 items-center justify-end gap-6 2xl:gap-7">
                        <p
                            onClick={handleCancelar}
                            className="text-base md:text-lg
                                    text-black dark:text-white cursor-pointer">

                            Cancelar
                        </p>

                        <p
                            /*onClick={handleAceptar}*/
                            className="text-base md:text-lg
                                                text-violet-800 dark:text-white cursor-pointer">
                            Aceptar
                        </p>
                    </div>

                </div>

            </motion.div>
        </>
    );
}