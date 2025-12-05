import React from "react";

import { useDispatch, useSelector } from "react-redux";

import { HiPlusCircle, HiMinusCircle, HiClock, HiCheckCircle } from "react-icons/hi";

import { toggleVerModalEstado } from "../../store/tareasSlice";

import { obtenerTextoEstado } from "../../utils/estadoUtils";

export default function AgregarEstado() {

    const dispatch = useDispatch();
    const { estadoSeleccionado } = useSelector((state) => state.tareas);

    const handleVerModalEstado = () => {
        dispatch(toggleVerModalEstado())
    }

    return (
        <div className="select-none cursor-pointer 
                                flex flex-row items-center gap-1 flex-shrink-0"
            onClick={handleVerModalEstado}>

            {estadoSeleccionado ? (
                <>
                    <div className="text-2xl md:text-3xl">
                        {estadoSeleccionado === "no_asignado" ?
                            <HiMinusCircle className="text-blue-700" /> :

                            estadoSeleccionado === "pendiente" ?
                                <HiClock className="text-yellow-700" /> :

                                estadoSeleccionado === "finalizado" ?
                                    <HiCheckCircle className="text-green-700" /> : ''}
                    </div>

                    <p className="text-base md:text-lg text-black dark:text-white">
                        {obtenerTextoEstado(estadoSeleccionado)}
                    </p>
                </>
            ) : (
                <>
                    <HiPlusCircle className="text-2xl md:text-3xl  text-violet-800 dark:text-violet-400 " />
                    <p className="text-base md:text-lg text-black dark:text-white">
                        Agregar estado
                    </p>
                </>
            )}

        </div>
    );
}