import React from "react";

import { HiCheckCircle } from "react-icons/hi";

export default function EstadosVistaPrevia({ tipoEstado, cantidadEstado}) {
    return (
        <div className="w-full h-20 p-2 rounded-md select-none cursor-pointer
                        flex flex-row items-center justify-between gap-1 overflow-hidden
                        bg-gray-200 dark:bg-black">

            <div className="flex flex-row items-center gap-2">
                <HiCheckCircle className="text-2xl md:text-3xl text-blue-600" />
                <p className="text-base md:text-xl px-1 
                        text-black dark:text-white">
                    {tipoEstado}
                </p>
            </div>

            <p className="text-base md:text-xl px-1 
                        text-black dark:text-white">
                {cantidadEstado}
            </p>

        </div>
    );
}