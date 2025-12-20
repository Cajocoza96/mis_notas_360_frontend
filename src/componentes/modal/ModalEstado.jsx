import React, { useState, useEffect, useMemo } from "react";

import { useDispatch, useSelector } from "react-redux";

import { FaRegCircle, FaCircle } from "react-icons/fa";

import { toggleVerModalEstado, setEstadoSeleccionado } from "../../store/tareasSlice";

import { obtenerOpcionesDisponibles } from "../../utils/estadoUtils";

import { motion } from "framer-motion";

export default function ModalEstado() {

    const dispatch = useDispatch();

    const estadoSeleccionado = useSelector((state) => state.tareas.estadoSeleccionado);

    const tareas = useSelector((state) => state.tareas.tareas);

    const [estadoTemporal, setEstadoTemporal] = useState(estadoSeleccionado);

    const opcionesDisponibles = useMemo(() => {
        return obtenerOpcionesDisponibles(tareas);
    }, [tareas]);
    

    useEffect(() => {
        setEstadoTemporal(estadoSeleccionado);
    }, [estadoSeleccionado]);

    const handleSeleccionarEstado = (estado) => {
        setEstadoTemporal(estado);
    }

    const handleVerModalEstado = () => {
        dispatch(toggleVerModalEstado())
    }

    const handleAceptar = () => {
        dispatch(setEstadoSeleccionado(estadoTemporal));
        dispatch(toggleVerModalEstado());
    }

    return (
        <>
            <motion.div
                onClick={handleVerModalEstado} 
                className="fixed inset-0 z-30 bg-black/70
                            flex items-center justify-center"
                initial={{ opacity: 0}}
                animate={{ opacity: 1}}
                exit={{ opacity: 0}}
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

                    {opcionesDisponibles.includes("no_asignado") && (
                        <div
                            onClick={() => handleSeleccionarEstado("no_asignado")} 
                            className="w-fit cursor-pointer
                                        flex flex-row items-center gap-4">

                            <div>
                                {estadoTemporal === "no_asignado"
                                    ?
                                    <FaCircle className="text-base md:text-lg text-black dark:text-white" />
                                    :
                                    <FaRegCircle className="text-base md:text-lg text-black dark:text-white" />
                                }
                            </div>


                            <p className="text-base md:text-lg text-black dark:text-white">
                                No asignado
                            </p>
                        </div>
                    )}

                    {opcionesDisponibles.includes("pendiente") && (
                        <div 
                            onClick={() => handleSeleccionarEstado("pendiente")}
                            className="w-fit cursor-pointer
                                        flex flex-row items-center gap-4">

                            <div>
                                {estadoTemporal === "pendiente"
                                    ?
                                    <FaCircle className="text-base md:text-lg text-black dark:text-white" />
                                    :
                                    <FaRegCircle className="text-base md:text-lg text-black dark:text-white" />
                                }
                            </div>

                            <p className="text-base md:text-lg text-black dark:text-white">
                                Pendiente
                            </p>
                        </div>
                    )}

                    {opcionesDisponibles.includes("finalizado") && (
                        <div 
                            onClick={() => handleSeleccionarEstado("finalizado")}
                            className="w-fit cursor-pointer
                                        flex flex-row items-center gap-4">
                            <div>
                                {estadoTemporal === "finalizado"
                                    ?
                                    <FaCircle className="text-base md:text-lg text-black dark:text-white" />
                                    :
                                    <FaRegCircle className="text-base md:text-lg text-black dark:text-white" />
                                }
                            </div>

                            <p className="text-base md:text-lg text-black dark:text-white">
                                Finalizado
                            </p>
                        </div>
                    )}

                </div>

                </div>

                <div className="flex flex-row flex-shrink-0 items-center justify-end gap-6 2xl:gap-7">
                    <p
                        className="text-base md:text-lg
                                        text-black dark:text-white cursor-pointer"
                        onClick={handleVerModalEstado}>
                        Cancelar
                    </p>

                    <p
                        className="text-base md:text-lg
                                        text-violet-800 dark:text-white cursor-pointer"
                        onClick={handleAceptar}>
                        Aceptar
                    </p>
                </div>

            </div>
            
            </motion.div>
        </>
    );
}