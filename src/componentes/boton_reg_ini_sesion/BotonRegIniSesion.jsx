import React from "react";

export default function BotonRegIniSesion({ icono, nombreIcono }){
    return(
        <div className="border border-gray-500 dark:border-gray-200 rounded-md p-2
                        flex flex-row items-center justify-center gap-2 cursor-pointer">
            {icono}
            <p className="text-sm md:text-base text-black dark:text-white">{nombreIcono}</p>
        </div>
    );
}