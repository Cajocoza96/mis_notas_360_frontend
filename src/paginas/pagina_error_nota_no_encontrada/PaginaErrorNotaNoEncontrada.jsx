import React from "react";

import { useNavigate, useLocation } from "react-router-dom";

import { useSelector } from "react-redux";

import Lottie from "lottie-react";

import error404 from "../../assets/lottie/pagina_error/error404.json";

import notaNoEncontrada from "../../assets/lottie/nota_no_encontrada/notaNoEncontrada.json";

import BotonAccion from "../../componentes/botones/BotonAccion";

import { motion } from "framer-motion";

import Toast from "../../componentes/toast/Toast";

export default function PaginaErrorNotaNoEncontrada() {

    const MiBoton = motion.create(BotonAccion);

    const navigate = useNavigate();

    const handleNavegarInicio = () => navigate("/");

    const verToast = useSelector((state) => state.acceso.verToast);

    const location = useLocation();

    const esRutaNotaNoEncontrada = location.pathname.includes('/nota-no-encontrada');

    return (
        <div className="h-dvh bg-white dark:bg-gray-800 
                        overflow-hidden overflow-y-auto
                        flex flex-col items-center justify-center gap-2">

            {verToast && (
                <Toast />
            )}

            {esRutaNotaNoEncontrada ? (
                <div className="flex items-center justify-center mt-4">
                    <Lottie className="w-[50%] 2xs:w-[35%] lg:w-[60%] object-cover" animationData={notaNoEncontrada} loop={true} />
                </div>
            ) : (
                <div className="flex items-center justify-center mt-4">
                    <Lottie className="w-[50%] 2xs:w-[35%] lg:w-[60%] object-cover" animationData={error404} loop={true} />
                </div>
            )}


            <div className="flex flex-col items-center gap-5">
                {esRutaNotaNoEncontrada ? (
                    <p className="text-center text-xl md:text-2xl 
                    font-bold select-none
                    text-black dark:text-white">
                        Nota no encontrada
                    </p>
                ) : (
                    <p className="text-center text-xl md:text-2xl 
                    font-bold select-none
                    text-black dark:text-white">
                        Página no encontrada
                    </p>
                )}


                <MiBoton
                    className="bg-violet-800 text-white cursor-pointer
                                    hover:bg-violet-800 active:bg-violet-800
                        rounded-full mb-4"
                    accion="Volver a inicio"
                    onClick={handleNavegarInicio}
                    whileHover={{
                        scale: 1.15,
                        boxShadow: "0px 4px 20px rgba(147, 51, 234, 0.4)"
                    }}
                    whileTap={{
                        scale: 0.96,
                        boxShadow: "0px 2px 8px rgba(147, 51, 234, 0.3"
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 10 }}
                />
            </div>

        </div>
    );
}