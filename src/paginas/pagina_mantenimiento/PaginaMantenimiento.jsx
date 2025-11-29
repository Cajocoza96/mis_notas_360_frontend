import React from "react";

import Lottie from "lottie-react";

import { useSelector } from "react-redux";

import mantenimiento from "../../assets/lottie/pagina_mantenimiento/mantenimiento.json";

import Toast from "../../componentes/toast/Toast";
import useToastConexion from "../../hooks/useToastConexion";

export default function PaginaMantenimiento() {

    const verToast = useSelector((state) => state.acceso.verToast);

    // ✅ Hook que maneja automáticamente los toasts de conexión
    useToastConexion();

    return (
        <div className="mx-auto h-dvh bg-white dark:bg-gray-800 
                        overflow-hidden overflow-y-auto
                        flex flex-col 2xs:flex-row 
                        items-center justify-center gap-3">

            {verToast && (
                <Toast />
            )}

            <div className="w-[90%] lg:w-[50%] flex items-center justify-center">
                <Lottie className="w-full object-cover"
                    animationData={mantenimiento} loop={true} />
            </div>

            <div className="flex flex-col items-center gap-5">
                <p className="text-center text-xl md:text-2xl 
                            font-bold select-none
                            text-black dark:text-white">
                    <span translate="no">MisNotas360</span> está en mantenimiento
                </p>

                <p className="text-center text-base md:text-xl 
                            font-bold select-none
                            text-gray-600 dark:text-gray-400">
                    Se trabajará en todo lo posible.
                </p>

                <p className="text-center text-base md:text-xl 
                            font-bold select-none
                            text-gray-600 dark:text-gray-400">
                    El objetivo es mejorar su experiencia.
                </p>

                <p className="text-center text-base md:text-xl 
                            font-bold select-none
                            text-gray-600 dark:text-gray-400">
                    Por favor espera..
                </p>
            </div>

        </div>
    );
}