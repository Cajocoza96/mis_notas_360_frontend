import React from "react";
import BotonRegIniSesion from "../../../componentes/boton_reg_ini_sesion/BotonRegIniSesion";

import { FaFacebook, FaGoogle } from "react-icons/fa";

export default function Cuerpo() {
    return (
        <div className="w-[95%] mx-auto flex flex-col justify-between p-2 gap-2 border border-black">

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

            <>
                <p className="w-full text-left font-bold text-sm md:text-base 
                            select-none truncate
                        text-black dark:text-white">
                    Correo electrónico
                </p>

                <div className="border border-gray-500 dark:border-gray-200">
                    <input
                        className="w-full text-base md:text-xl p-2
                                border-0 focus:outline-none
                                text-black dark:text-white"
                        type="email" name="" id=""
                        placeholder="correo@email.com" />
                </div>
            </>

            <>
                <p className="w-full text-left font-bold text-sm md:text-base 
                            select-none truncate
                        text-black dark:text-white">
                    Contraseña
                </p>

                <div className="border border-gray-500 dark:border-gray-200">
                    <input
                        className="w-full text-base md:text-xl p-2
                                border-0 focus:outline-none
                                text-black dark:text-white"
                        type="password" name="" id=""
                        placeholder="wandu se fue a la guerra" />
                </div>
            </>



        </div>
    );
}