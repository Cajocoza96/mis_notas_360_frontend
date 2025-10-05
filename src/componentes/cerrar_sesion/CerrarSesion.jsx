import React from "react";

import { HiLogout } from "react-icons/hi";

export default function CerrarSesion(){
    return(
        <div className="w-fit text-red-600 p-2 cursor-pointer select-none
                        flex flex-row items-center gap-2">
            <HiLogout className="text-xl md:text-2xl"/> 
            <p className="text-base md:text-xl">Cerrar sesión</p>
        </div>
    );
}