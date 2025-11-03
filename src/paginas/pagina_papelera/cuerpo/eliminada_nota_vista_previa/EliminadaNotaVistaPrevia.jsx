import React from "react";

import { useDispatch } from "react-redux";

import {
    toggleVerModalRestaurarNota,
    toggleVerModalEliminarNotaDefinitiva, setAnotacionId
} from "../../../../store/tareasSlice";

import { HiOutlineRefresh, HiXCircle, HiMinusCircle, HiClock, HiCheckCircle } from "react-icons/hi";

export default function EliminadaNotaVistaPrevia({ anotacionId, texto,
                                                no_asignado, pendiente, finalizado }) {

    const dispatch = useDispatch();

    const handleVerModalRestaurarNota = () => {
        //Guardar el ID de la anotacion en Redux antes de abrir el modal
        dispatch(setAnotacionId(anotacionId));

        dispatch(toggleVerModalRestaurarNota());
    }

    const handleVerModalEliminarNotaDefinitiva = () => {
        //Guardar el ID de la anotacion en Redux antes de abrir el modal
        dispatch(setAnotacionId(anotacionId));

        dispatch(toggleVerModalEliminarNotaDefinitiva());
    }

    return (
        <div className={`w-full h-20 p-2 rounded-md select-none
                        flex flex-row items-center justify-between gap-1 overflow-hidden
                        ${no_asignado ? 'bg-blue-200 dark:bg-blue-950' :
                        pendiente ? 'bg-yellow-200 dark:bg-yellow-950' :
                        finalizado ? 'bg-green-200 dark:bg-green-950' : 'bg-gray-200 dark:bg-black'}`}>

            <div className="flex flex-row items-center gap-2">
                <div className="text-2xl md:text-3xl">

                    {no_asignado && (
                        <HiMinusCircle className="text-blue-700" />
                    )}

                    {pendiente && (
                        <HiClock className="text-yellow-700" />
                    )}

                    {finalizado && (
                        <HiCheckCircle className="text-green-700" />
                    )}
                </div>

                <p className="text-base md:text-xl
                            text-black dark:text-white">
                    {texto}
                </p>
            </div>

            <div className="flex flex-row items-center gap-6">
                <HiOutlineRefresh
                    onClick={handleVerModalRestaurarNota}
                    title="Restaurar nota"
                    className="text-2xl md:text-3xl cursor-pointer
                                        text-black dark:text-white"/>
                <HiXCircle
                    onClick={handleVerModalEliminarNotaDefinitiva}
                    title="Eliminar nota"
                    className="text-2xl md:text-3xl cursor-pointer
                                text-red-600"/>
            </div>
        </div>
    );
}