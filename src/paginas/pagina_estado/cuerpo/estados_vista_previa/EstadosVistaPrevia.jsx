import React from "react";

export default function EstadosVistaPrevia({ iconoEstado, tipoEstado, cantidadEstado, 
                                            no_asignado, pendiente, finalizado, 
                                            seleccionado, onClick }) {
    return (
        <div
            onClick={onClick}
            className={`mx-auto mt-2 w-[98%] h-20 p-2 rounded-md border select-none cursor-pointer
                        flex flex-row items-center justify-between gap-1 overflow-hidden
                        transition-all duration-200
                        ${seleccionado ? 'outline-2 outline-black dark:outline-white' : ''}
                        ${no_asignado ? 'border-blue-700 dark:border-blue-300 bg-blue-200 dark:bg-blue-950 hover:bg-blue-300 active:bg-blue-300 dark:hover:bg-blue-900 dark:active:bg-blue-900':
                            pendiente ? 'border-yellow-700 dark:border-yellow-300 bg-yellow-200 dark:bg-yellow-950 hover:bg-yellow-300 active:bg-yellow-300 dark:hover:bg-yellow-900 dark:active:bg-yellow-900':
                            finalizado ? 'border-green-700 dark:border-green-300 bg-green-200 dark:bg-green-950 hover:bg-green-300 active:bg-green-300 dark:hover:bg-green-900 dark:active:bg-green-900': 'border-gray-700 dark:border-gray-300 bg-gray-200 dark:bg-black hover:bg-gray-300 active:bg-gray-300 dark:hover:bg-gray-900 dark:active:bg-gray-900'}`}>

            <div className="w-full flex flex-row items-center gap-2">
                <div className="text-2xl md:text-3xl">
                    {iconoEstado}
                </div>

                <p className="text-base md:text-lg px-1 truncate 
                        text-black dark:text-white">
                    {tipoEstado}
                </p>
            </div>

            <p className="text-base md:text-lg px-1 
                        text-black dark:text-white">
                {cantidadEstado}
            </p>

        </div>
    );
}