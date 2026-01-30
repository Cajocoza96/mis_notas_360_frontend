import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaRegCircle, FaCircle } from "react-icons/fa";
import { toggleVerModalOrdenTareas, setOrdenTareasTemporal, 
        aplicarOrdenTareas, cancelarOrdenTareas  } from "../../store/tareasSlice";
import { motion } from "framer-motion";

export default function ModalOrdenarTareas() {
    const dispatch = useDispatch();
    const ordenTareasTemporal = useSelector((state) => state.tareas.ordenTareasTemporal);
    const ordenTareasSeleccionado = useSelector((state) => state.tareas.ordenTareasSeleccionado);
    
    const handleCancelar = () => {
        dispatch(cancelarOrdenTareas());
        dispatch(toggleVerModalOrdenTareas());
    }

    const handleSeleccionOrden = (tipoOrden) => {
        dispatch(setOrdenTareasTemporal(tipoOrden));
        
        //  Si ya estaba seleccionado antes, aplicar inmediatamente
        if (tipoOrden === ordenTareasSeleccionado) {
            dispatch(aplicarOrdenTareas());
            dispatch(toggleVerModalOrdenTareas());
        }
    }

    const handleAceptar = () => {
        //  Solo aplicar si es diferente al actual
        if (ordenTareasTemporal !== ordenTareasSeleccionado) {
            dispatch(aplicarOrdenTareas());
        }
        dispatch(toggleVerModalOrdenTareas());
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

                            {/* Creación */}
                            <div
                                onClick={() => handleSeleccionOrden('creacion')}
                                className="w-fit cursor-pointer
                                            flex flex-row items-center gap-4">
                                <div>
                                    {ordenTareasTemporal === 'creacion' ?
                                        <FaCircle className="text-base md:text-lg text-black dark:text-white" />
                                        :
                                        <FaRegCircle className="text-base md:text-lg text-black dark:text-white" />
                                    }
                                </div>
                                <p className="text-base md:text-lg text-black dark:text-white">
                                    Creación
                                </p>
                            </div>
                            
                            {/* Ascendente */}
                            <div
                                onClick={() => handleSeleccionOrden('ascendente')}
                                className="w-fit cursor-pointer
                                            flex flex-row items-center gap-4">
                                <div>
                                    {ordenTareasTemporal === 'ascendente' ?
                                        <FaCircle className="text-base md:text-lg text-black dark:text-white" />
                                        :
                                        <FaRegCircle className="text-base md:text-lg text-black dark:text-white" />
                                    }
                                </div>
                                <p className="text-base md:text-lg text-black dark:text-white">
                                    Ascendente
                                </p>
                            </div>
                            
                            {/* Descendente */}
                            <div
                                onClick={() => handleSeleccionOrden('descendente')}
                                className="w-fit cursor-pointer
                                            flex flex-row items-center gap-4">
                                <div>
                                    {ordenTareasTemporal === 'descendente' ?
                                        <FaCircle className="text-base md:text-lg text-black dark:text-white" />
                                        :
                                        <FaRegCircle className="text-base md:text-lg text-black dark:text-white" />
                                    }
                                </div>
                                <p className="text-base md:text-lg text-black dark:text-white">
                                    Descendente
                                </p>
                            </div>
                        </div>

                    </div>

                    <div className="flex flex-row flex-shrink-0 items-center justify-end gap-6 2xl:gap-7">
                        <p
                            className="text-base md:text-lg
                                                text-black dark:text-white cursor-pointer"
                            onClick={handleCancelar}>
                            Cancelar
                        </p>
                        
                        <p
                            onClick={handleAceptar}
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