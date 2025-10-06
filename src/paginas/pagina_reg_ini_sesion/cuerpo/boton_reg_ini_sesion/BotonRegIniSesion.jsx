import React from "react";

export default function BotonRegIniSesion({ icono, nombreIcono }){

    return(
        <div className="border border-gray-500 dark:border-gray-600 
                        bg-white dark:bg-black
                        hover:bg-gray-300 dark:hover:bg-gray-900
                        active:bg-gray-200 dark:active:bg-gray-700

                        rounded-md p-2 overflow-hidden
                        flex flex-row items-center justify-center gap-2 cursor-pointer select-none">
            {icono}
            <p className="text-base md:text-xl text-black dark:text-white">{nombreIcono}</p>
        </div>
    );
}