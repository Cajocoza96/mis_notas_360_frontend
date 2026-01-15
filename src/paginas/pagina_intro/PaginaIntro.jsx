import React from "react";

import BotonAccion from "../../componentes/botones/BotonAccion";

import { HiOutlineBookOpen, HiHand } from "react-icons/hi";

import { useSelector } from "react-redux";

import { motion } from "framer-motion";

import { useNavigate } from "react-router-dom";

export default function PaginaIntro() {

    const { autenticado } = useSelector((state) => state.auth);

    const MiBoton = motion.create(BotonAccion);

    const navigate = useNavigate();

    const handleNavegarPanelPrincipal = () => {
        navigate("/panel-principal");
    }

    return (
        <div className="h-dvh bg-white dark:bg-gray-800
                        text-black dark:text-white 
                        text-base md:text-lg 
                        flex flex-col justify-center">

            <div className="w-[80%] p-2 mx-auto overflow-hidden
                            flex flex-col items-center justify-center gap-2">

                <div className="flex flex-row items-center gap-2 text-center">

                    <div className="flex flex-row items-center gap-2">
                        <HiHand className="text-2xl md:text-3xl" />

                        <p className="font-bold select-none truncate" translate="no">
                            !Bienvenido! a
                        </p>
                    </div>

                    <div className="flex flex-row items-center gap-2">
                        <div>
                            <HiOutlineBookOpen className="text-2xl md:text-3xl" />
                        </div>
                        <p className="text-center font-bold select-none" translate="no">
                            <span translate="no">MisNotas360</span>
                        </p>
                    </div>

                </div>

                <p className="text-wrap">
                    Parece que es tu primera vez aquí. Empieza a organizar tus anotaciones y aprovecha las herramientas de IA para corregir, mejorar, resumir y generar contenido fácilmente.
                </p>

                {autenticado && (
                    <MiBoton
                        className="bg-violet-600 text-white
                                    hover:bg-violet-800 active:bg-violet-700
                        rounded-full"
                        accion="Explorar notas"
                        onClick={handleNavegarPanelPrincipal}
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
                )}

            </div>
        </div>
    );
}