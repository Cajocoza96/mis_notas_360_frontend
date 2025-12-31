import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";

import { FaCircle, FaRegCircle } from "react-icons/fa";
import { FcCheckmark, FcEditImage, FcList, FcTodoList } from "react-icons/fc";

import {
    toggleVerModalModosIA,
    setModoIASeleccionado,
    setVerModalTiNoTa,
    resetSeccionesSeleccionadas
} from "../../store/tareasSlice";

export default function ModalModosIA() {

    const dispatch = useDispatch();

    const { titulo, nota, tareas } = useSelector((state) => state.tareas);

    const [modoSeleccionado, setModoSeleccionado] = useState(null);

    const handleSeleccionar = (modo) => {
        setModoSeleccionado(modo);
        dispatch(setModoIASeleccionado(modo));
    };

    const handleCancelar = () => {
        setModoSeleccionado(null);
        dispatch(setModoIASeleccionado(null));
        dispatch(toggleVerModalModosIA());
    };

    // ✅ Validar si se puede aceptar según el modo y contenido disponible
    const puedeAceptar = () => {
        if (!modoSeleccionado) return false;

        const tieneTitulo = titulo && titulo.trim() !== '';
        const tienNota = nota && nota.trim() !== '';
        const tieneTareas = tareas && tareas.length > 0;

        // ✅ Punto 3: Si no hay nada en ningún lado, deshabilitar
        if (!tieneTitulo && !tienNota && !tieneTareas) {
            return false;
        }

        // ✅ Punto 2: Si solo hay tareas y el modo es 'summarize' o 'text-to-tasks', deshabilitar
        if (tieneTareas && !tieneTitulo && !tienNota) {
            if (modoSeleccionado === 'summarize' || modoSeleccionado === 'text-to-tasks') {
                return false;
            }
        }

        return true;
    };

    const handleAceptar = () => {
        if (!puedeAceptar()) return;

        // ✅ Resetear secciones seleccionadas
        dispatch(resetSeccionesSeleccionadas());

        // ✅ Cerrar modal de modos y abrir modal de secciones
        dispatch(toggleVerModalModosIA());
        dispatch(setVerModalTiNoTa(true));
    };

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
                                flex flex-col max-h-[90dvh]">

                    <div className="flex flex-col flex-1 
                                    overflow-y-auto overflow-x-hidden min-h-0">

                        {/* Opciones de IA */}
                        <div className="flex flex-col gap-2">

                            {/* Corregir ortografía y gramática */}
                            <div
                                onClick={() => handleSeleccionar('correct')}
                                className="w-fit cursor-pointer flex flex-row items-center gap-4">
                                <div>
                                    {modoSeleccionado === 'correct' ? (
                                        <FaCircle className="text-base md:text-lg text-violet-800 dark:text-violet-400" />
                                    ) : (
                                        <FaRegCircle className="text-base md:text-lg text-black dark:text-white" />
                                    )}
                                </div>

                                <div className="text-2xl md:text-3xl">
                                    <FcCheckmark />
                                </div>
                                <p className="text-base md:text-lg text-black dark:text-white">
                                    Corregir ortografía y gramática
                                </p>
                            </div>

                            {/* Mejorar redacción */}
                            <div
                                onClick={() => handleSeleccionar('improve')}
                                className="w-fit cursor-pointer flex flex-row items-center gap-4">
                                <div>
                                    {modoSeleccionado === 'improve' ? (
                                        <FaCircle className="text-base md:text-lg text-violet-800 dark:text-violet-400" />
                                    ) : (
                                        <FaRegCircle className="text-base md:text-lg text-black dark:text-white" />
                                    )}
                                </div>

                                <div className="text-2xl md:text-3xl">
                                    <FcEditImage />
                                </div>
                                <p className="text-base md:text-lg text-black dark:text-white">
                                    Mejorar redacción
                                </p>
                            </div>

                            {/* Resumir texto */}
                            <div
                                onClick={() => handleSeleccionar('summarize')}
                                className="w-fit cursor-pointer flex flex-row items-center gap-4">
                                <div>
                                    {modoSeleccionado === 'summarize' ? (
                                        <FaCircle className="text-base md:text-lg text-violet-800 dark:text-violet-400" />
                                    ) : (
                                        <FaRegCircle className="text-base md:text-lg text-black dark:text-white" />
                                    )}
                                </div>
                                <div className="text-2xl md:text-3xl">
                                    <FcList />
                                </div>
                                <p className="text-base md:text-lg text-black dark:text-white">
                                    Resumir texto
                                </p>
                            </div>

                            {/* Convertir texto a tareas */}
                            <div
                                onClick={() => handleSeleccionar('text-to-tasks')}
                                className="w-fit cursor-pointer flex flex-row items-center gap-4">
                                <div>
                                    {modoSeleccionado === 'text-to-tasks' ? (
                                        <FaCircle className="text-base md:text-lg text-violet-800 dark:text-violet-400" />
                                    ) : (
                                        <FaRegCircle className="text-base md:text-lg text-black dark:text-white" />
                                    )}
                                </div>
                                <div className="text-2xl md:text-3xl">
                                    <FcTodoList />
                                </div>
                                <p className="text-base md:text-lg text-black dark:text-white">
                                    Convertir texto a tareas
                                </p>
                            </div>

                        </div>

                    </div>

                    <div className="flex flex-row flex-shrink-0 items-center justify-end gap-6 2xl:gap-7 mt-4">
                        <p
                            onClick={handleCancelar}
                            className="text-base md:text-lg cursor-pointer text-black dark:text-white">
                            Cancelar
                        </p>

                        <p
                            onClick={handleAceptar}
                            className={`text-base md:text-lg
                                        ${puedeAceptar() ? 'cursor-pointer text-violet-800 dark:text-violet-400' : 'cursor-not-allowed opacity-50 text-gray-400'}`}>
                            Aceptar
                        </p>
                    </div>

                </div>

            </motion.div>
        </>
    );
}