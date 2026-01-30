import React from "react";

export default function BotonAccion({ accion, className="", ...props}){
    return(
        <button className={`w-fit select-none font-semibold shadow-xl text-center
                            flex flex-col items-center justify-center
                            text-base md:text-lg px-8 py-2 ${className}`} {...props}>
            {accion}
        </button>
    );
}