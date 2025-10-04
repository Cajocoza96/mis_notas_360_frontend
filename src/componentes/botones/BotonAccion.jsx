import React from "react";

export default function BotonAccion({ accion, className="", ...props}){
    return(
        <button className={`w-fit text-sm md:text-base select-none cursor-pointer p-2 ${className}`} {...props}>
            {accion}
        </button>
    );
}