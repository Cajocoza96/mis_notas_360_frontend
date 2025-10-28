import React from "react";

import { useDispatch } from "react-redux";

import { toggleVerModalRestaurarNota, 
        toggleVerModalEliminarNotaDefinitiva, setAnotacionId } from "../../../../store/tareasSlice";

import { HiOutlineRefresh, HiXCircle } from "react-icons/hi";

export default function EliminadaNotaVistaPrevia({ anotacionId, texto, fechaCreacion }) {

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
        <div className="w-full h-20 p-2 rounded-md select-none
                        flex flex-row items-center justify-between gap-1 overflow-hidden
                        bg-gray-200 dark:bg-black">

            <div className="flex flex-col items-center">
                <p className="text-base md:text-xl px-1
                            text-black dark:text-white">
                    {texto}
                </p>
                <p className="text-sm md:text-base px-1
                            text-blue-600 dark:text-white">
                    {fechaCreacion}
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