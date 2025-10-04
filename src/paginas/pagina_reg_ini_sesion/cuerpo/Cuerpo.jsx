import React from "react";
import BotonRegIniSesion from "./boton_reg_ini_sesion/BotonRegIniSesion";
import CorreoContrasena from "./correo_contrasena/CorreoContrasena";

import { FaFacebook, FaGoogle } from "react-icons/fa";

export default function Cuerpo() {
    return (
        <div className="w-[95%] mx-auto flex flex-col justify-between p-2 gap-2">

            <p className="w-full text-left text-base md:text-xl 
                            font-bold select-none truncate
                        text-black dark:text-white">
                Crea una cuenta
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