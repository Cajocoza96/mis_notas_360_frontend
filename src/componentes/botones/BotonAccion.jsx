import React from "react";

export default function BotonAccion({ accion, className="", ...props}){
    return(
        <button className={`w-fit select-none font-semibold shadow-xl
                            text-base md:text-xl px-8 py-2 cursor-pointer ${className}`} {...props}>
            {accion}
        </button>
    );
}