import React, { useState } from "react";

import { motion } from "framer-motion";

import { useLocation } from "react-router-dom";

import BotonAccion from "../../../../componentes/botones/BotonAccion";

import { HiEye, HiEyeOff } from "react-icons/hi";

import infoRegIniSesion from "../../../../data/infoRegIniSesion.json";

export default function CorreoContrasena() {

    const [verContrasena, setVerContrasena] = useState(false);

    const handleVerContrasena = () => {
        setVerContrasena(!verContrasena);
    }

    const location = useLocation();

    const esRegistro = location.pathname === "/registrar";

    const textoBoton = esRegistro ? infoRegIniSesion.registrate.accionBoton : infoRegIniSesion.iniciar.accionBoton;

    const MiBoton = motion.create(BotonAccion);

    return (
        <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-3">
                <p className="w-full text-left font-bold text-base md:text-xl 
                            select-none truncate
                        text-black dark:text-white">
                    Nombre de usuario
                </p>

                <div className="border border-gray-300 dark:border-gray-700 rounded-md
                                focus-within:border-blue-600
                                active:bg-gray-200 dark:active:bg-gray-700 
                                flex flex-row items-center justify-between">
                    <input
                        className="w-full text-base md:text-xl p-2
                                focus:outline-none 
                                text-black dark:text-white"
                        type="text"
                        placeholder="wanduUsuario123" />
                </div>
            </div>

            <div className="flex flex-col gap-3">
                <p className="w-full text-left font-bold text-base md:text-xl
                            select-none truncate
                        text-black dark:text-white">
                    Contraseña
                </p>

                <div className="border border-gray-300 dark:border-gray-700 rounded-md
                                focus-within:border-blue-600 
                                active:bg-gray-200 dark:active:bg-gray-700
                                flex flex-row items-center justify-between">
                    <input
                        className="w-full text-base md:text-xl p-2
                                    focus:outline-none 
                                    text-black dark:text-white"
                        type={verContrasena ? "text" : "password"}
                        placeholder="wandu se fue a la guerra"
                    />

                    <div className="text-base md:text-xl mr-2
                        text-black dark:text-white cursor-pointer"
                        onClick={handleVerContrasena}>

                        {verContrasena ? <HiEye /> : <HiEyeOff />}
                    </div>

                </div>
            </div>

            <MiBoton
                className="bg-blue-700 text-white hover:bg-blue-900 active:bg-blue-600"
                accion={textoBoton}
                whileTap={{
                    scale: 0.96,
                    boxShadow: "0px 2px 8px rgba(147, 51, 234, 0.3"
                }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
            />

        </div>
    );
}