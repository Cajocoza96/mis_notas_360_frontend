import React from "react";

import Lottie from "lottie-react";

import mantenimiento from "../../assets/lottie/pagina_mantenimiento/mantenimiento.json";

export default function PaginaMantenimiento() {
    return (
        <div className="mx-auto w-[90%] min-h-dvh bg-white dark:bg-gray-800 
                        overflow-hidden
                        flex flex-col lg:flex-row 
                        items-center justify-center">

            <div className="w-[90%] lg:w-[50%] flex items-center justify-center">
                <Lottie className="w-full object-cover"
                    animationData={mantenimiento} loop={true} />
            </div>

            <div className="flex flex-col items-center gap-5">
                <p className="text-center text-xl md:text-2xl 
                            font-bold select-none
                            text-black dark:text-white">
                    <span translate="no">Misnotas360</span> está en mantenimiento
                </p>

                <p className="text-center text-base md:text-xl 
                            font-bold select-none
                            text-gray-600 dark:text-gray-400">
                    Se trabajará en todo lo posible para mejorar su experiencia.
                </p>

                <p className="text-center text-base md:text-xl 
                            font-bold select-none
                            text-gray-600 dark:text-gray-400">
                    Por favor espera
                </p>
            </div>

        </div>
    );
}