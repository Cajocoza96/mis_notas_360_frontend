import React from "react";
import { useLocation } from "react-router-dom";
import BotonRegIniSesion from "./boton_reg_ini_sesion/BotonRegIniSesion";
import CorreoContrasena from "./correo_contrasena/CorreoContrasena";

import { FaFacebook, FaGoogle } from "react-icons/fa";

import infoRegIniSesion from "../../../data/infoRegIniSesion.json";

export default function Cuerpo() {

    const location = useLocation();

    const esRegistro = location.pathname === "/registrar";

    const textoAccion = esRegistro ? infoRegIniSesion.registrate.accionCuenta : infoRegIniSesion.iniciar.accionCuenta;

    return (
        <div className="w-[95%] mx-auto flex flex-col p-2 gap-2">

            <p className="w-full text-left text-base md:text-xl 
                            font-bold select-none truncate
                        text-black dark:text-white">
                {textoAccion}
            </p>

            <BotonRegIniSesion
                icono={<FaFacebook className="text-base md:text-xl text-blue-600 " />}
                nombreIcono="Facebook"
            />

            <BotonRegIniSesion
                icono={<FaGoogle className="text-base md:text-xl text-red-600" />}
                nombreIcono="Google"
            />

            <p className="w-full text-center text-base md:text-xl 
                            select-none truncate
                        text-black dark:text-white">
                o
            </p>


            <CorreoContrasena />

        </div>
    );
}