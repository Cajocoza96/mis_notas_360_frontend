import React from "react";

export default function EstadosVistaPrevia({ iconoEstado, tipoEstado, cantidadEstado, 
                                            no_asignado, pendiente, finalizado, 
                                            seleccionado, onClick }) {
    return (
        <div
            onClick={onClick}
            className={`mx-auto mt-2 w-[98%] h-20 p-2 rounded-md select-none cursor-pointer
                        flex flex-row items-center justify-between gap-1 overflow-hidden
                        transition-all duration-200
                        ${seleccionado ? 'outline-2 outline-black dark:outline-white' : ''}
                        ${no_asignado ? 'bg-blue-200 dark:bg-blue-950':
                            pendiente ? 'bg-yellow-200 dark:bg-yellow-950':
                            finalizado ? 'bg-green-200 dark:bg-green-950': 'bg-gray-200 dark:bg-black'}`}>

            <div className="w-full flex flex-row items-center gap-2">
                <div className="text-2xl md:text-3xl">
                    {iconoEstado}
                </div>

                <p className="text-base md:text-xl px-1 truncate 
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