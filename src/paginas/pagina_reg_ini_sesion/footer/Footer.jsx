import React from "react";

import { useLocation, Link } from "react-router-dom";

import infoRegIniSesion from "../../../data/infoRegIniSesion.json";

export default function Footer() {

    const location = useLocation();

    const esRegistro = location.pathname === "/registrar";

    const textoPregunta = esRegistro ? infoRegIniSesion.registrate.preguntaFooter : infoRegIniSesion.iniciar.preguntaFooter;

    const textoEnlace = esRegistro ? infoRegIniSesion.registrate.enlaceFooter : infoRegIniSesion.iniciar.enlaceFooter;

    const rutaDestino = esRegistro ? "/iniciar-sesion" : "/registrar";

    return (
        <div className="w-full p-2 bg-blue-600 dark:bg-black">
            <p className="w-full truncate text-sm md:text-base text-white text-center">
                {textoPregunta} {""}
                <Link to={rutaDestino} className="cursor-pointer underline hover:opacity-80">
                    {textoEnlace}
                </Link>
            </p>
        </div>
    );
}