import React from "react";

import { useNavigate } from "react-router-dom";

import Lottie from "lottie-react";

import error404 from "../../assets/lottie/pagina_error/error404.json";

import BotonAccion from "../../componentes/botones/BotonAccion";

import { motion } from "framer-motion";

export default function PaginaError() {

    const MiBoton = motion.create(BotonAccion);

    const navigate = useNavigate();

    const handleNavegarInicio = () => navigate("/");

    return (
        <div className="h-dvh bg-white dark:bg-gray-800 
                        overflow-hidden overflow-y-auto
                        flex flex-col items-center justify-center gap-2">

            <div className="flex items-center justify-center">
                <Lottie className="w-[60%] object-cover" animationData={error404} loop={true} />
            </div>

            <div className="flex flex-col items-center gap-5">
                <p className="text-center text-xl md:text-2xl 
                            font-bold select-none
                            text-black dark:text-white">
                    Página no encontrada
                </p>

                <MiBoton
                    className="bg-violet-800 text-white
                                    hover:bg-violet-800 active:bg-violet-800
                        rounded-full"
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