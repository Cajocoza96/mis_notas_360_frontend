import React, { useState } from "react";

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

    return (
        <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-3">
                <p className="w-full text-left font-bold text-sm md:text-base 
                            select-none truncate
                        text-black dark:text-white">
                    Nombre de usuario
                </p>

                <div className="border border-gray-500 dark:border-gray-200 p-2">
                    <input
                        className="w-full text-base md:text-xl
                                border-0 focus:outline-none
                                text-black dark:text-white"
                        type="text"
                        placeholder="wanduUsuario123" />
                </div>
            </div>

            <div className="flex flex-col gap-3">
                <p className="w-full text-left font-bold text-sm md:text-base 
                            select-none truncate
                        text-black dark:text-white">
                    Contraseña
                </p>

                <div className="border border-gray-500 dark:border-gray-200 p-2
                                flex flex-row items-center justify-between">
                    <input
                        className="w-[90%] text-base md:text-xl
                                focus:outline-none
                                text-black dark:text-white"
                        type={verContrasena ? "text" : "password"} 
                        placeholder="wandu se fue a la guerra" />

                    <div className="text-base md:text-xl
                                    text-black dark:text-white cursor-pointer"
                        onClick={handleVerContrasena}>
                        
                        {verContrasena ? <HiEye/> : <HiEyeOff />}
                    </div>

                </div>
            </div>

            <BotonAccion 
                className="bg-black text-white active:bg-gray-800"
                
                accion={textoBoton}
            />

        </div>
    );
}