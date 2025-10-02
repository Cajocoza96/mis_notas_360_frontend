import React, { useState } from "react";

import { useDispatch } from "react-redux";

import { FaRegCircle, FaCircle } from "react-icons/fa";

import { toggleVerModalEstado } from "../../store/layoutSlice";

export default function ModalEstado() {

    const [estadoNoAsignado, setEstadoNoAsignado] = useState(false);

    const handleEstadoNoAsignado = () => {
        setEstadoNoAsignado(!estadoNoAsignado)
    }


    const [estadoPendiente, setEstadoPendiente] = useState(false);

    const handleEstadoPendiente = () => {
        setEstadoPendiente(!estadoPendiente)
    }


    const [estadoFinalizado, setEstadoFinalizado] = useState(false);

    const handleEstadoFinalizado = () => {
        setEstadoFinalizado(!estadoFinalizado)
    }



    const dispatch = useDispatch();

    const handleVerModalEstado = () => {
        dispatch(toggleVerModalEstado())
    }



    return (
        <>
            <div className="fixed inset-0 z-30 bg-black/70" onClick={handleVerModalEstado}></div>

            <div className="bg-white dark:bg-gray-800 
                            z-50 p-3 overflow-hidden
                        absolute top-1/2 left-1/2 transform -translate-x-1/2  -translate-y-1/2
                        w-[90%] h-auto ">

                <div className="flex flex-col gap-2">

                    <div className="flex flex-row items-center gap-4 select-none">

                        <div onClick={handleEstadoNoAsignado}>
                        {estadoNoAsignado 
                            ? 
                            <FaCircle className="text-base md:text-xl text-black dark:text-white"/>
                            :
                            <FaRegCircle className="text-base md:text-xl text-black dark:text-white" />
                        }
                        </div>
                        

                        <p className="text-base md:text-xl text-black dark:text-white">
                            No asignado
                        </p>
                    </div>

                    <div className="flex flex-row items-center gap-4 select-none">

                        <div onClick={handleEstadoPendiente}>
                        {estadoPendiente 
                            ? 
                            <FaCircle className="text-base md:text-xl text-black dark:text-white"/>
                            :
                            <FaRegCircle className="text-base md:text-xl text-black dark:text-white" />
                        }
                        </div>

                        <p className="text-base md:text-xl text-black dark:text-white">
                            Pendiente
                        </p>
                    </div>

                    <div className="flex flex-row items-center gap-4 select-none">

                        <div onClick={handleEstadoFinalizado}>
                        {estadoFinalizado 
                            ? 
                            <FaCircle className="text-base md:text-xl text-black dark:text-white"/>
                            :
                            <FaRegCircle className="text-base md:text-xl text-black dark:text-white" />
                        }
                        </div>

                        <p className="text-base md:text-xl text-black dark:text-white">
                            Finalizado
                        </p>
                    </div>

                </div>

                <div className="flex flex-row items-center justify-end gap-6 2xl:gap-7">
                    <p
                        className="text-base md:text-xl
                                        text-black dark:text-white cursor-pointer"
                        onClick={handleVerModalEstado}>
                        Cancelar
                    </p>

                    <p
                        className="text-base md:text-xl
                                        text-blue-800 dark:text-white cursor-pointer">
                        Aceptar
                    </p>
                </div>

            </div>

        </>
    );
}